const assert = require('assert');
const { solveBalanceConstraints } = require('../server.js');
const { validateBalanceConfig } = require('../src/middleware/schemaValidator.js');

console.log('--- RUNNING BALANC\'EM VERIFICATION SUITE ---');

// Test 1: Math Solver Clamping
const res1 = solveBalanceConstraints(1000, 15000, 75, 120, 'dps');
assert(res1.damagePerSecondDps >= 10 && res1.damagePerSecondDps <= 5000, 'DPS must be bounded');
assert(res1.effectiveHealthPoolEhp >= 100 && res1.effectiveHealthPoolEhp <= 50000, 'EHP must be bounded');
console.log('✔ Test 1: Combat Balancing Solver Bounds Passed');

// Test 2: Schema Validation
const validPayload = {
  version: "1.0.0",
  meta: { brand: "Blackboxes", app: "Balanc'em", title: "Heavy Knight Balance", archetype: "soulslike_boss" },
  constraints: { damagePerSecondDps: 780, effectiveHealthPoolEhp: 18500, resourceCostCooldown: 85, skillCeilingApm: 90, lockMode: "ehp" },
  submodules: [{ id: "m1", name: "Colossal Greatsword Slam", type: "Heavy Attack", powerScore: 92 }],
  visuals: { shaderPreset: "damascus", theme: "dark" }
};
const valResult = validateBalanceConfig(validPayload);
assert(valResult.valid === true, 'Valid payload must pass schema');
console.log('✔ Test 2: Schema Validation Passed');

// Test 3: XSS Sanitization
const maliciousPayload = JSON.parse(JSON.stringify(validPayload));
maliciousPayload.meta.title = "<script>alert('pwn')</script> Boss Balance";
const sanitized = validateBalanceConfig(maliciousPayload);
assert(!sanitized.sanitizedData.meta.title.includes('<script>'), 'Script injection must be sanitized');
console.log('✔ Test 3: Defensive Sanitization Passed');

console.log('--- ALL BALANC\'EM TESTS PASSED (3/3) ---');
