/**
 * Blackboxes Box'em - JSON Schema & Import Guard Middleware (Task T1.1)
 * Validates and sanitizes incoming .boxem.json configurations before WebGL state injection.
 */

const ALLOWED_ASSET_DOMAINS = [
  'https://blackboxes.engine/models/',
  'models/',
  './models/'
];

const VALID_OCCUPATIONS = ['software', 'architecture', 'vfx', 'branding', 'marketing', 'trades', 'medtech', 'robotics', 'custom'];
const VALID_LOCK_MODES = ['time', 'cost', 'quality', 'scope'];
const VALID_SHADERS = [
  'classic', 'quartz', 'emerald', 'liquid', 'polar', 'magma', 'rose', 'nebula',
  'citrine', 'aquamarine', 'amethyst', 'titanium', 'sapphire',
  'kintsugi', 'abyssal', 'solar', 'opaline', 'damascus', 'neonvapor', 'carbon', 'voidsingularity'
];
const VALID_THEMES = ['dark', 'light'];

/**
 * Sanitize strings to prevent XSS / script injection.
 */
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

/**
 * Validate asset URL against safe allowlists.
 */
function isSafeAssetUrl(url) {
  if (!url || typeof url !== 'string') return false;
  // Disallow javascript:, data:, and blob: protocols
  if (/^(javascript:|data:|blob:)/i.test(url)) return false;
  return ALLOWED_ASSET_DOMAINS.some(allowed => url.startsWith(allowed));
}

/**
 * Validate a .boxem.json payload object.
 * @param {Object} payload 
 * @returns {{ valid: boolean, errors: string[], sanitizedData?: Object }}
 */
function validateBoxemConfig(payload) {
  const errors = [];

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return { valid: false, errors: ['Payload must be a JSON object'] };
  }

  // Version check
  if (!payload.version || typeof payload.version !== 'string' || !/^\d+\.\d+\.\d+$/.test(payload.version)) {
    errors.push('Invalid or missing version format (expected semver string, e.g. "1.0.0")');
  }

  // Meta validation
  if (!payload.meta || typeof payload.meta !== 'object') {
    errors.push('Missing "meta" section');
  } else {
    if (payload.meta.brand !== 'Blackboxes') {
      errors.push('meta.brand must be "Blackboxes"');
    }
    if (payload.meta.app !== "Box'em") {
      errors.push('meta.app must be "Box\'em"');
    }
    if (!payload.meta.title || typeof payload.meta.title !== 'string') {
      errors.push('meta.title is required');
    }
    if (!payload.meta.occupation || typeof payload.meta.occupation !== 'string' || !/^[a-zA-Z0-9_ -]+$/.test(payload.meta.occupation)) {
      errors.push('meta.occupation must be a valid alphanumeric identifier string');
    }
  }

  // Constraints validation
  if (!payload.constraints || typeof payload.constraints !== 'object') {
    errors.push('Missing "constraints" section');
  } else {
    const c = payload.constraints;
    if (typeof c.timeWeeks !== 'number' || isNaN(c.timeWeeks) || c.timeWeeks < 0.5 || c.timeWeeks > 52.0) {
      errors.push('constraints.timeWeeks must be a number between 0.5 and 52.0');
    }
    if (typeof c.costBudget !== 'number' || isNaN(c.costBudget) || c.costBudget < 500 || c.costBudget > 1000000) {
      errors.push('constraints.costBudget must be a number between 500 and 1,000,000');
    }
    if (typeof c.qualityPercent !== 'number' || isNaN(c.qualityPercent) || c.qualityPercent < 10 || c.qualityPercent > 200) {
      errors.push('constraints.qualityPercent must be a number between 10 and 200 (supports Grade SS)');
    }
    if (typeof c.scopePercent !== 'number' || isNaN(c.scopePercent) || c.scopePercent < 10 || c.scopePercent > 250) {
      errors.push('constraints.scopePercent must be a number between 10 and 250 (supports Tiers 1-6)');
    }
    if (!VALID_LOCK_MODES.includes(c.lockMode)) {
      errors.push(`constraints.lockMode must be one of: ${VALID_LOCK_MODES.join(', ')}`);
    }
    if (typeof c.baseRate !== 'number' || isNaN(c.baseRate) || c.baseRate < 10 || c.baseRate > 2000) {
      errors.push('constraints.baseRate must be a number between 10 and 2,000');
    }
  }

  // Submodules validation
  if (!Array.isArray(payload.submodules) || payload.submodules.length === 0) {
    errors.push('submodules must be a non-empty array of deliverables');
  } else {
    payload.submodules.forEach((mod, idx) => {
      if (!mod || typeof mod !== 'object') {
        errors.push(`submodules[${idx}] must be an object`);
      } else {
        if (!mod.name || typeof mod.name !== 'string' || mod.name.trim().length === 0) {
          errors.push(`submodules[${idx}].name is required`);
        }
        if (typeof mod.reqQuality !== 'number' || isNaN(mod.reqQuality) || mod.reqQuality < 0 || mod.reqQuality > 150) {
          errors.push(`submodules[${idx}].reqQuality must be between 0 and 150 (supports Grade SS)`);
        }
      }
    });
  }

  // Visuals validation
  if (!payload.visuals || typeof payload.visuals !== 'object') {
    errors.push('Missing "visuals" section');
  } else {
    const v = payload.visuals;
    if (!VALID_SHADERS.includes(v.shaderPreset)) {
      errors.push(`visuals.shaderPreset must be one of: ${VALID_SHADERS.join(', ')}`);
    }
    if (typeof v.fontScale !== 'number' || isNaN(v.fontScale) || v.fontScale < 0.5 || v.fontScale > 3.0) {
      errors.push('visuals.fontScale must be between 0.5 and 3.0');
    }
    if (!VALID_THEMES.includes(v.theme)) {
      errors.push(`visuals.theme must be one of: ${VALID_THEMES.join(', ')}`);
    }
    if (v.customNodeModels && typeof v.customNodeModels === 'object') {
      for (const [pillar, url] of Object.entries(v.customNodeModels)) {
        if (url && !isSafeAssetUrl(url)) {
          errors.push(`visuals.customNodeModels.${pillar} URL violates security allowlist: "${url}"`);
        }
      }
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // Return clean sanitized state
  const sanitizedData = {
    $schema: "https://blackboxes.engine/schema/v1.json",
    version: payload.version,
    meta: {
      brand: "Blackboxes",
      app: "Box'em",
      title: sanitizeString(payload.meta.title, 100),
      occupation: payload.meta.occupation,
      preset: sanitizeString(payload.meta.preset || "Custom Preset", 60),
      author: sanitizeString(payload.meta.author || "Anonymous", 60)
    },
    constraints: {
      timeWeeks: Math.max(0.5, Math.min(52.0, Number(payload.constraints.timeWeeks.toFixed(2)))),
      costBudget: Math.max(500, Math.min(1000000, Math.round(payload.constraints.costBudget))),
      qualityPercent: Math.max(10, Math.min(200, Math.round(payload.constraints.qualityPercent))),
      scopePercent: Math.max(10, Math.min(250, Math.round(payload.constraints.scopePercent))),
      lockMode: payload.constraints.lockMode,
      baseRate: Math.max(10, Math.min(2000, Math.round(payload.constraints.baseRate))),
      minFullScopeFloor: payload.constraints.minFullScopeFloor !== undefined ? Math.max(0, Math.min(100000, Math.round(payload.constraints.minFullScopeFloor))) : undefined,
      enableFloorGuarantee: typeof payload.constraints.enableFloorGuarantee === 'boolean' ? payload.constraints.enableFloorGuarantee : undefined,
      bounds: payload.constraints.bounds || undefined
    },
    submodules: payload.submodules.map((m, idx) => ({
      id: m.id || `mod_${idx + 1}`,
      name: sanitizeString(m.name, 80),
      reqQuality: Math.max(0, Math.min(150, Math.round(m.reqQuality)))
    })),
    visuals: {
      shaderPreset: payload.visuals.shaderPreset,
      fontScale: Math.max(0.5, Math.min(3.0, Number(payload.visuals.fontScale.toFixed(2)))),
      spatialFontScale: payload.visuals.spatialFontScale ? Math.max(0.4, Math.min(3.0, Number(payload.visuals.spatialFontScale.toFixed(2)))) : 1.0,
      nodeModelsScale: payload.visuals.nodeModelsScale ? Math.max(0.4, Math.min(3.0, Number(payload.visuals.nodeModelsScale.toFixed(2)))) : 1.0,
      insideObjectsScale: payload.visuals.insideObjectsScale ? Math.max(0.4, Math.min(3.0, Number(payload.visuals.insideObjectsScale.toFixed(2)))) : 1.0,
      detailCardScale: payload.visuals.detailCardScale ? Math.max(0.4, Math.min(3.0, Number(payload.visuals.detailCardScale.toFixed(2)))) : 1.0,
      theme: payload.visuals.theme,
      customNodeModels: payload.visuals.customNodeModels || {}
    }
  };

  return { valid: true, errors: [], sanitizedData };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    validateBoxemConfig,
    sanitizeString,
    isSafeAssetUrl,
    ALLOWED_ASSET_DOMAINS
  };
}
