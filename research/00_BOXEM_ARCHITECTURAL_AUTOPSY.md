# Blackboxes Box'em: Architectural Autopsy & Capability Inventory

## 1. Executive Summary & Philosophy

**Blackboxes Box'em** is an offline-first, zero-build 3D spatial constraint engine and multi-variable trade-off accelerator. It reimagines project scoping, financial forecasting, and craft fidelity as an interactive 3D tetrahedral vector lattice rendered in real time with WebGL and WebXR.

Instead of treating multi-dimensional trade-offs as abstract, disconnected spreadsheet rows, Box'em binds four fundamental project pillars into a physically coherent geometric lattice governed by a reciprocal equilibrium law:

$$\text{Scope Volume } (N_S) \cdot \text{Craft Quality } (N_Q) = K \cdot \text{Timeline } (N_T) \cdot \text{Investment } (N_C)$$

```
                           [ TIME (NT) ]
                                 ▲
                                / \
                               /   \
                              /     \
                             /   K   \
                            /         \
       [ QUALITY (NQ) ] ◄──┼───────────┼──► [ COST (NC) ]
                            \         /
                             \       /
                              \     /
                               \   /
                                 ▼
                          [ SCOPE (NS) ]
```

---

## 2. Core Subsystems & Technical Mechanics

### 2.1 The Reciprocal Equilibrium Mathematical Engine

All parameter trade-offs in Box'em adhere to strict normalized vector calculations with continuous equilibrium maintenance:

- **Timeline Vector ($N_T$):** $N_T = \max\left(0.001, \frac{\text{Time in Weeks}}{10.0}\right)$
- **Investment Vector ($N_C$):** $N_C = \max\left(0.001, \frac{\text{Cost in USD}}{25000.0}\right)$
- **Craft Fidelity Vector ($N_Q$):** $N_Q = \max\left(0.001, \frac{\text{Quality Percent}}{100.0}\right)$
- **Scope Volume Vector ($N_S$):** $N_S = \max\left(0.001, \frac{\text{Scope Percent}}{100.0}\right)$
- **Equilibrium Constant ($K$):** $K = \frac{1.0 \cdot 0.85}{(3.0 / 10.0) \cdot (5500.0 / 25000.0)} \approx 1.0303$

#### Mathematical Safeguards & Bounds Clamping
1. **$\epsilon$-Division Guards:** Every division operation applies $\epsilon = 0.001$ boundary floors to guarantee that $N_T, N_C, N_Q, N_S > 0$, eliminating division-by-zero exceptions, infinite matrices, and WebGL `NaN` coordinate freeze bugs.
2. **Dynamic Floor Guarantees:** A floor guarantee mechanism ensures baseline deliverable costs cannot be collapsed below realistic labor thresholds:
   $$\text{Calculated Floor} = \max\left(\text{Cost}_{\min}, \text{round}\left(\frac{\text{BaseBudget} \cdot 0.72}{250}\right) \cdot 250\right)$$
3. **Lock-Pillar Solvers:** When a user locks one pillar (e.g. fixed budget or hard deadline), adjusting any other pillar automatically redistributes energy and dynamically recalculates the remaining unlocked dimensions.

---

### 2.2 3D Spatial Reactor & WebGL / WebXR Scene Graph

The visual viewport is built on Three.js (r128) with high-efficiency direct scene graph manipulation:

```
[ Root Scene Graph ]
├── Lighting Rig
│   ├── Directional Key Light (0xffffff, pos: [5, 8, 5], intensity: 0.90)
│   ├── Directional Soft Fill (0x0ea5e9, pos: [-5, -3, -4], intensity: 0.45)
│   └── Directional Back Rim (0xa855f7, pos: [0, 4, -6], intensity: 0.60)
└── System Group
    ├── Dynamic Central Reactor Core (BufferGeometry with 36 Float32 positions)
    │   └── MeshPhysicalMaterial (transmission: 0.85, roughness: 0.18, IOR: 1.70, clearcoat: 1.0)
    ├── Sleek Strut Envelope (6x CylinderGeometry framing nodes, renderOrder: 1)
    ├── 4x Spatial Node Crystals (OctahedronBufferGeometry / GLTF meshes)
    │   ├── Time Node: Clock Crystal / Sky Blue (0x0284c7)
    │   ├── Cost Node: Coin Gem / Emerald (0x059669)
    │   ├── Quality Node: Diamond Core / Purple (0x7c3aed)
    │   └── Scope Node: Cube Matrix / Amber (0xd97706)
    ├── Floating Milestone Gems (Inside reactor volume, color-coded by milestone status)
    └── 4x Supersampled CanvasTexture 3D Billboard Sprites (1024x240 px, LinearFilter)
```

#### Key Visual Features:
- **MeshPhysicalMaterial Transmission & Refraction:** True optical glass look with dynamic `transmission`, `ior` (Index of Refraction = 1.70), and `clearcoat` specular coats.
- **Dynamic Mesh Vertex Deformation:** As constraints shift, the 36 vertex buffer positions of the central reactor core deform smoothly in 3D space, providing visceral intuitive feedback of scope expansion or budget strain.
- **Hover & Coordinate Anchoring:** Raycasting detects node and deliverable milestone hovering, displaying glassmorphic popover cards anchored to 2D screen projections of 3D vector coordinates.
- **Continuous Animated Favicon Runner:** An offscreen HTML5 Canvas continuously renders a 4.5-second rotating isometric wireframe loop converted to a base64 DataURL favicon, keeping the browser tab dynamically alive.

---

### 2.3 20 Crystalline Shader Matrix

The engine features 20 optical shader presets categorized into free tiers and voluntary backer tiers:

| Preset Name | Key Identifier | Core Color | Emissive Color | Transmission | Roughness | Tier |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Classic Sapphire** | `classic` | `#07111e` | `#0284c7` | 0.80 | 0.08 | Free (0) |
| **Smoked Quartz** | `quartz` | `#130a1e` | `#9333ea` | 0.78 | 0.10 | Free (0) |
| **Emerald Matrix** | `emerald` | `#03150f` | `#059669` | 0.75 | 0.08 | Free (0) |
| **Liquid Chrome** | `liquid` | `#051324` | `#06b6d4` | 0.88 | 0.06 | Free (0) |
| **Frosted Polar Ice** | `polar` | `#0f1e33` | `#38bdf8` | 0.82 | 0.12 | Free (0) |
| **Volcanic Magma** | `magma` | `#1c0707` | `#ef4444` | 0.70 | 0.14 | Free (0) |
| **Rose Quartz Gem** | `rose` | `#1e0b16` | `#ec4899` | 0.76 | 0.09 | Free (0) |
| **Celestial Nebula** | `nebula` | `#0d0924` | `#6366f1` | 0.80 | 0.11 | Free (0) |
| **Amber Citrine** | `citrine` | `#181005` | `#f59e0b` | 0.79 | 0.09 | Free (0) |
| **Aquamarine Tide** | `aquamarine` | `#041518` | `#06b6d4` | 0.85 | 0.07 | Free (0) |
| **Royal Amethyst** | `amethyst` | `#14081c` | `#a855f7` | 0.77 | 0.10 | Free (0) |
| **Titanium Slate** | `titanium` | `#0f172a` | `#94a3b8` | 0.65 | 0.16 | Free (0) |
| **Kintsugi Gold Fracture** | `kintsugi` | `#140d04` | `#d97706` | 0.72 | 0.10 | Backer Tier 1 ($5+) |
| **Abyssal Bioluminescent** | `abyssal` | `#021818` | `#14b8a6` | 0.84 | 0.08 | Backer Tier 1 ($5+) |
| **Supernova Solar Core** | `solar` | `#240c02` | `#f97316` | 0.78 | 0.09 | Backer Tier 1 ($5+) |
| **Opaline Holographic** | `opaline` | `#161324` | `#8b5cf6` | 0.86 | 0.07 | Backer Tier 2 ($25+) |
| **Damascus Steel Prism** | `damascus` | `#0f172a` | `#94a3b8` | 0.65 | 0.15 | Backer Tier 2 ($25+) |
| **Cyberpunk Neon Vapor** | `neonvapor` | `#1a0426` | `#f43f5e` | 0.82 | 0.08 | Backer Tier 2 ($25+) |
| **Stealth Carbon Matrix** | `carbon` | `#070a10` | `#475569` | 0.55 | 0.20 | Backer Tier 2 ($25+) |
| **Quantum Void Singularity** | `voidsingularity` | `#020206` | `#a855f7` | 0.90 | 0.05 | Backer Tier 2 ($25+) |

---

### 2.4 225+ Profession Matrix & Domain Milestone Library

Box'em includes a researched ontology of **225 professions across 15 industries** (`src/data/professions.json`):
- **Granular Deliverable Milestones:** Over 900 structured deliverables with individual quality gates ($reqQuality \in [0, 150\%]$).
- **Market Hourly Benchmark Curves:** Real-world verified hourly rates ranging from entry-level trades ($25/hr) to elite surgical, aerospace, and quantitative finance consultants ($1,500+/hr).
- **Dynamic Scope Tiering:** Grade F through Grade SS quality brackets; Tier 1 (MVP) through Tier 6 (Enterprise Matrix) scope volumes.

---

### 2.5 Multi-Format Portability & Export Pipeline

Box'em generates 5 distinct production-grade output formats directly on the client:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        BOX'EM EXPORT PIPELINE                          │
├──────────────────┬─────────────────────────────────────────────────────┤
│ Format           │ Description & Key Payload                           │
├──────────────────┼─────────────────────────────────────────────────────┤
│ .boxem.json      │ Schema-validated JSON configuration conforming to   │
│                  │ schemas/v1.schema.json. Pure state serialization.   │
├──────────────────┼─────────────────────────────────────────────────────┤
│ Standalone .glb  │ Binary GLTF 2.0 3D model with embedded mesh data    │
│                  │ and baked userData.boxemConfig metadata.            │
├──────────────────┼─────────────────────────────────────────────────────┤
│ Single-File HTML │ Fully self-contained, zero-dependency offline bundle│
│                  │ with embedded state and WebGL engine runner.        │
├──────────────────┼─────────────────────────────────────────────────────┤
│ Markdown Pitch   │ Client-facing proposal document detailing scope,    │
│                  │ deliverables, timeline, budget, and quality grades. │
├──────────────────┼─────────────────────────────────────────────────────┤
│ Responsive Embed │ 1-line sandboxed <iframe> snippet with URL params   │
│                  │ for Notion, Pitch, blogs, and portfolio embeds.     │
└──────────────────┴─────────────────────────────────────────────────────┘
```

---

### 2.6 Monetization Architecture: Voluntary Backer Engine

Box'em operates on a **zero-subscription, 100% free open-source model**:
1. **Voluntary Sponsorship Tiers:**
   - **Tier 1 Supporter ($5+)**: Unlocks 3 backer shaders (*Kintsugi, Abyssal, Solar*).
   - **Tier 2 Studio Backer ($25+)**: Unlocks all 8 backer shaders, custom 3D mesh slots, and studio branding watermarks.
2. **Cryptographic Verification & Storage:**
   - Client records a backer token in `localStorage` (`boxem_backer_status`).
   - Webhook processing via Cloudflare Workers (`workers/donationWebhook.js`) verifying `X-Hub-Signature-256` HMAC signatures from Open Collective / GitHub Sponsors / Stripe.
3. **Live 3D Ticker & Edge Ledger:**
   - Real-time backer transactions are written to Cloudflare D1 SQL relational database and broadcasted on an edge ticker widget.
4. **Interactive 3D Hologram Stage:**
   - The donation modal renders a dedicated interactive Three.js 3D crystal trophy that transforms dynamically in real time as the user drags donation amount sliders.

---

### 2.7 Adjacent Technologies in Workspace (`scattered_files`)

The repository also contains design blueprints from Project "Black Boxes":
- **AudioWorklet DSP Engine:** Granular pitch and formant shifter with 30-second circular RAM buffer and real-time RMS amplitude extraction.
- **WebRTC P2P DataMesh (`bb-sync`):** Binary framing with 5-byte header multiplexing Yjs CRDT updates and ephemeral state synchronization.
- **In-Memory Semantic Matcher:** 384-dimensional cosine vector matching queue with 120-second TTL and automatic zero-knowledge state purging.
- **Capability Sandboxing:** `iframe` security model with 50MB RAM threshold and JSON-RPC 2.0 postMessage bridges.

---

## 3. Technology Reuse Inventory

The table below summarizes every core element, effect, and technique available for reuse across new product concepts:

| Component ID | Technical Mechanism | Source Asset / Code Location |
| :--- | :--- | :--- |
| **COMP-01** | Reciprocal Constraint Solver Equation | `Box_em/index.html` (lines 2209–2260) |
| **COMP-02** | Deforming 3D Reactor Core Mesh | `Box_em/index.html` (lines 2669–2691) |
| **COMP-03** | 20 Crystalline Shaders & Transmission Material | `Box_em/index.html` (lines 2280–2305) |
| **COMP-04** | Supersampled 3D CanvasTexture Billboards | `Box_em/index.html` (lines 2720–2760) |
| **COMP-05** | 3D Raycasting & Anchored Glassmorphism Cards | `Box_em/index.html` (lines 3194–3260) |
| **COMP-06** | Continuous Animated Favicon Engine | `Box_em/index.html` (lines 4980–5050) |
| **COMP-07** | Custom GLTF Model Loader & Mesh Swapper | `Box_em/src/3d/modelLoader.js` |
| **COMP-08** | JSON Schema Guard & Sanitizer Middleware | `Box_em/src/middleware/schemaValidator.js` |
| **COMP-09** | 5-Way Client-Side Export Engine | `Box_em/index.html` (lines 2505–2600) |
| **COMP-10** | Cloudflare D1 + HMAC Webhook Donation Ledger | `Box_em/workers/donationWebhook.js` |
| **COMP-11** | Interactive 3D Donation Hologram Stage | `Box_em/index.html` (lines 4088–4240) |
| **COMP-12** | AudioWorklet DSP & Live RMS Shader Binding | `scattered_files/Modular-attempt.md` & `PDR-CDR.md` |
