/**
 * Blackboxes Pulse'em - JSON Schema & Import Guard Middleware
 */

const VALID_LOCK_MODES = ['strain', 'recovery', 'fuel', 'longevity'];
const VALID_SHADERS = [
  'abyssal', 'solar', 'opaline', 'voidsingularity', 'classic', 'polar', 'magma', 'emerald', 'kintsugi', 'damascus'
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

function validatePulseConfig(payload) {
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
    if (payload.meta.app !== "Pulse'em") errors.push('meta.app must be "Pulse\'em"');
    if (!payload.meta.title) errors.push('meta.title is required');
  }

  if (!payload.constraints || typeof payload.constraints !== 'object') {
    errors.push('Missing "constraints" section');
  } else {
    const c = payload.constraints;
    if (typeof c.trainingStrainTrimp !== 'number' || c.trainingStrainTrimp < 50 || c.trainingStrainTrimp > 1500) {
      errors.push('constraints.trainingStrainTrimp must be between 50 and 1500');
    }
    if (typeof c.autonomicRecoveryHrv !== 'number' || c.autonomicRecoveryHrv < 10 || c.autonomicRecoveryHrv > 200) {
      errors.push('constraints.autonomicRecoveryHrv must be between 10 and 200');
    }
    if (typeof c.metabolicFuelingPercent !== 'number' || c.metabolicFuelingPercent < 20 || c.metabolicFuelingPercent > 200) {
      errors.push('constraints.metabolicFuelingPercent must be between 20 and 200');
    }
    if (typeof c.longevityScore !== 'number' || c.longevityScore < 10 || c.longevityScore > 150) {
      errors.push('constraints.longevityScore must be between 10 and 150');
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
      $schema: "https://blackboxes.engine/schema/pulseem/v1.json",
      version: payload.version,
      meta: {
        brand: "Blackboxes",
        app: "Pulse'em",
        title: sanitizeString(payload.meta.title, 100),
        protocol: sanitizeString(payload.meta.protocol, 60),
        author: sanitizeString(payload.meta.author || "Anonymous Athlete", 60)
      },
      constraints: {
        trainingStrainTrimp: Math.max(50, Math.min(1500, Math.round(payload.constraints.trainingStrainTrimp))),
        autonomicRecoveryHrv: Math.max(10, Math.min(200, Math.round(payload.constraints.autonomicRecoveryHrv))),
        metabolicFuelingPercent: Math.max(20, Math.min(200, Math.round(payload.constraints.metabolicFuelingPercent))),
        longevityScore: Math.max(10, Math.min(150, Math.round(payload.constraints.longevityScore))),
        lockMode: payload.constraints.lockMode
      },
      submodules: payload.submodules.map((m, idx) => ({
        id: m.id || `mod_${idx + 1}`,
        name: sanitizeString(m.name, 80),
        impact: sanitizeString(m.impact || "Physiological", 40),
        target: sanitizeString(m.target || "Daily", 40)
      })),
      visuals: {
        shaderPreset: VALID_SHADERS.includes(payload.visuals?.shaderPreset) ? payload.visuals.shaderPreset : 'abyssal',
        theme: VALID_THEMES.includes(payload.visuals?.theme) ? payload.visuals.theme : 'dark'
      }
    }
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { validatePulseConfig, sanitizeString };
}
