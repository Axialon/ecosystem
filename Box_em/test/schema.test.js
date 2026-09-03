const assert = require('assert');
const { validateBoxemConfig, sanitizeString, isSafeAssetUrl } = require('../src/middleware/schemaValidator');

console.log('=== Running Box\'em JSON Schema Middleware Tests (Task T1.1) ===\n');

// Test Case 1: Valid sample config from PLAN.md
const validConfig = {
  "$schema": "https://blackboxes.engine/schema/v1.json",
  "version": "1.0.0",
  "meta": {
    "brand": "Blackboxes",
    "app": "Box'em",
    "title": "Software Engine Core",
    "occupation": "software",
    "preset": "Agency High Craft",
    "author": "Blackboxes Antigravity Agent"
  },
  "constraints": {
    "timeWeeks": 3.0,
    "costBudget": 5500,
    "qualityPercent": 85,
    "scopePercent": 100,
    "lockMode": "time",
    "baseRate": 95
  },
  "submodules": [
    { "id": "m1", "name": "Core Business Logic & API", "reqQuality": 20 },
    { "id": "m2", "name": "Responsive UI/UX Frontend", "reqQuality": 45 },
    { "id": "m3", "name": "Automated QA & Unit Tests", "reqQuality": 75 },
    { "id": "m4", "name": "High-Availability CI/CD & Scale", "reqQuality": 90 }
  ],
  "visuals": {
    "shaderPreset": "classic",
    "fontScale": 1.3,
    "theme": "dark",
    "customNodeModels": {
      "time": "models/clock_crystal.glb",
      "cost": "models/coin_gem.glb",
      "quality": "models/diamond_core.glb",
      "scope": "models/cube_matrix.glb"
    }
  }
};

const res1 = validateBoxemConfig(validConfig);
assert.strictEqual(res1.valid, true, 'Valid config should pass validation');
assert.strictEqual(res1.errors.length, 0);
console.log('✔ Test 1 Passed: Valid Box\'em v1.0.0 payload validated successfully');

// Test Case 2: Reject Malicious XSS / Script Injections
const xssConfig = JSON.parse(JSON.stringify(validConfig));
xssConfig.meta.title = '<script>alert("pwned")</script>Title';
const res2 = validateBoxemConfig(xssConfig);
assert.strictEqual(res2.valid, true);
assert.ok(!res2.sanitizedData.meta.title.includes('<script>'), 'Title should be sanitized against XSS');
console.log('✔ Test 2 Passed: String sanitizer defangs script injections');

// Test Case 3: Reject Disallowed External Asset Domain (SSRF / Malware protection)
const badAssetConfig = JSON.parse(JSON.stringify(validConfig));
badAssetConfig.visuals.customNodeModels.time = 'https://malicious-site.com/exploit.glb';
const res3 = validateBoxemConfig(badAssetConfig);
assert.strictEqual(res3.valid, false, 'Should reject un-allowlisted asset URLs');
assert.ok(res3.errors.some(e => e.includes('violates security allowlist')));
console.log('✔ Test 3 Passed: Asset URL security allowlist rejected external untrusted domain');

// Test Case 4: Out-of-bounds Numerical Constraints
const badBoundsConfig = JSON.parse(JSON.stringify(validConfig));
badBoundsConfig.constraints.timeWeeks = -5;
badBoundsConfig.constraints.qualityPercent = 250;
const res4 = validateBoxemConfig(badBoundsConfig);
assert.strictEqual(res4.valid, false, 'Should reject out-of-bounds numbers');
assert.strictEqual(res4.errors.length, 2);
console.log('✔ Test 4 Passed: Numerical boundary guards rejected negative time and >200% quality');

// Test Case 5: Incorrect Brand Name
const badBrandConfig = JSON.parse(JSON.stringify(validConfig));
badBrandConfig.meta.brand = 'WrongBrand';
const res5 = validateBoxemConfig(badBrandConfig);
assert.strictEqual(res5.valid, false);
console.log('✔ Test 5 Passed: Strict brand identity enforcement passed');

console.log('\n======================================================');
console.log(' ALL SCHEMA VALIDATION ACCEPTANCE TESTS PASSED (100%) ');
console.log('======================================================\n');
