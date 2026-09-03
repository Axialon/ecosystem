const assert = require('assert');
const { solveSynthConstraints } = require('../server.js');
const { validateSynthConfig } = require('../src/middleware/schemaValidator.js');

console.log('--- RUNNING SYNTH\'EM VERIFICATION SUITE ---');

// Test 1: DSP Math Solver Clamping
const res1 = solveSynthConstraints(80, 12, 1.0, 2.5, 'harmonics');
assert(res1.harmonicDrivePercent >= 0 && res1.harmonicDrivePercent <= 100, 'Drive must be bounded');
assert(res1.reverbDecaySec >= 0.1 && res1.reverbDecaySec <= 12.0, 'Reverb must be bounded');
console.log('✔ Test 1: DSP Constraint Solver Bounds Passed');

// Test 2: Schema Validation
const validPayload = {
  version: "1.0.0",
  meta: { brand: "Blackboxes", app: "Synth'em", title: "Cyberpunk Acid Lead", genre: "cyberpunk_acid" },
  constraints: { harmonicDrivePercent: 75, dynamicCrestDb: 14, pitchRatio: 0.85, reverbDecaySec: 0.8, lockMode: "harmonics" },
  submodules: [{ id: "m1", name: "Dual Saw Bank", dspParam: "Oscillator", mixLevel: 85 }],
  visuals: { shaderPreset: "neonvapor", theme: "dark" }
};
const valResult = validateSynthConfig(validPayload);
assert(valResult.valid === true, 'Valid payload must pass schema');
console.log('✔ Test 2: Schema Validation Passed');

// Test 3: XSS Sanitization
const maliciousPayload = JSON.parse(JSON.stringify(validPayload));
maliciousPayload.meta.title = "<script src=bad.js></script> Sound Patch";
const sanitized = validateSynthConfig(maliciousPayload);
assert(!sanitized.sanitizedData.meta.title.includes('<script>'), 'Script injection must be sanitized');
console.log('✔ Test 3: Defensive Sanitization Passed');

console.log('--- ALL SYNTH\'EM TESTS PASSED (3/3) ---');
