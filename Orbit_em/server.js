/**
 * Blackboxes Orbit'em - Local Development & AI Agent REST API Server
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 8081;

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

const ARCHETYPES = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/data/cloud_archetypes.json'), 'utf8'));
const ARCHETYPE_MAP = {};
ARCHETYPES.forEach(a => { ARCHETYPE_MAP[a.id] = a; });

function solveOrbitConstraints(budget, sla, latency, complexity, lockMode) {
  let b = Math.max(50, Math.min(500000, Number(budget) || 450));
  let s = Math.max(90.0, Math.min(99.999, Number(sla) || 99.9));
  let l = Math.max(1, Math.min(2000, Number(latency) || 45));
  let c = Math.max(10, Math.min(250, Number(complexity) || 35));

  const slaNines = -Math.log10(Math.max(0.00001, 1 - (s / 100.0)));
  const perfFactor = 100.0 / Math.max(5.0, l);

  if (lockMode === 'budget') {
    const estimatedCost = Math.round(150 * Math.pow(slaNines / 3.0, 2.2) * (perfFactor / 2.0) * (c / 35.0));
    b = Math.max(50, Math.min(500000, estimatedCost));
  } else if (lockMode === 'sla') {
    const budgetFactor = Math.max(0.2, b / 1500.0);
    const targetNines = Math.min(5.0, Math.max(1.0, 3.0 * Math.pow(budgetFactor / (c / 50.0), 0.45)));
    s = Number((100.0 - Math.pow(10, -targetNines) * 100.0).toFixed(4));
  } else if (lockMode === 'latency') {
    const targetLatency = Math.max(2, Math.round(100.0 / Math.max(0.2, (b / 500.0) / (c / 40.0))));
    l = Math.min(1000, targetLatency);
  } else if (lockMode === 'complexity') {
    const targetComplexity = Math.max(10, Math.min(250, Math.round(35 * (b / 500.0) / Math.pow(slaNines / 3.0, 1.5))));
    c = targetComplexity;
  }

  return { monthlyBudget: b, availabilitySla: s, p99LatencyMs: l, opsComplexity: c };
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

  // AI Agent API: GET /api/archetypes
  if (pathname === '/api/archetypes') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ archetypes: ARCHETYPES }, null, 2));
    return;
  }

  // AI Agent API: GET /api/model
  if (pathname === '/api/model' && req.method === 'GET') {
    const q = parsedUrl.query;
    const arch = ARCHETYPE_MAP[q.arch] || ARCHETYPES[0];
    const budget = q.budget ? Number(q.budget) : arch.defaults.monthlyBudget;
    const sla = q.sla ? Number(q.sla) : arch.defaults.availabilitySla;
    const latency = q.latency ? Number(q.latency) : arch.defaults.p99LatencyMs;
    const complexity = q.complexity ? Number(q.complexity) : arch.defaults.opsComplexity;
    const lock = q.lock || arch.defaults.lockMode;

    const solved = solveOrbitConstraints(budget, sla, latency, complexity, lock);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      app: "Orbit'em",
      archetype: arch.id,
      name: arch.name,
      constraints: solved,
      submodules: arch.submodules,
      aiPromptContext: `Cloud Architecture: ${arch.name} | Budget: $${solved.monthlyBudget}/mo | SLA: ${solved.availabilitySla}% | Latency p99: ${solved.p99LatencyMs}ms | Ops Complexity: ${solved.opsComplexity}`
    }, null, 2));
    return;
  }

  // Static File Serving
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
    console.log(`[Orbit'em] Server running at http://localhost:${PORT}`);
  });
}

module.exports = { server, solveOrbitConstraints };
