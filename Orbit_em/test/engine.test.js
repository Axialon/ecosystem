const assert = require('assert');
const { solveOrbitConstraints } = require('../server.js');
const { validateOrbitConfig } = require('../src/middleware/schemaValidator.js');

console.log('--- RUNNING ORBIT\'EM VERIFICATION SUITE ---');

// Test 1: Math Solver Epsilon & Clamping
const res1 = solveOrbitConstraints(1000, 99.9, 50, 40, 'budget');
assert(res1.monthlyBudget >= 50, 'Budget must be >= 50');
assert(res1.availabilitySla >= 90.0 && res1.availabilitySla <= 99.999, 'SLA must be bounded');
console.log('✔ Test 1: Math Solver Clamping Passed');

// Test 2: Schema Validation
const validPayload = {
  version: "1.0.0",
  meta: { brand: "Blackboxes", app: "Orbit'em", title: "Test Cloud Stack", archetype: "saas_mvp" },
  constraints: { monthlyBudget: 450, availabilitySla: 99.9, p99LatencyMs: 45, opsComplexity: 35, lockMode: "budget" },
  submodules: [{ id: "m1", name: "Edge API", category: "Compute", costShare: 120, status: "active" }],
  visuals: { shaderPreset: "liquid", theme: "dark" }
};
const valResult = validateOrbitConfig(validPayload);
assert(valResult.valid === true, 'Valid payload must pass schema');
console.log('✔ Test 2: Schema Validation Passed');

// Test 3: XSS Sanitization
const maliciousPayload = JSON.parse(JSON.stringify(validPayload));
maliciousPayload.meta.title = "<script>alert('xss')</script> Cloud";
const sanitized = validateOrbitConfig(maliciousPayload);
assert(!sanitized.sanitizedData.meta.title.includes('<script>'), 'XSS tags must be sanitized');
console.log('✔ Test 3: Defensive Sanitization Passed');

console.log('--- ALL ORBIT\'EM TESTS PASSED (3/3) ---');
