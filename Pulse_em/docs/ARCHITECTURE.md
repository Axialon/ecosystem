# Pulse'em System Architecture & Biometric Pipeline

## Mathematical Solver: Biological Age Deceleration
$$\Delta\text{BioAge} = \left(\frac{\text{HRV}}{75.0}\right) \cdot \left(\frac{\text{Longevity}}{100.0}\right) \cdot 4.0 - \left(\frac{\text{Strain}}{600.0}\right) \cdot 2.0$$

## 3D WebGL Pipeline
- **Cellular Core**: `IcosahedronGeometry(1.25, 1)` with `MeshPhysicalMaterial` (`transmission: 0.65`, `side: THREE.DoubleSide`).
- **DNA Double Helix**: Twin parametric helical paths revolving around the cellular core.
- **Biomarker Organelles**: Raycasted interactive micro-gems with expanded hitboxes.
- **Audio Synthesizer**: Web Audio API sine oscillator heart sound simulator.
