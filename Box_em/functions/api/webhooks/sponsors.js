// POST /api/webhooks/sponsors -> HMAC SHA-256 Ingestion for GitHub Sponsors / Open Collective
export async function onRequestPost(context) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Hub-Signature-256',
    'Content-Type': 'application/json'
  };

  const rawBody = await context.request.text();
  const signature = context.request.headers.get('X-Hub-Signature-256');

  // Verify HMAC if signature header is provided
  if (signature) {
    const secret = context.env?.WEBHOOK_SECRET || 'dev_secret_boxem';
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    const expectedPrefix = 'sha256=';
    const providedHex = signature.startsWith(expectedPrefix) ? signature.slice(expectedPrefix.length) : signature;
    const signatureBuffer = new Uint8Array(providedHex.match(/.{1,2}/g)?.map(b => parseInt(b, 16)) || []);
    const isValid = await crypto.subtle.verify('HMAC', key, signatureBuffer, encoder.encode(rawBody));
    if (!isValid) {
      return new Response(JSON.stringify({ error: 'Invalid HMAC signature' }), { status: 401, headers: corsHeaders });
    }
  }

  let data = {};
  try { data = JSON.parse(rawBody); } catch (e) {}

  const donorName = data.donorName || data.sender?.login || 'GitHub Sponsor';
  const amountUsd = parseFloat(data.amount || (data.tier?.monthly_price_in_cents ? data.tier.monthly_price_in_cents / 100 : 25.0));
  const tier = amountUsd >= 100 ? 4 : (amountUsd >= 50 ? 3 : (amountUsd >= 25 ? 2 : 1));

  return new Response(JSON.stringify({
    status: 'success',
    donorName,
    amountUsd,
    tier,
    unlockedTheme: 'all',
    message: 'Webhook processed successfully'
  }), {
    status: 200,
    headers: corsHeaders
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Hub-Signature-256'
    }
  });
}
