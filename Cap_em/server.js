/**
 * Blackboxes Cap'em - Local Development & AI Agent REST API Server
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 8083;

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

const SECTORS = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/data/cap_sectors.json'), 'utf8'));
const SECTOR_MAP = {};
SECTORS.forEach(s => { SECTOR_MAP[s.id] = s; });

function solveCapConstraints(capital, valuation, runway, esop, founder, lockMode) {
  let cap = Math.max(50000, Math.min(100000000, Number(capital) || 750000));
  let val = Math.max(500000, Math.min(500000000, Number(valuation) || 7500000));
  let run = Math.max(3, Math.min(60, Number(runway) || 18));
  let esp = Math.max(0, Math.min(30, Number(esop) || 10.0));
  let fnd = Math.max(10, Math.min(100, Number(founder) || 80.0));

  if (lockMode === 'equity') {
    const investorShare = Math.max(1.0, Math.min(50.0, (cap / val) * 100.0));
    fnd = Number((100.0 - investorShare - esp).toFixed(1));
  } else if (lockMode === 'valuation') {
    const investorShare = Math.max(1.0, 100.0 - fnd - esp);
    val = Math.round(cap / (investorShare / 100.0));
  } else if (lockMode === 'capital') {
    const investorShare = Math.max(1.0, 100.0 - fnd - esp);
    cap = Math.round(val * (investorShare / 100.0));
  }

  return { capitalRaisedUsd: cap, postMoneyValuationUsd: val, runwayMonths: run, esopPoolPercent: esp, founderEquityPercent: fnd };
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

  if (pathname === '/api/sectors') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ sectors: SECTORS }, null, 2));
    return;
  }

  if (pathname === '/api/model' && req.method === 'GET') {
    const q = parsedUrl.query;
    const sec = SECTOR_MAP[q.sector] || SECTORS[0];
    const capital = q.capital ? Number(q.capital) : sec.defaults.capitalRaisedUsd;
    const val = q.val ? Number(q.val) : sec.defaults.postMoneyValuationUsd;
    const runway = q.runway ? Number(q.runway) : sec.defaults.runwayMonths;
    const esop = q.esop ? Number(q.esop) : sec.defaults.esopPoolPercent;
    const founder = q.founder ? Number(q.founder) : sec.defaults.founderEquityPercent;
    const lock = q.lock || sec.defaults.lockMode;

    const solved = solveCapConstraints(capital, val, runway, esop, founder, lock);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      app: "Cap'em",
      sector: sec.id,
      name: sec.name,
      constraints: solved,
      submodules: sec.submodules,
      aiPromptContext: `Cap Table: ${sec.name} | Capital Raised: $${solved.capitalRaisedUsd} | Post-Money: $${solved.postMoneyValuationUsd} | Runway: ${solved.runwayMonths}mo | Founder: ${solved.founderEquityPercent}%`
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
    console.log(`[Cap'em] Server running at http://localhost:${PORT}`);
  });
}

module.exports = { server, solveCapConstraints };
