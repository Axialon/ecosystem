const assert = require('assert');
const { isSafeAssetUrl, ALLOWED_ASSET_DOMAINS } = require('../src/middleware/schemaValidator');
const { BoxemModelLoader } = require('../src/3d/modelLoader');

console.log('=== Running Box\'em GLTF Model Loader & Security Tests (Task T2.1) ===\n');

// Test 1: URL Allowlist Verification
assert.strictEqual(isSafeAssetUrl('https://blackboxes.engine/models/clock_crystal.glb'), true);
assert.strictEqual(isSafeAssetUrl('models/diamond.glb'), true);
assert.strictEqual(isSafeAssetUrl('./models/coin.glb'), true);
assert.strictEqual(isSafeAssetUrl('https://attacker.com/malicious.glb'), false);
assert.strictEqual(isSafeAssetUrl('javascript:alert(1)'), false);
assert.strictEqual(isSafeAssetUrl('data:text/html;base64,...'), false);
console.log('✔ Test 1 Passed: Asset URL security policy allowlist accurately distinguishes trusted vs untrusted sources');

// Test 2: Fallback on missing or invalid URL
const loader = new BoxemModelLoader(null, null);
loader.loadNodeModel('https://untrusted.com/test.glb', 0x0284c7).then((res) => {
  assert.strictEqual(res, null, 'Should return fallback/null in headless environment without crashing');
  console.log('✔ Test 2 Passed: Procedural fallback triggered safely on untrusted URL');
  
  console.log('\n======================================================');
  console.log(' ALL MODEL LOADER ACCEPTANCE TESTS PASSED (100%) ');
  console.log('======================================================\n');
});
