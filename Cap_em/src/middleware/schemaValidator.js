/**
 * Blackboxes Cap'em - JSON Schema & Import Guard Middleware
 */

const VALID_LOCK_MODES = ['capital', 'valuation', 'runway', 'equity'];
const VALID_SHADERS = [
  'kintsugi', 'emerald', 'damascus', 'carbon', 'classic', 'polar', 'magma', 'abyssal', 'solar', 'voidsingularity'
];
const VALID_THEMES = ['dark', 'light'];

function sanitizeString(str, maxLength = 100) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>'"&]/g, (char) => {
      const entities = { '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;', '&': '&amp;' };
      return entities[char] || '';
    })
    .trim()
    .slice(0, maxLength);
}

function validateCapConfig(payload) {
  const errors = [];
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return { valid: false, errors: ['Payload must be a JSON object'] };
  }

  if (!payload.version || typeof payload.version !== 'string' || !/^\d+\.\d+\.\d+$/.test(payload.version)) {
    errors.push('Invalid or missing version format (expected semver string)');
  }

  if (!payload.meta || typeof payload.meta !== 'object') {
    errors.push('Missing "meta" section');
  } else {
    if (payload.meta.brand !== 'Blackboxes') errors.push('meta.brand must be "Blackboxes"');
    if (payload.meta.app !== "Cap'em") errors.push('meta.app must be "Cap\'em"');
    if (!payload.meta.title) errors.push('meta.title is required');
  }

  if (!payload.constraints || typeof payload.constraints !== 'object') {
    errors.push('Missing "constraints" section');
  } else {
    const c = payload.constraints;
    if (typeof c.capitalRaisedUsd !== 'number' || c.capitalRaisedUsd < 10000 || c.capitalRaisedUsd > 50000000) {
      errors.push('constraints.capitalRaisedUsd must be between 10,000 and 50,000,000');
    }
    if (typeof c.postMoneyValuationUsd !== 'number' || c.postMoneyValuationUsd < 500000 || c.postMoneyValuationUsd > 200000000) {
      errors.push('constraints.postMoneyValuationUsd must be between 500,000 and 200,000,000');
    }
    if (typeof c.runwayMonths !== 'number' || c.runwayMonths < 3 || c.runwayMonths > 48) {
      errors.push('constraints.runwayMonths must be between 3 and 48');
    }
    if (typeof c.founderEquityPercent !== 'number' || c.founderEquityPercent < 5.0 || c.founderEquityPercent > 100.0) {
      errors.push('constraints.founderEquityPercent must be between 5.0 and 100.0');
    }
    if (!VALID_LOCK_MODES.includes(c.lockMode)) {
      errors.push(`constraints.lockMode must be one of: ${VALID_LOCK_MODES.join(', ')}`);
    }
  }

  if (!Array.isArray(payload.submodules) || payload.submodules.length === 0) {
    errors.push('submodules must be a non-empty array');
  }

  if (errors.length > 0) return { valid: false, errors };

  return {
    valid: true,
    errors: [],
    sanitizedData: {
      $schema: "https://blackboxes.engine/schema/capem/v1.json",
      version: payload.version,
      meta: {
        brand: "Blackboxes",
        app: "Cap'em",
        title: sanitizeString(payload.meta.title, 100),
        sector: sanitizeString(payload.meta.sector, 60),
        author: sanitizeString(payload.meta.author || "Anonymous Founder", 60)
      },
      constraints: {
        capitalRaisedUsd: Math.max(10000, Math.min(50000000, Math.round(payload.constraints.capitalRaisedUsd))),
        postMoneyValuationUsd: Math.max(500000, Math.min(200000000, Math.round(payload.constraints.postMoneyValuationUsd))),
        runwayMonths: Math.max(3, Math.min(48, Math.round(payload.constraints.runwayMonths))),
        founderEquityPercent: Math.max(5.0, Math.min(100.0, Number(payload.constraints.founderEquityPercent.toFixed(2)))),
        lockMode: payload.constraints.lockMode
      },
      submodules: payload.submodules.map((m, idx) => ({
        id: m.id || `mod_${idx + 1}`,
        name: sanitizeString(m.name, 80),
        ownership: Math.max(0, Math.min(100, Number(m.ownership.toFixed(2)))),
        type: sanitizeString(m.type || "Common", 40)
      })),
      visuals: {
        shaderPreset: VALID_SHADERS.includes(payload.visuals?.shaderPreset) ? payload.visuals.shaderPreset : 'kintsugi',
        theme: VALID_THEMES.includes(payload.visuals?.theme) ? payload.visuals.theme : 'dark'
      }
    }
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { validateCapConfig, sanitizeString };
}
