// POST /api/webhooks/stripe -> Ingest Stripe Webhooks (checkout.session.completed)
export async function onRequestPost(context) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Stripe-Signature',
    'Content-Type': 'application/json'
  };

  try {
    const rawBody = await context.request.text();
    let event;
    try {
      event = JSON.parse(rawBody);
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Invalid JSON payload' }), { status: 400, headers: corsHeaders });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data?.object || {};
      const donorName = session.metadata?.donor_name || session.customer_details?.name || 'Stripe Backer';
      const amountUsd = session.amount_total ? session.amount_total / 100 : parseFloat(session.metadata?.amount_usd || 25);
      const tier = parseInt(session.metadata?.tier || (amountUsd >= 25 ? 2 : 1));

      // Record to D1 if available
      if (context.env?.DB) {
        const eventId = 'evt_' + (session.id || Date.now());
        const supporterId = 'sup_' + donorName.toLowerCase().replace(/[^a-z0-9]/g, '_');
        await context.env.DB.batch([
          context.env.DB.prepare(
            `INSERT INTO supporters (id, donor_name, total_donated_usd) 
             VALUES (?, ?, ?) 
             ON CONFLICT(id) DO UPDATE SET total_donated_usd = total_donated_usd + ?`
          ).bind(supporterId, donorName, amountUsd, amountUsd),
          context.env.DB.prepare(
            `INSERT INTO donation_events (id, supporter_id, platform, amount_usd, unlocked_theme) 
             VALUES (?, ?, 'stripe', ?, 'all')`
          ).bind(eventId, supporterId, amountUsd)
        ]);
      }

      return new Response(JSON.stringify({
        status: 'success',
        message: 'Stripe donation recorded successfully',
        donorName,
        amountUsd,
        tier
      }), { status: 200, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ status: 'ignored', type: event.type }), { status: 200, headers: corsHeaders });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Stripe-Signature'
    }
  });
}
