/**
 * End-to-End Local Static Server & Asset Serving Test
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== Running Box\'em Local Server & Visual Asset Delivery Tests ===\n');

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.glb': 'model/gltf-binary',
  '.css': 'text/css'
};

const server = http.createServer((req, res) => {
  const cleanUrl = req.url.split('?')[0];
  let filePath = path.join(__dirname, '..', cleanUrl === '/' ? 'index.html' : cleanUrl);

  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': contentType });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(8089, async () => {
  console.log('✔ Local test server listening on http://127.0.0.1:8089');

  const urlsToTest = [
    { url: 'http://127.0.0.1:8089/', expectedType: 'text/html', name: 'Master Engine HTML Bundle' },
    { url: 'http://127.0.0.1:8089/models/clock_crystal.glb', expectedType: 'model/gltf-binary', name: 'Time Node 3D GLB' },
    { url: 'http://127.0.0.1:8089/models/coin_gem.glb', expectedType: 'model/gltf-binary', name: 'Cost Node 3D GLB' },
    { url: 'http://127.0.0.1:8089/models/diamond_core.glb', expectedType: 'model/gltf-binary', name: 'Quality Node 3D GLB' },
    { url: 'http://127.0.0.1:8089/models/cube_matrix.glb', expectedType: 'model/gltf-binary', name: 'Scope Node 3D GLB' },
    { url: 'http://127.0.0.1:8089/schemas/v1.schema.json', expectedType: 'application/json', name: 'V1 JSON Schema' },
    { url: 'http://127.0.0.1:8089/presets/software_agency_craft.boxem.json', expectedType: 'application/json', name: 'Software Agency Preset' }
  ];

  try {
    for (const item of urlsToTest) {
      const response = await fetch(item.url);
      assert.strictEqual(response.status, 200, `HTTP status for ${item.name} should be 200`);
      assert.strictEqual(response.headers.get('content-type'), item.expectedType, `Content-Type mismatch on ${item.name}`);
      const arrayBuf = await response.arrayBuffer();
      assert.ok(arrayBuf.byteLength > 100, `Resource ${item.name} payload is too small`);
      console.log(`✔ Served Successfully: ${item.name} (${arrayBuf.byteLength} bytes)`);
    }

    console.log('\n======================================================');
    console.log(' ALL LOCAL VISUAL ENGINE & ASSET SERVING TESTS PASSED ');
    console.log('======================================================\n');
  } catch (err) {
    console.error('Server test failure:', err);
    process.exit(1);
  } finally {
    server.close();
  }
});
