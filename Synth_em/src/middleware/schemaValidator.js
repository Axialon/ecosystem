/**
 * Blackboxes Synth'em - JSON Schema & Import Guard Middleware
 */

const VALID_LOCK_MODES = ['harmonics', 'dynamics', 'pitch', 'reverb'];
const VALID_SHADERS = [
  'neonvapor', 'nebula', 'abyssal', 'voidsingularity', 'classic', 'polar', 'magma', 'emerald', 'kintsugi', 'damascus'
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

function validateSynthConfig(payload) {
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
    if (payload.meta.app !== "Synth'em") errors.push('meta.app must be "Synth\'em"');
    if (!payload.meta.title) errors.push('meta.title is required');
  }

  if (!payload.constraints || typeof payload.constraints !== 'object') {
    errors.push('Missing "constraints" section');
  } else {
    const c = payload.constraints;
    if (typeof c.harmonicDrivePercent !== 'number' || c.harmonicDrivePercent < 0 || c.harmonicDrivePercent > 100) {
      errors.push('constraints.harmonicDrivePercent must be between 0 and 100');
    }
    if (typeof c.dynamicCrestDb !== 'number' || c.dynamicCrestDb < 1 || c.dynamicCrestDb > 30) {
      errors.push('constraints.dynamicCrestDb must be between 1 and 30');
    }
    if (typeof c.pitchRatio !== 'number' || c.pitchRatio < 0.5 || c.pitchRatio > 2.0) {
      errors.push('constraints.pitchRatio must be between 0.5 and 2.0');
    }
    if (typeof c.reverbDecaySec !== 'number' || c.reverbDecaySec < 0.1 || c.reverbDecaySec > 12.0) {
      errors.push('constraints.reverbDecaySec must be between 0.1 and 12.0');
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
      $schema: "https://blackboxes.engine/schema/synthem/v1.json",
      version: payload.version,
      meta: {
        brand: "Blackboxes",
        app: "Synth'em",
        title: sanitizeString(payload.meta.title, 100),
        genre: sanitizeString(payload.meta.genre, 60),
        author: sanitizeString(payload.meta.author || "Anonymous Producer", 60)
      },
      constraints: {
        harmonicDrivePercent: Math.max(0, Math.min(100, Math.round(payload.constraints.harmonicDrivePercent))),
        dynamicCrestDb: Math.max(1, Math.min(30, Math.round(payload.constraints.dynamicCrestDb))),
        pitchRatio: Math.max(0.5, Math.min(2.0, Number(payload.constraints.pitchRatio.toFixed(2)))),
        reverbDecaySec: Math.max(0.1, Math.min(12.0, Number(payload.constraints.reverbDecaySec.toFixed(1)))),
        lockMode: payload.constraints.lockMode
      },
      submodules: payload.submodules.map((m, idx) => ({
        id: m.id || `mod_${idx + 1}`,
        name: sanitizeString(m.name, 80),
        dspParam: sanitizeString(m.dspParam || "DSP Node", 40),
        mixLevel: Math.max(0, Math.min(100, Math.round(m.mixLevel || 50)))
      })),
      visuals: {
        shaderPreset: VALID_SHADERS.includes(payload.visuals?.shaderPreset) ? payload.visuals.shaderPreset : 'neonvapor',
        theme: VALID_THEMES.includes(payload.visuals?.theme) ? payload.visuals.theme : 'dark'
      }
    }
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { validateSynthConfig, sanitizeString };
}
