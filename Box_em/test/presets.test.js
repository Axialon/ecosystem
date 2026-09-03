const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { validateBoxemConfig } = require('../src/middleware/schemaValidator');

console.log('=== Running Box\'em Presets Library Schema Validation Tests ===\n');

const presetsDir = path.join(__dirname, '../presets');
const files = fs.readdirSync(presetsDir).filter(f => f.endsWith('.json') || f.endsWith('.boxem.json'));

assert.ok(files.length >= 4, 'Must have at least 4 official preset configurations');

files.forEach(file => {
  const filePath = path.join(presetsDir, file);
  const raw = fs.readFileSync(filePath, 'utf8');
  const parsed = JSON.parse(raw);
  const result = validateBoxemConfig(parsed);

  assert.strictEqual(result.valid, true, `Preset "${file}" failed schema validation: ${result.errors.join(', ')}`);
  console.log(`✔ Preset Verified: ${file} (Title: "${parsed.meta.title}")`);
});

console.log('\n======================================================');
console.log(' ALL PRESET CONFIGURATION TESTS PASSED (100%) ');
console.log('======================================================\n');
