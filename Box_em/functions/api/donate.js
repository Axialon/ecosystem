// POST /api/donate -> Process voluntary donation & issue backer unlock token
export async function onRequestPost(context) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  };

  try {
    const data = await context.request.json().catch(() => ({}));
    const donorName = (data.donorName || data.name || data.sender?.login || 'Community Supporter').slice(0, 50);
    const amountUsd = parseFloat(data.amount || data.amountUsd || 25.0);
    const tier = amountUsd >= 100 ? 4 : (amountUsd >= 50 ? 3 : (amountUsd >= 25 ? 2 : 1));

    const token = 'BOXEM-BACKER-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    const result = {
      status: 'success',
      donorName,
      amountUsd,
      tier,
      backerToken: token,
      unlockedShaders: [
        'kintsugi', 'abyssal', 'supernova', 'opaline',
        'damascus', 'neon_vapor', 'carbon_lattice', 'void_singularity'
      ],
      unlockedFeatures: [
        'custom_3d_node_meshes',
        'unbranded_4k_embeds',
        'unrestricted_matrix_export',
        'verified_supporter_badge'
      ],
      timestamp: new Date().toISOString(),
      message: 'Thank you for backing Box\'em! All 8 Backer-Exclusive Shaders and custom mesh assignments are unlocked permanently.'
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: corsHeaders
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: corsHeaders
    });
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
