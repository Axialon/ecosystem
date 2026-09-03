const assert = require('assert');
const { solveCapConstraints } = require('../server.js');
const { validateCapConfig } = require('../src/middleware/schemaValidator.js');

console.log('--- RUNNING CAP\'EM VERIFICATION SUITE ---');

// Test 1: Math Solver Clamping
const res1 = solveCapConstraints(500000, 5000000, 18, 80, 'equity');
assert(res1.postMoneyValuationUsd >= 500000, 'Valuation must be >= 500k');
assert(res1.founderEquityPercent >= 5.0 && res1.founderEquityPercent <= 100.0, 'Equity must be bounded');
console.log('✔ Test 1: Cap Table Solver Bounds Passed');

// Test 2: Schema Validation
const validPayload = {
  version: "1.0.0",
  meta: { brand: "Blackboxes", app: "Cap'em", title: "Test Seed Round", sector: "seed_saas" },
  constraints: { capitalRaisedUsd: 2500000, postMoneyValuationUsd: 12500000, runwayMonths: 24, founderEquityPercent: 68.0, lockMode: "valuation" },
  submodules: [{ id: "m1", name: "Founders Common", ownership: 68.0, type: "Common" }],
  visuals: { shaderPreset: "kintsugi", theme: "dark" }
};
const valResult = validateCapConfig(validPayload);
assert(valResult.valid === true, 'Valid payload must pass schema');
console.log('✔ Test 2: Schema Validation Passed');

// Test 3: XSS Sanitization
const maliciousPayload = JSON.parse(JSON.stringify(validPayload));
maliciousPayload.meta.title = "<script>alert('hack')</script> Safe Round";
const sanitized = validateCapConfig(maliciousPayload);
assert(!sanitized.sanitizedData.meta.title.includes('<script>'), 'Script injection must be sanitized');
console.log('✔ Test 3: Defensive Sanitization Passed');

console.log('--- ALL CAP\'EM TESTS PASSED (3/3) ---');
