// POST /api/checkout -> Create a 1-click Stripe Checkout Session
export async function onRequestPost(context) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  };

  try {
    const data = await context.request.json().catch(() => ({}));
    const amount = parseFloat(data.amount || 25.0);
    const donorName = (data.donorName || data.name || 'Community Backer').slice(0, 60);
    const tier = amount >= 250 ? 5 : (amount >= 100 ? 4 : (amount >= 50 ? 3 : (amount >= 25 ? 2 : 1)));
    const tierNames = { 1: 'Coffee & Shaders', 2: 'Studio Craftsman', 3: 'Agency Powerhouse', 4: 'Enterprise Patron', 5: 'Ecosystem Backer' };
    const tierLabel = tierNames[tier] || 'Custom Backer';

    const origin = new URL(context.request.url).origin;
    const successUrl = data.successUrl || `${origin}/?backer=success&tier=${tier}&amount=${amount}&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = data.cancelUrl || `${origin}/?backer=cancel`;

    const stripeKey = context.env?.STRIPE_SECRET_KEY;

    // If Stripe Secret Key is provided, create direct Stripe Checkout Session via Stripe REST API
    if (stripeKey) {
      const params = new URLSearchParams();
      const tierImageMap = {
        1: `${origin}/assets/images/tier_1_coffee_shaders.png`,
        2: `${origin}/assets/images/tier_2_studio_craftsman.png`,
        3: `${origin}/assets/images/tier_3_agency_powerhouse.png`,
        4: `${origin}/assets/images/tier_4_enterprise_patron.png`,
        5: `${origin}/assets/images/tier_5_ecosystem_backer.png`
      };
      const tierImage = tierImageMap[tier] || `${origin}/assets/images/tier_2_studio_craftsman.png`;

      params.append('payment_method_types[0]', 'card');
      params.append('line_items[0][price_data][currency]', 'usd');
      params.append('line_items[0][price_data][product_data][name]', `Blackboxes Box'em - ${tierLabel} ($${amount} USD)`);
      params.append('line_items[0][price_data][product_data][description]', `Voluntary 1-time contribution by ${donorName}. Unlocks all 8 Backer Shaders, 4 Custom 3D Node Meshes, and Unbranded 4K Embeds.`);
      params.append('line_items[0][price_data][product_data][images][0]', tierImage);
      params.append('line_items[0][price_data][unit_amount]', Math.round(amount * 100).toString());
      params.append('line_items[0][quantity]', '1');
      params.append('mode', 'payment');
      params.append('success_url', successUrl);
      params.append('cancel_url', cancelUrl);
      params.append('metadata[donor_name]', donorName);
      params.append('metadata[tier]', tier.toString());
      params.append('metadata[amount_usd]', amount.toString());

      const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${stripeKey}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      });

      const session = await stripeRes.json();
      if (session.url) {
        return new Response(JSON.stringify({
          status: 'success',
          checkoutUrl: session.url,
          sessionId: session.id
        }), { status: 200, headers: corsHeaders });
      } else {
        return new Response(JSON.stringify({
          error: session.error?.message || 'Failed to create Stripe session',
          fallbackUrl: `https://github.com/sponsors/Axialon`
        }), { status: 400, headers: corsHeaders });
      }
    }

    // Direct Stripe Payment Links / Hosted Gateway Mapping
    const stripePaymentLinks = {
      5: context.env?.STRIPE_PAYMENT_LINK_5 || 'https://buy.stripe.com/boxem_5',
      25: context.env?.STRIPE_PAYMENT_LINK_25 || 'https://buy.stripe.com/boxem_25',
      50: context.env?.STRIPE_PAYMENT_LINK_50 || 'https://buy.stripe.com/boxem_50',
      100: context.env?.STRIPE_PAYMENT_LINK_100 || 'https://buy.stripe.com/boxem_100'
    };

    const token = 'BOXEM-STRIPE-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const targetLink = stripePaymentLinks[amount] || `https://github.com/sponsors/Axialon`;

    return new Response(JSON.stringify({
      status: 'success',
      mode: 'payment_link',
      checkoutUrl: targetLink,
      backerToken: token,
      donorName,
      amountUsd: amount,
      tier,
      message: 'Stripe gateway prepared. Complete payment in checkout.'
    }), { status: 200, headers: corsHeaders });

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
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}
