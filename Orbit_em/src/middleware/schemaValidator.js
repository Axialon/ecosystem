/**
 * Blackboxes Orbit'em - JSON Schema & Import Guard Middleware
 * Validates and sanitizes incoming .orbit.json configurations before WebGL state injection.
 */

const ALLOWED_ASSET_DOMAINS = [
  'https://blackboxes.engine/models/',
  'models/',
  './models/'
];

const VALID_LOCK_MODES = ['budget', 'sla', 'latency', 'complexity'];
const VALID_SHADERS = [
  'classic', 'quartz', 'emerald', 'liquid', 'polar', 'magma', 'rose', 'nebula',
  'citrine', 'aquamarine', 'amethyst', 'titanium',
  'kintsugi', 'abyssal', 'solar', 'opaline', 'damascus', 'neonvapor', 'carbon', 'voidsingularity'
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

function validateOrbitConfig(payload) {
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
    if (payload.meta.app !== "Orbit'em") errors.push('meta.app must be "Orbit\'em"');
    if (!payload.meta.title) errors.push('meta.title is required');
  }

  if (!payload.constraints || typeof payload.constraints !== 'object') {
    errors.push('Missing "constraints" section');
  } else {
    const c = payload.constraints;
    if (typeof c.monthlyBudget !== 'number' || c.monthlyBudget < 50 || c.monthlyBudget > 500000) {
      errors.push('constraints.monthlyBudget must be between 50 and 500,000');
    }
    if (typeof c.availabilitySla !== 'number' || c.availabilitySla < 90.0 || c.availabilitySla > 99.999) {
      errors.push('constraints.availabilitySla must be between 90.0 and 99.999');
    }
    if (typeof c.p99LatencyMs !== 'number' || c.p99LatencyMs < 1 || c.p99LatencyMs > 2000) {
      errors.push('constraints.p99LatencyMs must be between 1 and 2,000');
    }
    if (typeof c.opsComplexity !== 'number' || c.opsComplexity < 10 || c.opsComplexity > 250) {
      errors.push('constraints.opsComplexity must be between 10 and 250');
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
      $schema: "https://blackboxes.engine/schema/orbitem/v1.json",
      version: payload.version,
      meta: {
        brand: "Blackboxes",
        app: "Orbit'em",
        title: sanitizeString(payload.meta.title, 100),
        archetype: sanitizeString(payload.meta.archetype, 60),
        preset: sanitizeString(payload.meta.preset || "Custom Cloud Spec", 60),
        author: sanitizeString(payload.meta.author || "Anonymous Architect", 60)
      },
      constraints: {
        monthlyBudget: Math.max(50, Math.min(500000, Math.round(payload.constraints.monthlyBudget))),
        availabilitySla: Math.max(90.0, Math.min(99.999, Number(payload.constraints.availabilitySla.toFixed(4)))),
        p99LatencyMs: Math.max(1, Math.min(2000, Math.round(payload.constraints.p99LatencyMs))),
        opsComplexity: Math.max(10, Math.min(250, Math.round(payload.constraints.opsComplexity))),
        lockMode: payload.constraints.lockMode
      },
      submodules: payload.submodules.map((m, idx) => ({
        id: m.id || `mod_${idx + 1}`,
        name: sanitizeString(m.name, 80),
        category: sanitizeString(m.category || "General", 40),
        costShare: Math.max(0, Math.round(m.costShare || 0)),
        status: sanitizeString(m.status || "active", 20)
      })),
      visuals: {
        shaderPreset: VALID_SHADERS.includes(payload.visuals?.shaderPreset) ? payload.visuals.shaderPreset : 'liquid',
        theme: VALID_THEMES.includes(payload.visuals?.theme) ? payload.visuals.theme : 'dark'
      }
    }
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { validateOrbitConfig, sanitizeString };
}
