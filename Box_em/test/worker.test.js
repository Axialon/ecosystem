const assert = require('assert');
const crypto = require('crypto');
const { verifyHmacSha256 } = require('../workers/donationWebhook');

console.log('=== Running Box\'em Cloudflare HMAC & Worker Tests (Task T3.1) ===\n');

async function runWorkerTests() {
  const secret = 'mock_test_hmac_secret_key_testing_only';
  const payload = JSON.stringify({
    donorName: 'Test Patron',
    amount: 50.0,
    platform: 'github_sponsors'
  });

  // Generate valid HMAC SHA-256 signature
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  const validSignature = `sha256=${hmac.digest('hex')}`;

  // Test 1: Valid signature passes verification
  const isValid = await verifyHmacSha256(payload, validSignature, secret);
  assert.strictEqual(isValid, true, 'Valid HMAC signature should pass verification');
  console.log('✔ Test 1 Passed: HMAC SHA-256 signature verified successfully');

  // Test 2: Tampered payload fails verification
  const tamperedPayload = JSON.stringify({
    donorName: 'Test Patron',
    amount: 5000.0, // Tampered amount
    platform: 'github_sponsors'
  });
  const isTamperedValid = await verifyHmacSha256(tamperedPayload, validSignature, secret);
  assert.strictEqual(isTamperedValid, false, 'Tampered payload must fail signature verification');
  console.log('✔ Test 2 Passed: Tampered payload accurately rejected by HMAC guard');

  // Test 3: Invalid signature header fails verification
  const isBadSigValid = await verifyHmacSha256(payload, 'sha256=invalidhex0000', secret);
  assert.strictEqual(isBadSigValid, false, 'Invalid signature header rejected');
  console.log('✔ Test 3 Passed: Invalid header string rejected cleanly without crash');

  console.log('\n======================================================');
  console.log(' ALL WORKER HMAC ACCEPTANCE TESTS PASSED (100%) ');
  console.log('======================================================\n');
}

runWorkerTests().catch(err => {
  console.error('Worker test failed:', err);
  process.exit(1);
});
