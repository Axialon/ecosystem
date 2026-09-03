/**
 * Blackboxes Box'em - Spatial 3D Typography & Billboard Labels (Task T1.2)
 * Creates and updates native 3D SDF / Billboard text tags in WebGL/WebXR coordinate space.
 */

class SpatialLabelManager {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.labels = new Map();
    this.use3DNative = true;
  }

  /**
   * Create or update a spatial 3D text billboard attached to a parent 3D object.
   * @param {string} id - Unique identifier (e.g., 'time', 'cost', 'quality', 'scope')
   * @param {THREE.Object3D} parentNode - The 3D crystal group anchor
   * @param {string} text - Display text string
   * @param {number|string} color - Hex color or hex string
   * @param {Object} options - Typography and styling options
   */
  createOrUpdate3DLabel(id, parentNode, text, color, options = {}) {
    let entry = this.labels.get(id);

    if (!entry) {
      const group = new THREE.Group();
      group.name = `spatial-label-${id}`;

      // Canvas sprite billboard for guaranteed cross-platform & WebXR zero-dependency rendering
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');

      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;

      const spriteMat = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: false,
        depthWrite: false
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(1.4, 0.35, 1.0);
      sprite.position.set(0, 0.45, 0);

      group.add(sprite);
      parentNode.add(group);

      entry = { group, sprite, canvas, ctx, texture, text: '', color };
      this.labels.set(id, entry);
    }

    if (entry.text !== text || entry.color !== color) {
      entry.text = text;
      entry.color = color;
      this._renderCanvasBadge(entry.canvas, entry.ctx, text, color, options);
      entry.texture.needsUpdate = true;
    }

    return entry;
  }

  /**
   * Internal render of high-DPI text badge onto canvas texture
   */
  _renderCanvasBadge(canvas, ctx, text, colorHex, options) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const pad = 8;
    const w = canvas.width - pad * 2;
    const h = canvas.height - pad * 2;
    const r = 24;

    // Draw rounded badge background
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    ctx.strokeStyle = typeof colorHex === 'number' ? `#${colorHex.toString(16).padStart(6, '0')}` : colorHex;
    ctx.lineWidth = 6;

    ctx.beginPath();
    ctx.moveTo(pad + r, pad);
    ctx.lineTo(pad + w - r, pad);
    ctx.quadraticCurveTo(pad + w, pad, pad + w, pad + r);
    ctx.lineTo(pad + w, pad + h - r);
    ctx.quadraticCurveTo(pad + w, pad + h, pad + w - r, pad + h);
    ctx.lineTo(pad + r, pad + h);
    ctx.quadraticCurveTo(pad, pad + h, pad, pad + h - r);
    ctx.lineTo(pad, pad + r);
    ctx.quadraticCurveTo(pad, pad, pad + r, pad);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw Indicator Dot
    ctx.fillStyle = ctx.strokeStyle;
    ctx.beginPath();
    ctx.arc(pad + 36, canvas.height / 2, 14, 0, Math.PI * 2);
    ctx.fill();

    // Draw Text with clean vector styling
    ctx.font = 'bold 36px "Google Sans Code", monospace, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, pad + 64, canvas.height / 2);
    ctx.restore();
  }

  /**
   * Update billboard orientation every animation frame
   */
  update() {
    // Sprites automatically billboard in Three.js WebGL & WebXR
  }

  /**
   * Dispose all textures and materials
   */
  dispose() {
    this.labels.forEach(entry => {
      if (entry.texture) entry.texture.dispose();
      if (entry.sprite && entry.sprite.material) entry.sprite.material.dispose();
      if (entry.group && entry.group.parent) entry.group.parent.remove(entry.group);
    });
    this.labels.clear();
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SpatialLabelManager };
}
