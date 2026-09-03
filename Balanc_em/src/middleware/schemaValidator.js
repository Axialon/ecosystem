/**
 * Blackboxes Balanc'em - JSON Schema & Import Guard Middleware
 */

const VALID_LOCK_MODES = ['dps', 'ehp', 'resource', 'skill'];
const VALID_SHADERS = [
  'damascus', 'magma', 'polar', 'voidsingularity', 'classic', 'emerald', 'kintsugi', 'solar', 'neonvapor', 'carbon'
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

function validateBalanceConfig(payload) {
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
    if (payload.meta.app !== "Balanc'em") errors.push('meta.app must be "Balanc\'em"');
    if (!payload.meta.title) errors.push('meta.title is required');
  }

  if (!payload.constraints || typeof payload.constraints !== 'object') {
    errors.push('Missing "constraints" section');
  } else {
    const c = payload.constraints;
    if (typeof c.damagePerSecondDps !== 'number' || c.damagePerSecondDps < 10 || c.damagePerSecondDps > 5000) {
      errors.push('constraints.damagePerSecondDps must be between 10 and 5000');
    }
    if (typeof c.effectiveHealthPoolEhp !== 'number' || c.effectiveHealthPoolEhp < 100 || c.effectiveHealthPoolEhp > 50000) {
      errors.push('constraints.effectiveHealthPoolEhp must be between 100 and 50000');
    }
    if (typeof c.resourceCostCooldown !== 'number' || c.resourceCostCooldown < 5 || c.resourceCostCooldown > 200) {
      errors.push('constraints.resourceCostCooldown must be between 5 and 200');
    }
    if (typeof c.skillCeilingApm !== 'number' || c.skillCeilingApm < 20 || c.skillCeilingApm > 400) {
      errors.push('constraints.skillCeilingApm must be between 20 and 400');
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
      $schema: "https://blackboxes.engine/schema/balancem/v1.json",
      version: payload.version,
      meta: {
        brand: "Blackboxes",
        app: "Balanc'em",
        title: sanitizeString(payload.meta.title, 100),
        archetype: sanitizeString(payload.meta.archetype, 60),
        author: sanitizeString(payload.meta.author || "Anonymous Combat Designer", 60)
      },
      constraints: {
        damagePerSecondDps: Math.max(10, Math.min(5000, Math.round(payload.constraints.damagePerSecondDps))),
        effectiveHealthPoolEhp: Math.max(100, Math.min(50000, Math.round(payload.constraints.effectiveHealthPoolEhp))),
        resourceCostCooldown: Math.max(5, Math.min(200, Math.round(payload.constraints.resourceCostCooldown))),
        skillCeilingApm: Math.max(20, Math.min(400, Math.round(payload.constraints.skillCeilingApm))),
        lockMode: payload.constraints.lockMode
      },
      submodules: payload.submodules.map((m, idx) => ({
        id: m.id || `mod_${idx + 1}`,
        name: sanitizeString(m.name, 80),
        type: sanitizeString(m.type || "Ability", 40),
        powerScore: Math.max(0, Math.min(100, Math.round(m.powerScore || 50)))
      })),
      visuals: {
        shaderPreset: VALID_SHADERS.includes(payload.visuals?.shaderPreset) ? payload.visuals.shaderPreset : 'damascus',
        theme: VALID_THEMES.includes(payload.visuals?.theme) ? payload.visuals.theme : 'dark'
      }
    }
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { validateBalanceConfig, sanitizeString };
}
