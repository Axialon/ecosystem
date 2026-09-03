const assert = require('assert');
const { solvePulseConstraints } = require('../server.js');
const { validatePulseConfig } = require('../src/middleware/schemaValidator.js');

console.log('--- RUNNING PULSE\'EM VERIFICATION SUITE ---');

// Test 1: Physiological Math Solver Clamping
const res1 = solvePulseConstraints(500, 80, 100, 100, 'recovery');
assert(res1.trainingStrainTrimp >= 50 && res1.trainingStrainTrimp <= 1500, 'Strain must be bounded');
assert(res1.autonomicRecoveryHrv >= 10 && res1.autonomicRecoveryHrv <= 200, 'HRV must be bounded');
console.log('✔ Test 1: Physiological Solver Bounds Passed');

// Test 2: Schema Validation
const validPayload = {
  version: "1.0.0",
  meta: { brand: "Blackboxes", app: "Pulse'em", title: "Test Protocol", protocol: "zone2_longevity" },
  constraints: { trainingStrainTrimp: 380, autonomicRecoveryHrv: 85, metabolicFuelingPercent: 100, longevityScore: 125, lockMode: "recovery" },
  submodules: [{ id: "m1", name: "Zone 2 Cardio", impact: "Mitochondrial Density", target: "135 BPM" }],
  visuals: { shaderPreset: "abyssal", theme: "dark" }
};
const valResult = validatePulseConfig(validPayload);
assert(valResult.valid === true, 'Valid payload must pass schema');
console.log('✔ Test 2: Schema Validation Passed');

// Test 3: XSS Sanitization
const maliciousPayload = JSON.parse(JSON.stringify(validPayload));
maliciousPayload.meta.title = "<img src=x onerror=alert(1)> Longevity Plan";
const sanitized = validatePulseConfig(maliciousPayload);
assert(!sanitized.sanitizedData.meta.title.includes('<img'), 'HTML injection must be sanitized');
console.log('✔ Test 3: Defensive Sanitization Passed');

console.log('--- ALL PULSE\'EM TESTS PASSED (3/3) ---');
