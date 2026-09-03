/**
 * Blackboxes Box'em - Custom GLTF Asset Loader & Fallback Manager (Task T2.1)
 * Loads custom .glb node crystals with allowlist domain security checks and procedural octahedron fallback.
 */

const { isSafeAssetUrl } = require('../middleware/schemaValidator');

class BoxemModelLoader {
  constructor(threeInstance, gltfLoaderInstance) {
    this.THREE = threeInstance || (typeof window !== 'undefined' ? window.THREE : null);
    this.loader = gltfLoaderInstance || (this.THREE && this.THREE.GLTFLoader ? new this.THREE.GLTFLoader() : null);
    this.cache = new Map();
  }

  /**
   * Create standard procedural fallback octahedron mesh.
   */
  createFallbackGeometry(radius = 0.32, colorHex = 0x0284c7) {
    if (!this.THREE) return null;
    const geo = new this.THREE.OctahedronGeometry(radius, 0);
    const mat = new this.THREE.MeshPhysicalMaterial({
      color: colorHex,
      roughness: 0.22,
      metalness: 0.15,
      transmission: 0.35,
      ior: 1.52,
      emissive: colorHex,
      emissiveIntensity: 0.45,
      clearcoat: 0.6,
      clearcoatRoughness: 0.1,
      flatShading: true
    });
    return new this.THREE.Mesh(geo, mat);
  }

  /**
   * Load custom 3D model with security validation and fallback.
   * @param {string} url - Asset URL
   * @param {number} fallbackColor - Hex color for fallback mesh
   * @returns {Promise<THREE.Object3D>}
   */
  async loadNodeModel(url, fallbackColor = 0x0284c7) {
    // 1. Verify URL against domain security allowlist
    if (!url || !isSafeAssetUrl(url)) {
      console.warn(`[Box'em Security] Asset URL rejected or omitted ("${url}"). Using procedural fallback.`);
      return this.createFallbackGeometry(0.32, fallbackColor);
    }

    // 2. Check cache
    if (this.cache.has(url)) {
      return this.cache.get(url).clone();
    }

    // 3. Attempt async GLTF load
    if (!this.loader) {
      console.warn(`[Box'em ModelLoader] GLTFLoader unavailable. Using procedural fallback.`);
      return this.createFallbackGeometry(0.32, fallbackColor);
    }

    return new Promise((resolve) => {
      this.loader.load(
        url,
        (gltf) => {
          const model = gltf.scene || gltf.scenes[0];
          model.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          this.cache.set(url, model);
          resolve(model.clone());
        },
        undefined,
        (err) => {
          console.warn(`[Box'em ModelLoader] Failed to load "${url}": ${err.message}. Using procedural fallback.`);
          resolve(this.createFallbackGeometry(0.32, fallbackColor));
        }
      );
    });
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BoxemModelLoader };
}
