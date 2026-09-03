/**
 * Blackboxes Box'em - Serverless Edge Webhook & HMAC Handler (Task T3.1)
 * Cloudflare Worker for verifying Open Collective / GitHub Sponsors webhooks and writing to D1 SQL.
 */

const crypto = typeof globalThis !== 'undefined' && globalThis.crypto ? globalThis.crypto : require('crypto').webcrypto;

/**
 * Verify HMAC SHA-256 signature against raw payload.
 * @param {string} payload - Raw JSON string
 * @param {string} signatureHeader - Header value e.g. "sha256=abcdef..."
 * @param {string} secret - Webhook HMAC secret
 * @returns {Promise<boolean>}
 */
async function verifyHmacSha256(payload, signatureHeader, secret) {
  if (!signatureHeader || !secret) return false;

  const expectedPrefix = 'sha256=';
  const providedHex = signatureHeader.startsWith(expectedPrefix) 
    ? signatureHeader.slice(expectedPrefix.length) 
    : signatureHeader;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify', 'sign']
  );

  const signatureBuffer = new Uint8Array(
    providedHex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
  );

  return await crypto.subtle.verify(
    'HMAC',
    key,
    signatureBuffer,
    encoder.encode(payload)
  );
}

/**
 * Cloudflare Worker Fetch Event Handler
 */
const workerHandler = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // CORS Headers for zero-friction edge consumption
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Hub-Signature-256, Authorization',
      'Content-Type': 'application/json'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // GET /api/donations/live -> Public real-time ticker stream for 3D showcase
    if (request.method === 'GET' && url.pathname === '/api/donations/live') {
      try {
        if (!env || !env.DB) {
          // Fallback baseline payload for offline/local environment
          return new Response(JSON.stringify({
            status: 'ok',
            totalUsd: 55.0,
            targetUsd: 2500,
            backerCount: 2,
            recent: [
              { donorName: 'Founding Backer', amountUsd: 50.0, tier: 3, unlockedTheme: 'all', timestamp: new Date(Date.now() - 3600000).toISOString() },
              { donorName: 'Community Supporter', amountUsd: 5.0, tier: 1, unlockedTheme: 'kintsugi', timestamp: new Date().toISOString() }
            ]
          }), { status: 200, headers: corsHeaders });
        }

        const { results } = await env.DB.prepare(
          `SELECT d.id, s.donor_name, d.amount_usd, d.unlocked_theme, d.event_timestamp 
           FROM donation_events d 
           LEFT JOIN supporters s ON d.supporter_id = s.id 
           ORDER BY d.event_timestamp DESC LIMIT 15`
        ).all();

        return new Response(JSON.stringify({ status: 'ok', donations: results }), {
          status: 200,
          headers: corsHeaders
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
      }
    }

    // POST /api/webhooks/sponsors -> HMAC Authenticated Ingestion
    if (request.method === 'POST' && url.pathname === '/api/webhooks/sponsors') {
      const signature = request.headers.get('X-Hub-Signature-256');
      const rawBody = await request.text();
      const secret = env?.WEBHOOK_SECRET || 'dev_secret_boxem';

      const isValid = await verifyHmacSha256(rawBody, signature, secret);
      if (!isValid) {
        return new Response(JSON.stringify({ error: 'Invalid HMAC signature' }), {
          status: 401,
          headers: corsHeaders
        });
      }

      try {
        const data = JSON.parse(rawBody);
        const donorName = (data.donorName || data.sender?.login || 'Anonymous').slice(0, 50);
        const amountUsd = parseFloat(data.amount || data.tier?.monthly_price_in_cents / 100 || 10.0);
        const eventId = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
        const supporterId = `sup_${donorName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

        if (env && env.DB) {
          // Batch atomic D1 SQL transaction
          await env.DB.batch([
            env.DB.prepare(
              `INSERT INTO supporters (id, donor_name, total_donated_usd) 
               VALUES (?, ?, ?) 
               ON CONFLICT(id) DO UPDATE SET total_donated_usd = total_donated_usd + ?`
            ).bind(supporterId, donorName, amountUsd, amountUsd),
            env.DB.prepare(
              `INSERT INTO donation_events (id, supporter_id, platform, amount_usd, unlocked_theme) 
               VALUES (?, ?, 'github_sponsors', ?, 'kintsugi')`
            ).bind(eventId, supporterId, amountUsd)
          ]);
        }

        return new Response(JSON.stringify({
          status: 'success',
          eventId,
          supporterId,
          unlockedTheme: 'kintsugi',
          message: 'Donation processed and 3D Kintsugi theme unlocked'
        }), { status: 200, headers: corsHeaders });

      } catch (err) {
        return new Response(JSON.stringify({ error: 'Payload processing error: ' + err.message }), {
          status: 400,
          headers: corsHeaders
        });
      }
    }

    return new Response(JSON.stringify({ error: 'Endpoint not found' }), { status: 404, headers: corsHeaders });
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { workerHandler, verifyHmacSha256 };
}
