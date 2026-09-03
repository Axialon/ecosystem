/**
 * Blackboxes Box'em - Local Development & Testing Server
 * Serves single-file bundle, 3D GLB assets, JSON schemas, presets, 225 professions,
 * and AI Agent Programmatic Model API endpoints (/api/model, /api/professions).
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 8080;

// Load local .env if present
try {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envLines = fs.readFileSync(envPath, 'utf8').split('\n');
    envLines.forEach(line => {
      const match = line.trim().match(/^([^=]+)=(.*)$/);
      if (match && !match[1].startsWith('#')) {
        const k = match[1].trim();
        const v = match[2].trim().replace(/^["']|["']$/g, '');
        if (k && !process.env[k]) process.env[k] = v;
      }
    });
  }
} catch (e) {}

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

const PROFESSIONS_DATA = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/data/professions.json'), 'utf8'));
const PROFESSIONS_MAP = {};
PROFESSIONS_DATA.forEach(p => { PROFESSIONS_MAP[p.id] = p; });

const EPSILON = 0.001;

function solveConstraints(time, cost, qual, scope, lockMode, baseRate = 110, minFloor = 7500, enableFloor = true) {
  const t = Math.max(0.5, Math.min(52.0, time));
  const c = Math.max(500, Math.min(1000000, cost));
  const q = Math.max(10, Math.min(200, qual));
  const s = Math.max(10, Math.min(250, scope));

  const Ns = s / 100.0;
  const Nq = q / 100.0;
  const craftQualityRatio = Math.max(0.2, q / 100.0);
  const scopeRatio = Math.max(0.25, s / 100.0);
  const minCraftFloor = enableFloor ? Math.round(minFloor * scopeRatio * Math.pow(craftQualityRatio, 1.25)) : 500;

  let solvedCost = c;
  let solvedTime = t;
  let solvedQual = q;
  let solvedScope = s;

  if (lockMode === 'cost') {
    const rawCost = (25 + 55 * Ns) * baseRate * (0.6 + 0.4 * Math.pow(Nq, 1.35)) * Math.pow(4.0 / Math.max(0.5, t), 0.45);
    const roundedCost = Math.round(rawCost / 250) * 250;
    solvedCost = Math.max(enableFloor ? minCraftFloor : 500, Math.min(1000000, roundedCost));
  } else if (lockMode === 'time') {
    const effectiveYield = Math.max(10, (c / Math.max(1, (25 + 55 * Ns) * (0.6 + 0.4 * Math.pow(Nq, 1.35)))));
    const speedFactor = effectiveYield / Math.max(10, baseRate);
    const targetTime = 4.0 * Math.pow(Math.max(0.1, 1.0 / Math.max(0.2, speedFactor)), 1.0 / 0.45);
    solvedTime = Math.max(0.5, Math.min(52.0, Math.round(targetTime * 10) / 10));
  } else if (lockMode === 'quality') {
    const targetNq = Math.pow(Math.max(0.01, (c / (Math.max(1, (25 + 55 * Ns) * baseRate * Math.pow(4.0 / Math.max(0.5, t), 0.45))) - 0.6) / 0.4), 1.0 / 1.35);
    solvedQual = Math.max(10, Math.min(200, Math.round(targetNq * 100)));
  } else if (lockMode === 'scope') {
    const targetNs = Math.max(0.1, (c / (Math.max(1, baseRate * (0.6 + 0.4 * Math.pow(Nq, 1.35)) * Math.pow(4.0 / Math.max(0.5, t), 0.45))) - 25) / 55);
    solvedScope = Math.max(10, Math.min(250, Math.round((targetNs * 100) / 5) * 5));
  }

  return { timeWeeks: solvedTime, costBudget: solvedCost, qualityPercent: solvedQual, scopePercent: solvedScope };
}

const server = http.createServer((req, res) => {
  // CORS & Anti-Cache Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
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

  // AI Agent API Endpoint: OpenAPI 3.1.0 Specification
  if (pathname === '/api/openapi.json' || pathname === '/openapi.json') {
    const openapiSpec = {
      openapi: "3.1.0",
      info: {
        title: "Blackboxes Box'em Reciprocal Constraint API",
        version: "1.0.0",
        description: "Programmatic AI Agent API for 3D Reciprocal Constraint Solving across 225+ professions."
      },
      servers: [{ url: `http://localhost:${PORT}` }],
      paths: {
        "/api/professions": {
          get: {
            summary: "List 225 researched professions",
            responses: { "200": { description: "Complete professions dataset" } }
          }
        },
        "/api/model": {
          get: {
            summary: "Solve reciprocal constraints and return .boxem.json model",
            parameters: [
              { name: "occ", in: "query", schema: { type: "string" }, description: "Profession ID" },
              { name: "time", in: "query", schema: { type: "number" }, description: "Weeks (0.5 - 52)" },
              { name: "cost", in: "query", schema: { type: "integer" }, description: "Budget in USD" },
              { name: "qual", in: "query", schema: { type: "integer" }, description: "Quality (10 - 200)" },
              { name: "scope", in: "query", schema: { type: "integer" }, description: "Scope % (10 - 250)" },
              { name: "lock", in: "query", schema: { type: "string", enum: ["time", "cost", "quality", "scope"] } }
            ],
            responses: { "200": { description: "Solved .boxem.json payload" } }
          },
          post: {
            summary: "Solve reciprocal constraints from JSON body payload",
            responses: { "200": { description: "Solved .boxem.json payload" } }
          }
        }
      }
    };
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(openapiSpec, null, 2));
    return;
  }

  // AI Agent API Endpoint: List 225 Professions
  if (pathname === '/api/professions') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ total: PROFESSIONS_DATA.length, professions: PROFESSIONS_DATA }));
    return;
  }

  // AI Agent API Endpoint: Solve and return configured 3D .boxem.json model
  if (pathname === '/api/model' || pathname === '/api/solve') {
    const handleSolveRequest = (bodyData = {}) => {
      const q = { ...parsedUrl.query, ...bodyData };
      const occId = q.occ || q.occupation || 'fullstack_web';
      const prof = PROFESSIONS_MAP[occId] || PROFESSIONS_DATA[0];

      const rawTime = q.time !== undefined ? parseFloat(q.time) : (q.timeWeeks !== undefined ? parseFloat(q.timeWeeks) : prof.time);
      const rawCost = q.cost !== undefined ? parseInt(q.cost) : (q.costBudget !== undefined ? parseInt(q.costBudget) : prof.cost);
      const rawQual = q.qual !== undefined ? parseInt(q.qual) : (q.qualityPercent !== undefined ? parseInt(q.qualityPercent) : prof.qual);
      const rawScope = q.scope !== undefined ? parseInt(q.scope) : (q.scopePercent !== undefined ? parseInt(q.scopePercent) : 100);
      const lock = q.lock || q.lockMode || q.solveTarget || 'time';
      const baseRate = q.rate || q.baseRate || prof.rate || 110;
      const minFloor = q.minFloor !== undefined ? parseInt(q.minFloor) : (prof.minFloor || 7500);
      const enableFloor = q.floorOn !== undefined ? (q.floorOn === 'true' || q.floorOn === true) : true;

      const time = Number.isFinite(rawTime) ? Math.max(0.5, Math.min(52.0, rawTime)) : (prof.time || 4.0);
      const cost = Number.isFinite(rawCost) ? Math.max(500, Math.min(1000000, rawCost)) : (prof.cost || 8500);
      const qual = Number.isFinite(rawQual) ? Math.max(10, Math.min(200, rawQual)) : (prof.qual || 88);
      const scope = Number.isFinite(rawScope) ? Math.max(10, Math.min(250, rawScope)) : 100;

      const solved = solveConstraints(time, cost, qual, scope, lock, baseRate, minFloor, enableFloor);

      const modelPayload = {
        "$schema": "https://blackboxes.engine/schema/v1.json",
        "version": "1.0.0",
        "meta": {
          "brand": "Blackboxes",
          "app": "Box'em",
          "title": `${prof.title} Matrix`,
          "occupation": prof.id,
          "author": "AI Agent Protocol Solver",
          "generatedAt": new Date().toISOString()
        },
        "constraints": {
          "timeWeeks": solved.timeWeeks,
          "costBudget": solved.costBudget,
          "qualityPercent": solved.qualityPercent,
          "scopePercent": solved.scopePercent,
          "lockMode": lock,
          "baseRate": baseRate,
          "minFullScopeFloor": minFloor,
          "enableFloorGuarantee": enableFloor
        },
        "submodules": prof.submodules.map((m, idx) => ({
          "id": m.id || `mod_${idx + 1}`,
          "name": m.name,
          "reqQuality": m.reqQuality
        })),
        "visuals": {
          "shaderPreset": q.shader || q.shaderPreset || "classic",
          "fontScale": 1.0,
          "theme": q.theme || "dark"
        }
      };

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(modelPayload, null, 2));
    };

    if (req.method === 'POST') {
      let bodyStr = '';
      req.on('data', chunk => { bodyStr += chunk; });
      req.on('end', () => {
        let bodyData = {};
        if (bodyStr.trim().length > 0) {
          try { bodyData = JSON.parse(bodyStr); } catch (e) {}
        }
        handleSolveRequest(bodyData);
      });
    } else {
      handleSolveRequest();
    }
    return;
  }

  // Edge Supporter Ticker API: GET /api/donations/live
  if (pathname === '/api/donations/live') {
    if (!global.__boxemSupporters) {
      global.__boxemSupporters = [
        { donorName: 'Founding Backer', amountUsd: 50.0, tier: 3, unlockedTheme: 'all', timestamp: new Date(Date.now() - 3600000).toISOString() },
        { donorName: 'Community Supporter', amountUsd: 5.0, tier: 1, unlockedTheme: 'kintsugi', timestamp: new Date().toISOString() }
      ];
    }
    const total = global.__boxemSupporters.reduce((sum, s) => sum + s.amountUsd, 0);
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      status: 'ok',
      totalUsd: total,
      targetUsd: 2500,
      backerCount: global.__boxemSupporters.length,
      recent: global.__boxemSupporters
    }));
    return;
  }

  // Edge Donation & Webhook Ingestion API: POST /api/donate or POST /api/webhooks/sponsors
  if (pathname === '/api/donate' || pathname === '/api/webhooks/sponsors') {
    let bodyStr = '';
    req.on('data', chunk => { bodyStr += chunk; });
    req.on('end', () => {
      try {
        const data = bodyStr ? JSON.parse(bodyStr) : {};
        const donorName = (data.donorName || data.name || data.sender?.login || 'Community Backer').slice(0, 50);
        const amountUsd = parseFloat(data.amount || data.amountUsd || 25.0);
        const tier = amountUsd >= 100 ? 4 : (amountUsd >= 50 ? 3 : (amountUsd >= 25 ? 2 : 1));

        if (!global.__boxemSupporters) {
          global.__boxemSupporters = [];
        }
        const newDonation = {
          id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          donorName,
          amountUsd,
          tier,
          unlockedTheme: 'all',
          timestamp: new Date().toISOString()
        };
        global.__boxemSupporters.unshift(newDonation);
        if (global.__boxemSupporters.length > 25) global.__boxemSupporters.pop();

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          status: 'success',
          donorName,
          amountUsd,
          tier,
          backerToken: 'BOXEM-BACKER-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
          unlockedTheme: 'all',
          message: 'Donation processed successfully. All 8 backer-exclusive shaders and perks unlocked!'
        }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // POST /api/checkout -> Local Stripe Checkout Gateway Simulator
  if (req.method === 'POST' && pathname === '/api/checkout') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body || '{}');
        const amountUsd = parseFloat(data.amount || 25.0);
        const donorName = (data.donorName || data.name || 'Community Backer').slice(0, 50);
        const tier = amountUsd >= 100 ? 4 : (amountUsd >= 50 ? 3 : (amountUsd >= 25 ? 2 : 1));
        const token = 'BOXEM-STRIPE-' + Math.random().toString(36).substr(2, 9).toUpperCase();

        const stripeKey = process.env.STRIPE_SECRET_KEY;
        const checkoutUrl = stripeKey 
          ? `https://checkout.stripe.com/c/pay/cs_live_${token}`
          : `https://github.com/sponsors/Axialon`;

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          status: 'success',
          mode: stripeKey ? 'stripe_checkout_session' : 'stripe_payment_link',
          checkoutUrl: checkoutUrl,
          backerToken: token,
          donorName,
          amountUsd,
          tier,
          message: 'Stripe 2-click checkout session generated.'
        }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // Default File Serving & Clean Route Aliases
  let safePath = path.normalize(decodeURIComponent(pathname)).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  } else if (
    safePath === '/showcase' || safePath === '\\showcase' ||
    safePath === '/explore' || safePath === '\\explore' ||
    safePath === '/overview' || safePath === '\\overview' ||
    safePath === '/about' || safePath === '\\about' ||
    safePath === '/marketing' || safePath === '\\marketing'
  ) {
    safePath = '/marketing.html';
  } else if (safePath === '/schema' || safePath === '\\schema' || safePath === '/schema/boxem.schema.json' || safePath === '\\schema\\boxem.schema.json') {
    safePath = '/schemas/v1.schema.json';
  } else if (safePath === '/assets/models/time.glb' || safePath === '\\assets\\models\\time.glb') {
    safePath = '/models/clock_crystal.glb';
  } else if (safePath === '/assets/models/cost.glb' || safePath === '\\assets\\models\\cost.glb') {
    safePath = '/models/coin_gem.glb';
  } else if (safePath === '/assets/models/quality.glb' || safePath === '\\assets\\models\\quality.glb') {
    safePath = '/models/diamond_core.glb';
  } else if (safePath === '/assets/models/scope.glb' || safePath === '\\assets\\models\\scope.glb') {
    safePath = '/models/cube_matrix.glb';
  }

  const filePath = path.join(__dirname, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(`404 Not Found: ${pathname}`);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size
    });

    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  });
});

if (require.main === module) {
  server.listen(PORT, '0.0.0.0', () => {
    console.log('\n======================================================');
    console.log(`🚀 Blackboxes Box'em Local Server Running!`);
    console.log(`🌐 Local URL:      http://localhost:${PORT}/index.html`);
    console.log(`🤖 AI Agent API:   http://localhost:${PORT}/api/model?occ=fullstack_web`);
    console.log(`📦 225 Researched Professions & 3D Assets Ready`);
    console.log('======================================================\n');
  });
}

module.exports = server;
