const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('=== Running Box\'em 3D GLB Asset Integrity Tests ===\n');

const models = [
  { file: 'clock_crystal.glb', expectedPillar: 'time', minSize: 1024 },
  { file: 'coin_gem.glb', expectedPillar: 'cost', minSize: 1024 },
  { file: 'diamond_core.glb', expectedPillar: 'quality', minSize: 1024 },
  { file: 'cube_matrix.glb', expectedPillar: 'scope', minSize: 1024 },
  { file: 'software_architecture_core.glb', expectedPillar: 'industry_software', minSize: 5000 },
  { file: 'architectural_bim_matrix.glb', expectedPillar: 'industry_bim', minSize: 5000 },
  { file: 'cinematic_vfx_pipeline.glb', expectedPillar: 'industry_vfx', minSize: 5000 },
  { file: 'quantum_ai_robotics.glb', expectedPillar: 'industry_ai', minSize: 5000 },
  { file: 'biomedical_device_matrix.glb', expectedPillar: 'industry_medtech', minSize: 5000 }
];

models.forEach(({ file, expectedPillar, minSize }) => {
  const filePath = path.join(__dirname, '../models', file);
  assert.ok(fs.existsSync(filePath), `Model file ${file} must exist in models/`);

  const stats = fs.statSync(filePath);
  assert.ok(stats.size >= minSize, `Model file ${file} size (${stats.size} bytes) should be at least ${minSize} bytes`);

  // Read binary header for glTF 2.0 Magic bytes ("glTF" = 0x46546C67)
  const buffer = fs.readFileSync(filePath);
  const magic = buffer.toString('ascii', 0, 4);
  assert.strictEqual(magic, 'glTF', `File ${file} must be a valid binary glTF (.glb) container`);

  const version = buffer.readUInt32LE(4);
  assert.strictEqual(version, 2, `File ${file} glTF version must be 2`);

  const length = buffer.readUInt32LE(8);
  assert.strictEqual(length, stats.size, `File ${file} header length must match file size`);

  console.log(`✔ Verified 3D Binary GLB: ${file} (glTF v${version}, ${stats.size} bytes, Magic: ${magic})`);
});

console.log('\n======================================================');
console.log(' ALL 3D MODEL ASSET INTEGRITY TESTS PASSED (100%) ');
console.log('======================================================\n');
