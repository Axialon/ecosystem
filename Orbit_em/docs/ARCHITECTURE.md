# Orbit'em System Architecture & WebGL Pipeline

## 1. High-Level Architecture Overview

Orbit'em is structured into 3 self-contained layers:

1. **Mathematical Constraint Solver (`solveConstraints()`)**:
   - Calculates cloud equilibrium scores using reciprocal elasticity equations:
   $$\text{Equilibrium} = \frac{-\log_{10}(1 - \frac{\text{SLA}}{100}) \cdot (\frac{100}{\text{Latency}}) \cdot (\frac{\text{Security}}{100})}{(\frac{\text{Budget}}{5000}) \cdot (\frac{\text{Complexity}}{50}) \cdot (\frac{\text{Compute}}{100})}$$
   - Performs defensive clamping on inputs to eliminate division by zero or NaN drift.

2. **3D WebGL Rendering Pipeline (Three.js r128)**:
   - **Central Crystalline Reactor**: Translucent `OctahedronGeometry` with physical glass transmission (`transmission: 0.65`, `ior: 1.7`, `side: THREE.DoubleSide`) and sharp wireframe edges.
   - **3D Canvas Text Billboards**: High-resolution procedural 2D canvas text sprites billboarded in 3D world space with `renderOrder: 9999` and `depthTest: false`.
   - **Submodule Raycasting**: Interactive 3D microservice gems with invisible expanded hit spheres (`SphereGeometry(0.35)`).

3. **Export & Interoperability Layer**:
   - Binary WebXR / glTF 2.0 (`.glb`) generation with embedded metadata.
   - HashiCorp Terraform (`.tf`) infrastructure-as-code blueprints.
   - Schema-validated `.orbit.json` export.
