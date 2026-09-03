/**
 * Blackboxes Balanc'em - Local Development & AI Agent REST API Server
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 8085;

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

const ARCHETYPES = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/data/game_archetypes.json'), 'utf8'));
const ARCHETYPE_MAP = {};
ARCHETYPES.forEach(a => { ARCHETYPE_MAP[a.id] = a; });

function solveBalanceConstraints(dps, ehp, resource, skill, lockMode) {
  let d = Math.max(50, Math.min(5000, Number(dps) || 780));
  let e = Math.max(200, Math.min(50000, Number(ehp) || 18500));
  let r = Math.max(10, Math.min(250, Number(resource) || 75));
  let s = Math.max(20, Math.min(400, Number(skill) || 90));

  if (lockMode === 'ehp') {
    const powerBudget = 500.0 * (r / 50.0) * (s / 100.0);
    const targetEhp = Math.round(10000.0 * (powerBudget / Math.max(100, d)));
    e = Math.max(200, Math.min(50000, targetEhp));
  } else if (lockMode === 'dps') {
    const powerBudget = 10000.0 * (r / 50.0) * (s / 100.0);
    const targetDps = Math.round(500.0 * (powerBudget / Math.max(500, e)));
    d = Math.max(50, Math.min(5000, targetDps));
  }

  return { damagePerSecondDps: d, effectiveHealthPoolEhp: e, resourceCostCooldown: r, skillCeilingApm: s };
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

  if (pathname === '/api/archetypes') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ archetypes: ARCHETYPES }, null, 2));
    return;
  }

  if (pathname === '/api/model' && req.method === 'GET') {
    const q = parsedUrl.query;
    const arch = ARCHETYPE_MAP[q.arch] || ARCHETYPES[0];
    const dps = q.dps ? Number(q.dps) : arch.defaults.damagePerSecondDps;
    const ehp = q.ehp ? Number(q.ehp) : arch.defaults.effectiveHealthPoolEhp;
    const resource = q.resource ? Number(q.resource) : arch.defaults.resourceCostCooldown;
    const skill = q.skill ? Number(q.skill) : arch.defaults.skillCeilingApm;
    const lock = q.lock || arch.defaults.lockMode;

    const solved = solveBalanceConstraints(dps, ehp, resource, skill, lock);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      app: "Balanc'em",
      archetype: arch.id,
      name: arch.name,
      constraints: solved,
      submodules: arch.submodules,
      aiPromptContext: `Combat Class: ${arch.name} | DPS: ${solved.damagePerSecondDps} | EHP: ${solved.effectiveHealthPoolEhp} | Cooldown Cost: ${solved.resourceCostCooldown} | APM: ${solved.skillCeilingApm}`
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
    console.log(`[Balanc'em] Server running at http://localhost:${PORT}`);
  });
}

module.exports = { server, solveBalanceConstraints };
