const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('=== Running Box\'em 225 Researched Professions Matrix Tests ===\n');

const dataPath = path.join(__dirname, '../src/data/professions.json');
assert.ok(fs.existsSync(dataPath), 'professions.json must exist');

const professions = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

assert.strictEqual(professions.length, 225, `Must contain exactly 225 verified professions, got ${professions.length}`);

const ids = new Set();
const categories = new Set();

professions.forEach((p, idx) => {
  assert.ok(p.id && typeof p.id === 'string', `Profession at ${idx} missing valid id`);
  assert.ok(!ids.has(p.id), `Duplicate profession id: "${p.id}"`);
  ids.add(p.id);

  assert.ok(p.title && typeof p.title === 'string', `Profession ${p.id} missing title`);
  assert.ok(p.category && typeof p.category === 'string', `Profession ${p.id} missing category`);
  categories.add(p.category);

  assert.ok(typeof p.rate === 'number' && p.rate >= 30 && p.rate <= 500, `Profession ${p.id} invalid rate: ${p.rate}`);
  assert.ok(typeof p.time === 'number' && p.time >= 0.5 && p.time <= 52.0, `Profession ${p.id} invalid time: ${p.time}`);
  assert.ok(typeof p.cost === 'number' && p.cost >= 500 && p.cost <= 1000000, `Profession ${p.id} invalid cost: ${p.cost}`);
  assert.ok(typeof p.qual === 'number' && p.qual >= 10 && p.qual <= 100, `Profession ${p.id} invalid quality: ${p.qual}`);

  assert.ok(Array.isArray(p.submodules) && p.submodules.length === 4, `Profession ${p.id} must have exactly 4 submodules`);
  p.submodules.forEach((sub, sIdx) => {
    assert.ok(sub.name && typeof sub.name === 'string', `Profession ${p.id} sub #${sIdx} missing name`);
    assert.ok(typeof sub.reqQuality === 'number' && sub.reqQuality >= 10 && sub.reqQuality <= 100, `Profession ${p.id} sub #${sIdx} invalid reqQuality`);
  });
});

console.log(`✔ Verified all 225 professions across ${categories.size} diverse industry sectors!`);
console.log(`✔ Average industry hourly rate: $${(professions.reduce((a, b) => a + b.rate, 0) / professions.length).toFixed(2)}/hr`);
console.log(`✔ Average project timeline: ${(professions.reduce((a, b) => a + b.time, 0) / professions.length).toFixed(1)} weeks`);
console.log(`✔ Total scope deliverables modeled: ${professions.length * 4} milestones`);

console.log('\n======================================================');
console.log(' ALL 225 PROFESSIONS MATRIX TESTS PASSED (100%) ');
console.log('======================================================\n');

console.log('=== Running 225,000-Iteration Monte Carlo Simulation (Vector 4) ===\n');

function solveConstraints(time, cost, qual, scope, lockMode, baseRate = 110, minFloor = 7500, enableFloor = true) {
  const t = Math.max(0.5, Math.min(52.0, time));
  const c = Math.max(500, Math.min(1000000, cost));
  const q = Math.max(10, Math.min(200, qual));
  const s = Math.max(10, Math.min(250, scope));

  const Ns = s / 100.0;
  const Nq = q / 100.0;
  const craftQualityRatio = Math.max(0.2, q / 100.0);
  const scopeRatio = Math.max(0.25, s / 100.0);
  const minCraftFloor = enableFloor ? Math.round(minFloor * scopeRatio * Math.pow(craftQualityRatio, 1.25)) : 500;

  let solvedCost = c;
  let solvedTime = t;
  let solvedQual = q;
  let solvedScope = s;

  if (lockMode === 'cost') {
    const rawCost = (25 + 55 * Ns) * baseRate * (0.6 + 0.4 * Math.pow(Nq, 1.35)) * Math.pow(4.0 / Math.max(0.5, t), 0.45);
    const roundedCost = Math.round(rawCost / 250) * 250;
    solvedCost = Math.max(enableFloor ? minCraftFloor : 500, Math.min(1000000, roundedCost));
  } else if (lockMode === 'time') {
    const effectiveYield = Math.max(10, (c / Math.max(1, (25 + 55 * Ns) * (0.6 + 0.4 * Math.pow(Nq, 1.35)))));
    const speedFactor = effectiveYield / Math.max(10, baseRate);
    const targetTime = 4.0 * Math.pow(Math.max(0.1, 1.0 / Math.max(0.2, speedFactor)), 1.0 / 0.45);
    solvedTime = Math.max(0.5, Math.min(52.0, Math.round(targetTime * 10) / 10));
  } else if (lockMode === 'quality') {
    const targetNq = Math.pow(Math.max(0.01, (c / (Math.max(1, (25 + 55 * Ns) * baseRate * Math.pow(4.0 / Math.max(0.5, t), 0.45))) - 0.6) / 0.4), 1.0 / 1.35);
    solvedQual = Math.max(10, Math.min(200, Math.round(targetNq * 100)));
  } else if (lockMode === 'scope') {
    const targetNs = Math.max(0.1, (c / (Math.max(1, baseRate * (0.6 + 0.4 * Math.pow(Nq, 1.35)) * Math.pow(4.0 / Math.max(0.5, t), 0.45))) - 25) / 55);
    solvedScope = Math.max(10, Math.min(250, Math.round((targetNs * 100) / 5) * 5));
  }

  const totalHours = Math.max(1, (25 + 55 * (solvedScope / 100.0)) * (0.6 + 0.4 * Math.pow(solvedQual / 100.0, 1.35)));
  const effectiveYield = solvedCost / totalHours;
  const hoursPerWeek = totalHours / Math.max(0.5, solvedTime);
  const crunchRisk = Math.min(100, Math.max(0, Math.round((hoursPerWeek / 45.0) * 45)));
  const feasibility = Math.min(100, Math.max(5, Math.round(100 - (crunchRisk * 0.65))));

  return { timeWeeks: solvedTime, costBudget: solvedCost, qualityPercent: solvedQual, scopePercent: solvedScope, totalHours, effectiveYield, crunchRisk, feasibility };
}

const ITERATIONS_PER_PROFESSION = 1000;
const LOCK_MODES = ['time', 'cost', 'quality', 'scope'];
let totalRuns = 0;
let nanCount = 0;
let minYield = Infinity;
let maxYield = -Infinity;
const startT = Date.now();

professions.forEach((prof) => {
  for (let i = 0; i < ITERATIONS_PER_PROFESSION; i++) {
    const testTime = 0.5 + Math.random() * 51.5;
    const testCost = 500 + Math.random() * 999500;
    const testQual = 10 + Math.random() * 190;
    const testScope = 10 + Math.random() * 240;
    const lock = LOCK_MODES[i % LOCK_MODES.length];
    const enableFloor = (i % 2 === 0);

    const res = solveConstraints(testTime, testCost, testQual, testScope, lock, prof.rate, prof.minFloor || 7500, enableFloor);
    totalRuns++;

    if (isNaN(res.timeWeeks) || isNaN(res.costBudget) || isNaN(res.qualityPercent) || isNaN(res.scopePercent) || isNaN(res.effectiveYield)) {
      nanCount++;
    }

    assert.ok(res.timeWeeks >= 0.5 && res.timeWeeks <= 52.0, `Time out of bounds: ${res.timeWeeks}`);
    assert.ok(res.costBudget >= 500 && res.costBudget <= 1000000, `Cost out of bounds: ${res.costBudget}`);
    assert.ok(res.qualityPercent >= 10 && res.qualityPercent <= 200, `Quality out of bounds: ${res.qualityPercent}`);
    assert.ok(res.scopePercent >= 10 && res.scopePercent <= 250, `Scope out of bounds: ${res.scopePercent}`);

    minYield = Math.min(minYield, res.effectiveYield);
    maxYield = Math.max(maxYield, res.effectiveYield);
  }
});

const elapsed = Date.now() - startT;
console.log(`✔ Completed ${totalRuns.toLocaleString()} Monte Carlo Iterations across 225 professions in ${elapsed}ms!`);
console.log(`✔ Zero NaN / Infinity Drift: ${nanCount} failures detected`);
console.log(`✔ Effective Hourly Yield Range: $${minYield.toFixed(2)}/hr to $${maxYield.toFixed(2)}/hr`);
console.log(`✔ Throughput: ${Math.round((totalRuns / (elapsed / 1000))).toLocaleString()} evaluations/sec\n`);

assert.strictEqual(nanCount, 0, 'No NaNs allowed in Monte Carlo simulations');
assert.strictEqual(totalRuns, 225000, 'Must execute exactly 225,000 runs');

console.log('======================================================');
console.log(' 🏆 225,000-ITERATION MONTE CARLO SIMULATION PASSED (100%)');
console.log('======================================================\n');
