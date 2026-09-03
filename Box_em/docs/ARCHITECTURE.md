# Blackboxes • Box'em System Architecture

## 1. System Overview

**Blackboxes • Box'em** is a zero-latency, 3D reciprocal constraint solver and spatial visualizer. It provides interactive mathematical equilibrium modeling across four core project pillars:
* **Timeline ($N_T$)**: Delivery schedule in weeks.
* **Investment ($N_C$)**: Project budget in USD.
* **Craft Quality ($N_Q$)**: Craft polish and fidelity percentage.
* **Scope Volume ($N_S$)**: Deliverable completeness and feature tiers.

```
       [TIME (NT)] <------------------> [COST (NC)]
            \                                /
             \                              /
              \     [3D REACTOR CORE]      /
               \                          /
                v                        v
          [QUALITY (NQ)] <------------> [SCOPE (NS)]
```

---

## 2. Mathematical Equilibrium Formulation

All trade-offs obey the reciprocal equilibrium equation:

$$N_S \cdot N_Q = K \cdot N_T \cdot N_C$$

Where:
* $N_T = \max\left(\epsilon, \frac{\text{Time in Weeks}}{10.0}\right)$
* $N_C = \max\left(\epsilon, \frac{\text{Cost in USD}}{25000.0}\right)$
* $N_Q = \max\left(\epsilon, \frac{\text{Quality Percent}}{100.0}\right)$
* $N_S = \max\left(\epsilon, \frac{\text{Scope Percent}}{100.0}\right)$
* Equilibrium Constant: $K = \frac{1.0 \times 0.85}{(3.0 / 10.0) \times (5500 / 25000)} \approx 12.8788$
* Singularity Guard: $\epsilon = 0.001$

When any single pillar is adjusted by the user or an external AI Agent, the engine resolves the chosen **Target Pillar** to restore equilibrium.

---

## 3. Spatial 3D WebGL Rendering Pipeline

### Geometry Construction
1. **Central Crystalline Reactor**: Dynamic `THREE.BufferGeometry` triangle strip linking the 4 normalized pillar vectors:
   * Triangle 1: $(V_T, V_C, V_Q)$
   * Triangle 2: $(V_T, V_C, V_S)$
   * Triangle 3: $(V_T, V_Q, V_S)$
   * Triangle 4: $(V_C, V_Q, V_S)$
   Normal vectors are recalculated on every animation tick (`computeVertexNormals()`).

2. **3D Billboard Spatial Tags**:
   * Dynamic 2D canvas textures generated with pixel-perfect mathematical centering of status bullet and typography.
   * `sprite.renderOrder = 9999` with `depthTest: false` and `depthWrite: false` ensures tags are always visible on top without mesh occlusion.

3. **Submodule Milestone Matrix**:
   * Orbiting 3D octahedron nodes representing individual domain deliverables.
   * Modulate color and emissive radiance dynamically based on whether active quality and scope thresholds meet requirement criteria.

---

## 4. State Synchronization & Deep Linking

The application maintains a centralized reactive state model:
* **URL Param Serialization**: State is synchronized directly to browser URL search parameters (`?time=4.0&cost=8500&qual=88&scope=100&occ=fullstack_web`).
* **Local Storage Library**: Saves customized model configurations persistently under `localStorage['boxem_saved_models']`.
* **Export Bundling**: Bakes complete `.boxem.json` configurations into binary WebXR `.glb` files under `scenes[0].extras.boxemConfig`.

---

## 5. 225+ Researched Profession Matrix & Presets Library

Box'em embeds 225 researched industry professions across 15 sectors (Software, Architecture, VFX, AI/Robotics, Biotech, Skilled Trades, Marketing, Creative Arts, etc.) with 900 curated scope deliverables and 7 official production presets:
* `software_agency_craft.boxem.json` (Cloud & SaaS Architecture)
* `enterprise_architecture.boxem.json` (Commercial Architectural BIM)
* `film_vfx_masterpiece.boxem.json` (Hollywood 4K VFX Pipeline)
* `quantum_ai_robotics.boxem.json` (Quantum AI & Autonomous Robotics)
* `biomedical_device_matrix.boxem.json` (Biomedical & FDA Biosensors)
* `trade_construction_craft.boxem.json` (Skilled Trades & Physical Construction)
* `barebones_mvp_prototype.boxem.json` (Rapid MVP Prototype)

---

## 6. Security & Isolation

* **Strict Input Sanitization**: Defangs script injections and validates boundary numbers before updating state.
* **Procedural Fallback**: Automatically falls back to glowing procedural octahedron shards if custom binary `.glb` models fail to load or are blocked by CORS.
