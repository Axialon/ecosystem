/**
 * Blackboxes Synth'em - Local Development & AI Agent REST API Server
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 8084;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon'
};

const PATCHES = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/data/synth_patches.json'), 'utf8'));
const PATCH_MAP = {};
PATCHES.forEach(p => { PATCH_MAP[p.id] = p; });

function solveSynthConstraints(drive, crest, pitch, reverb, lockMode) {
  let drv = Math.max(0, Math.min(100, Number(drive) || 75));
  let crs = Math.max(2, Math.min(24, Number(crest) || 8));
  let pit = Math.max(0.25, Math.min(4.0, Number(pitch) || 1.0));
  let rev = Math.max(0.1, Math.min(15.0, Number(reverb) || 0.8));

  if (lockMode === 'harmonics') {
    crs = Math.max(2, Math.round(24 - (drv / 100.0) * 16));
  } else if (lockMode === 'crest') {
    drv = Math.max(0, Math.round(100 - (crs / 24.0) * 80));
  } else if (lockMode === 'reverb') {
    rev = Math.max(0.1, Number(((drv / 100.0) * 3.5 + 0.2).toFixed(1)));
  }

  return { harmonicDrivePercent: drv, dynamicCrestDb: crs, pitchRatio: pit, reverbDecaySec: rev };
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  if (pathname === '/api/patches') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ patches: PATCHES }, null, 2));
    return;
  }

  if (pathname === '/api/model' && req.method === 'GET') {
    const q = parsedUrl.query;
    const pat = PATCH_MAP[q.patch] || PATCHES[0];
    const drive = q.drive ? Number(q.drive) : pat.defaults.harmonicDrivePercent;
    const crest = q.crest ? Number(q.crest) : pat.defaults.dynamicCrestDb;
    const pitch = q.pitch ? Number(q.pitch) : pat.defaults.pitchRatio;
    const reverb = q.reverb ? Number(q.reverb) : pat.defaults.reverbDecaySec;
    const lock = q.lock || pat.defaults.lockMode;

    const solved = solveSynthConstraints(drive, crest, pitch, reverb, lock);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      app: "Synth'em",
      patch: pat.id,
      name: pat.name,
      constraints: solved,
      submodules: pat.submodules,
      aiPromptContext: `Audio Synth: ${pat.name} | Drive: ${solved.harmonicDrivePercent}% | Crest: ${solved.dynamicCrestDb}dB | Pitch: ${solved.pitchRatio}x | Reverb: ${solved.reverbDecaySec}s`
    }, null, 2));
    return;
  }

  let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': contentType });
  fs.createReadStream(filePath).pipe(res);
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`[Synth'em] Server running at http://localhost:${PORT}`);
  });
}

module.exports = { server, solveSynthConstraints };
