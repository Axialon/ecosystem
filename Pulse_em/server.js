/**
 * Blackboxes Pulse'em - Local Development & AI Agent REST API Server
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 8082;

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

const PROTOCOLS = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/data/biometric_protocols.json'), 'utf8'));
const PROTOCOL_MAP = {};
PROTOCOLS.forEach(p => { PROTOCOL_MAP[p.id] = p; });

function solvePulseConstraints(strain, recovery, fuel, longevity, lockMode) {
  let str = Math.max(50, Math.min(1500, Number(strain) || 380));
  let rec = Math.max(10, Math.min(200, Number(recovery) || 85));
  let fue = Math.max(20, Math.min(200, Number(fuel) || 100));
  let lon = Math.max(10, Math.min(150, Number(longevity) || 125));

  const N_rec = rec / 75.0;
  const N_str = str / 600.0;
  const N_fue = fue / 100.0;

  if (lockMode === 'recovery') {
    const requiredRecovery = Math.round(75 * Math.pow(N_str / Math.max(0.2, N_fue), 0.7));
    rec = Math.max(20, Math.min(200, requiredRecovery));
  } else if (lockMode === 'strain') {
    const allowableStrain = Math.round(600 * Math.pow(N_rec * N_fue, 1.2));
    str = Math.max(50, Math.min(1500, allowableStrain));
  } else if (lockMode === 'fuel') {
    const requiredFuel = Math.round(100 * (N_str / Math.max(0.3, N_rec)));
    fue = Math.max(30, Math.min(200, requiredFuel));
  } else if (lockMode === 'longevity') {
    const targetLongevity = Math.round(100 * (N_rec / Math.max(0.4, N_str)) * (1.0 + (N_fue > 1.2 ? -0.1 : 0.1)));
    lon = Math.max(10, Math.min(150, targetLongevity));
  }

  return { trainingStrainTrimp: str, autonomicRecoveryHrv: rec, metabolicFuelingPercent: fue, longevityScore: lon };
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

  if (pathname === '/api/protocols') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ protocols: PROTOCOLS }, null, 2));
    return;
  }

  if (pathname === '/api/model' && req.method === 'GET') {
    const q = parsedUrl.query;
    const proto = PROTOCOL_MAP[q.proto] || PROTOCOLS[0];
    const strain = q.strain ? Number(q.strain) : proto.defaults.trainingStrainTrimp;
    const recovery = q.recovery ? Number(q.recovery) : proto.defaults.autonomicRecoveryHrv;
    const fuel = q.fuel ? Number(q.fuel) : proto.defaults.metabolicFuelingPercent;
    const longevity = q.longevity ? Number(q.longevity) : proto.defaults.longevityScore;
    const lock = q.lock || proto.defaults.lockMode;

    const solved = solvePulseConstraints(strain, recovery, fuel, longevity, lock);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      app: "Pulse'em",
      protocol: proto.id,
      name: proto.name,
      constraints: solved,
      submodules: proto.submodules,
      aiPromptContext: `Biometric Protocol: ${proto.name} | Strain: ${solved.trainingStrainTrimp} TRIMP | HRV: ${solved.autonomicRecoveryHrv}ms | Fueling: ${solved.metabolicFuelingPercent}% | Longevity: ${solved.longevityScore}`
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
    console.log(`[Pulse'em] Server running at http://localhost:${PORT}`);
  });
}

module.exports = { server, solvePulseConstraints };
