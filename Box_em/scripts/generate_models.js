/**
 * Blackboxes Box'em - 3D Node Crystal Asset Generator
 * Bakes custom stylized .glb 3D models for Time, Cost, Quality, and Scope pillars.
 */

const fs = require('fs');
const path = require('path');

// Polyfill FileReader and Blob for Node.js environment
if (typeof global.FileReader === 'undefined') {
  global.FileReader = class FileReader {
    constructor() {
      this.result = null;
      this.onloadend = null;
      this.onerror = null;
    }
    async readAsArrayBuffer(blob) {
      try {
        if (blob.arrayBuffer) {
          this.result = await blob.arrayBuffer();
        } else if (Buffer.isBuffer(blob)) {
          this.result = blob.buffer.slice(blob.byteOffset, blob.byteOffset + blob.byteLength);
        } else {
          this.result = new ArrayBuffer(0);
        }
        if (this.onloadend) this.onloadend();
      } catch (err) {
        if (this.onerror) this.onerror(err);
      }
    }
  };
}

const THREE = require('three');
const { GLTFExporter } = require('three/examples/jsm/exporters/GLTFExporter.js');

const modelsDir = path.join(__dirname, '../models');
if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir, { recursive: true });
}

function exportMeshToGlb(meshGroup, filename) {
  return new Promise((resolve, reject) => {
    const exporter = new GLTFExporter();
    exporter.parse(
      meshGroup,
      (gltf) => {
        const filePath = path.join(modelsDir, filename);
        fs.writeFileSync(filePath, Buffer.from(gltf));
        console.log(`✔ Generated 3D Asset: ${filename} (${(fs.statSync(filePath).size / 1024).toFixed(1)} KB)`);
        resolve(filePath);
      },
      (err) => {
        console.error(`Failed to export ${filename}:`, err);
        reject(err);
      },
      { binary: true }
    );
  });
}

// 1. TIME: Chrono-Torus & Hourglass Gyro Crystal
function createTimeModel() {
  const group = new THREE.Group();
  group.name = "ClockCrystal";

  // Core Diamond
  const coreGeo = new THREE.OctahedronGeometry(0.28, 0);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.15,
    metalness: 0.8,
    emissive: 0x0369a1,
    emissiveIntensity: 0.6
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  group.add(core);

  // Outer Chrono Rings
  const ringGeo1 = new THREE.TorusGeometry(0.38, 0.02, 16, 32);
  const ringMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2, metalness: 0.9 });
  const ring1 = new THREE.Mesh(ringGeo1, ringMat);
  ring1.rotation.x = Math.PI / 4;
  group.add(ring1);

  const ringGeo2 = new THREE.TorusGeometry(0.44, 0.015, 16, 32);
  const ring2 = new THREE.Mesh(ringGeo2, ringMat);
  ring2.rotation.y = Math.PI / 3;
  group.add(ring2);

  return group;
}

// 2. COST: Coin Gem & Multi-tiered Currency Prism
function createCostModel() {
  const group = new THREE.Group();
  group.name = "CoinGem";

  // Hexagonal Coin Core
  const coinGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.14, 6);
  const coinMat = new THREE.MeshStandardMaterial({
    color: 0x059669,
    roughness: 0.2,
    metalness: 0.85,
    emissive: 0x047857,
    emissiveIntensity: 0.5
  });
  const coin = new THREE.Mesh(coinGeo, coinMat);
  coin.rotation.x = Math.PI / 6;
  group.add(coin);

  // Inset Emerald Core
  const gemGeo = new THREE.OctahedronGeometry(0.22, 0);
  const gemMat = new THREE.MeshStandardMaterial({
    color: 0x34d399,
    roughness: 0.1,
    metalness: 0.3,
    emissive: 0x10b981,
    emissiveIntensity: 0.8
  });
  const gem = new THREE.Mesh(gemGeo, gemMat);
  gem.position.y = 0.12;
  group.add(gem);

  return group;
}

// 3. QUALITY: Multi-Faceted Brilliant Diamond Core
function createQualityModel() {
  const group = new THREE.Group();
  group.name = "DiamondCore";

  // Icosahedron Diamond
  const diamondGeo = new THREE.IcosahedronGeometry(0.32, 0);
  const diamondMat = new THREE.MeshStandardMaterial({
    color: 0x7c3aed,
    roughness: 0.1,
    metalness: 0.7,
    emissive: 0x6d28d9,
    emissiveIntensity: 0.7
  });
  const diamond = new THREE.Mesh(diamondGeo, diamondMat);
  group.add(diamond);

  // Crown Ring
  const crownGeo = new THREE.TorusGeometry(0.40, 0.015, 12, 24);
  const crownMat = new THREE.MeshStandardMaterial({ color: 0xc084fc, roughness: 0.2, metalness: 0.9 });
  const crown = new THREE.Mesh(crownGeo, crownMat);
  crown.rotation.x = Math.PI / 2;
  group.add(crown);

  return group;
}

// 4. SCOPE: Isometric Wire-Matrix Lattice
function createScopeModel() {
  const group = new THREE.Group();
  group.name = "CubeMatrix";

  // Central Core Cube
  const cubeGeo = new THREE.BoxGeometry(0.32, 0.32, 0.32);
  const cubeMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.25,
    metalness: 0.75,
    emissive: 0xb45309,
    emissiveIntensity: 0.5
  });
  const cube = new THREE.Mesh(cubeGeo, cubeMat);
  group.add(cube);

  // Outer Nested Wireframe Box
  const wireGeo = new THREE.BoxGeometry(0.46, 0.46, 0.46);
  const wireMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    roughness: 0.3,
    metalness: 0.9,
    wireframe: true
  });
  const wire = new THREE.Mesh(wireGeo, wireMat);
  group.add(wire);

  return group;
}

/* =========================================================================
 * 5 DISTINCT INDUSTRY-AWARE 3D CONSTRAINT SHOWCASE PIECES (Complete Models)
 * ========================================================================= */

// Industry 1: High-Fidelity Software Architecture Core (SaaS & Cloud API Platform)
function createSoftwareArchitectureModel() {
  const group = new THREE.Group();
  group.name = "SoftwareArchitectureCore";

  // Central Logic Core
  const coreGeo = new THREE.OctahedronGeometry(0.85, 0);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.15,
    metalness: 0.85,
    emissive: 0x0369a1,
    emissiveIntensity: 0.7
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  group.add(core);

  // Concentric High-Speed Bus Rings
  const busGeo1 = new THREE.TorusGeometry(1.2, 0.03, 16, 64);
  const busMat1 = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2, metalness: 0.9 });
  const bus1 = new THREE.Mesh(busGeo1, busMat1);
  bus1.rotation.x = Math.PI / 3;
  group.add(bus1);

  const busGeo2 = new THREE.TorusGeometry(1.4, 0.02, 16, 64);
  const busMat2 = new THREE.MeshStandardMaterial({ color: 0x818cf8, roughness: 0.2, metalness: 0.9 });
  const bus2 = new THREE.Mesh(busGeo2, busMat2);
  bus2.rotation.y = Math.PI / 4;
  group.add(bus2);

  // 4 Microservice Node Crystals
  const nodePositions = [
    [1.5, 0.5, 0], [-1.5, -0.5, 0], [0, 1.4, 0.8], [0, -1.4, -0.8]
  ];
  nodePositions.forEach((pos, i) => {
    const nodeGeo = new THREE.IcosahedronGeometry(0.22, 0);
    const nodeMat = new THREE.MeshStandardMaterial({ color: i % 2 === 0 ? 0x38bdf8 : 0xa855f7, metalness: 0.8, roughness: 0.2 });
    const node = new THREE.Mesh(nodeGeo, nodeMat);
    node.position.set(...pos);
    group.add(node);
  });

  return group;
}

// Industry 2: Commercial Architectural BIM Structural Matrix (BIM & Civil Construction)
function createArchitecturalBIMModel() {
  const group = new THREE.Group();
  group.name = "ArchitecturalBIMMatrix";

  // Structural Lattice Framework
  const frameGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.4, metalness: 0.8, wireframe: true });
  const frame = new THREE.Mesh(frameGeo, frameMat);
  group.add(frame);

  // Cantilever Foundation Core
  const coreGeo = new THREE.CylinderGeometry(0.5, 0.7, 1.2, 8);
  const coreMat = new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.25, metalness: 0.75, emissive: 0x047857, emissiveIntensity: 0.5 });
  const core = new THREE.Mesh(coreGeo, coreMat);
  group.add(core);

  // Load-Bearing Struts
  const strutGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.0, 12);
  const strutMat = new THREE.MeshStandardMaterial({ color: 0x34d399, roughness: 0.3, metalness: 0.9 });
  const strut1 = new THREE.Mesh(strutGeo, strutMat);
  strut1.rotation.z = Math.PI / 4;
  group.add(strut1);

  const strut2 = new THREE.Mesh(strutGeo, strutMat);
  strut2.rotation.z = -Math.PI / 4;
  group.add(strut2);

  return group;
}

// Industry 3: Hollywood 4K Cinematic VFX Pipeline (CGI, Color Grade & Render Farm)
function createCinematicVFXModel() {
  const group = new THREE.Group();
  group.name = "CinematicVFXPipeline";

  // Optical Aperture Prism
  const prismGeo = new THREE.IcosahedronGeometry(0.9, 1);
  const prismMat = new THREE.MeshStandardMaterial({ color: 0x9333ea, roughness: 0.1, metalness: 0.85, emissive: 0x7e22ce, emissiveIntensity: 0.65 });
  const prism = new THREE.Mesh(prismGeo, prismMat);
  group.add(prism);

  // Golden Cinema Lens Gyro Rings
  const ringGeo1 = new THREE.TorusGeometry(1.3, 0.035, 16, 48);
  const ringMat1 = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.15, metalness: 0.95 });
  const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
  ring1.rotation.x = Math.PI / 2.5;
  group.add(ring1);

  const ringGeo2 = new THREE.TorusGeometry(1.5, 0.025, 16, 48);
  const ringMat2 = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.2, metalness: 0.9 });
  const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
  ring2.rotation.y = Math.PI / 3;
  group.add(ring2);

  return group;
}

// Industry 4: Quantum AI & Autonomous Robotics Synthesis (Neural Tensor & Autonomous Agents)
function createQuantumAIRoboticsModel() {
  const group = new THREE.Group();
  group.name = "QuantumAIRobotics";

  // Quantum Tensor Core (Dodecahedron)
  const tensorGeo = new THREE.DodecahedronGeometry(0.85, 0);
  const tensorMat = new THREE.MeshStandardMaterial({ color: 0x4f46e5, roughness: 0.12, metalness: 0.9, emissive: 0x4338ca, emissiveIntensity: 0.75 });
  const tensor = new THREE.Mesh(tensorGeo, tensorMat);
  group.add(tensor);

  // Synaptic Orbit Halos
  const synGeo = new THREE.TorusGeometry(1.35, 0.02, 16, 64);
  const synMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.1, metalness: 0.95 });
  const syn1 = new THREE.Mesh(synGeo, synMat);
  syn1.rotation.x = Math.PI / 4;
  syn1.rotation.y = Math.PI / 6;
  group.add(syn1);

  const syn2 = new THREE.Mesh(synGeo, synMat);
  syn2.rotation.x = -Math.PI / 4;
  syn2.rotation.y = -Math.PI / 6;
  group.add(syn2);

  // 6 Quantum Superposition Vertices
  const vertices = [
    [1.2, 0, 0], [-1.2, 0, 0], [0, 1.2, 0], [0, -1.2, 0], [0, 0, 1.2], [0, 0, -1.2]
  ];
  vertices.forEach(v => {
    const qGeo = new THREE.OctahedronGeometry(0.18, 0);
    const qMat = new THREE.MeshStandardMaterial({ color: 0x22d3ee, metalness: 0.85, roughness: 0.15 });
    const qMesh = new THREE.Mesh(qGeo, qMat);
    qMesh.position.set(...v);
    group.add(qMesh);
  });

  return group;
}

// Industry 5: Biomedical & MedTech Clinical Constraint Matrix (FDA Biosensors & MedTech Hardware)
function createBiomedicalDeviceModel() {
  const group = new THREE.Group();
  group.name = "BiomedicalDeviceMatrix";

  // Bio-Molecular Capsule Core
  const capGeo = new THREE.CylinderGeometry(0.45, 0.45, 1.4, 16);
  const capMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.15, metalness: 0.75, emissive: 0x059669, emissiveIntensity: 0.6 });
  const cap = new THREE.Mesh(capGeo, capMat);
  group.add(cap);

  // Sterile Titanium Enclosure Spheres
  const sphGeo1 = new THREE.SphereGeometry(0.45, 16, 16);
  const sphMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.2, metalness: 0.95 });
  const sph1 = new THREE.Mesh(sphGeo1, sphMat);
  sph1.position.y = 0.7;
  group.add(sph1);

  const sph2 = new THREE.Mesh(sphGeo1, sphMat);
  sph2.position.y = -0.7;
  group.add(sph2);

  // Double-Helical Biosensor Ribbons
  const ribbonGeo = new THREE.TorusGeometry(1.1, 0.025, 16, 48);
  const ribbonMat = new THREE.MeshStandardMaterial({ color: 0x34d399, roughness: 0.25, metalness: 0.85 });
  const rib1 = new THREE.Mesh(ribbonGeo, ribbonMat);
  rib1.rotation.x = Math.PI / 3;
  group.add(rib1);

  const rib2 = new THREE.Mesh(ribbonGeo, ribbonMat);
  rib2.rotation.x = -Math.PI / 3;
  group.add(rib2);

  return group;
}

async function generateAllModels() {
  console.log('=== Generating Custom Box\'em 3D GLTF (.glb) Assets ===\n');
  
  // 4 Pillar Node Models
  await exportMeshToGlb(createTimeModel(), 'clock_crystal.glb');
  await exportMeshToGlb(createCostModel(), 'coin_gem.glb');
  await exportMeshToGlb(createQualityModel(), 'diamond_core.glb');
  await exportMeshToGlb(createScopeModel(), 'cube_matrix.glb');

  // 5 Complete Industry-Specific Showcase Models
  await exportMeshToGlb(createSoftwareArchitectureModel(), 'software_architecture_core.glb');
  await exportMeshToGlb(createArchitecturalBIMModel(), 'architectural_bim_matrix.glb');
  await exportMeshToGlb(createCinematicVFXModel(), 'cinematic_vfx_pipeline.glb');
  await exportMeshToGlb(createQuantumAIRoboticsModel(), 'quantum_ai_robotics.glb');
  await exportMeshToGlb(createBiomedicalDeviceModel(), 'biomedical_device_matrix.glb');

  console.log('\n✔ All 4 node models + 5 complete industry showcase 3D pieces generated successfully in models/');
}

generateAllModels().catch(err => {
  console.error('Error generating models:', err);
  process.exit(1);
});

