<div align="center">

<img src="favicon.svg" alt="Blackboxes Box'em Logo" width="96" height="96" style="margin-bottom: 8px;" />

# BLACKBOXES • BOX'EM
### **3D Reciprocal Constraint Power Tool & Spatial Matrix Engine**

[![License: MIT](https://img.shields.io/badge/License-MIT-38bdf8.svg?style=flat-square)](LICENSE)
[![Zero Build / Offline First](https://img.shields.io/badge/Architecture-Offline--First%20%7C%20Zero--Build-10b981.svg?style=flat-square)](index.html)
[![225 Professions Matrix](https://img.shields.io/badge/Matrix-225%20Researched%20Professions-818cf8.svg?style=flat-square)](src/data/professions.json)
[![Schema: .boxem.json](https://img.shields.io/badge/Schema-.boxem.json%20v1.0-c084fc.svg?style=flat-square)](schemas/v1.schema.json)
[![AI Agent REST API](https://img.shields.io/badge/OpenAPI%203.1-AI%20Agent%20Ready-f59e0b.svg?style=flat-square)](docs/API_REFERENCE.md)
[![Edge: Cloudflare D1](https://img.shields.io/badge/Edge-Cloudflare%20D1%20%2B%20Workers-f97316.svg?style=flat-square)](workers/)

<p align="center">
  <strong>Spatial Equilibrium:</strong> <code>Ns · Nq = K · Nt · Nc</code> &nbsp;|&nbsp; <strong>Zero-Subscription Perpetual Model</strong>
</p>

---

</div>

## 💎 What is Box'em?

**Box'em** is a real-time 3D spatial constraint engine and proposal accelerator designed for software engineers, studios, architects, medtech developers, skilled trades, and **225+ specialized professions**.

Instead of treating project trade-offs as abstract spreadsheets, Box'em balances **Timeline ($N_T$)**, **Investment ($N_C$)**, **Craft Fidelity ($N_Q$)**, and **Scope Volume ($N_S$)** as an interactive 3D tetrahedral vector lattice in WebGL and WebXR.

```
       [TIME (NT)] <------------------------> [COST (NC)]
            \                                      /
             \        [3D OBSIDIAN REACTOR]       /
              \      Ns · Nq = K · Nt · Nc       /
               \                                /
                v                              v
          [QUALITY (NQ)] <------------------> [SCOPE (NS)]
```

---

## ⚡ Quickstart (Get Running in < 60 Seconds)

### Option A: Pure Standalone / Offline (Zero Install)
Box'em requires **no build step and no bundler**. Simply double-click [`index.html`](index.html) in any modern browser.

### Option B: Local Node Development Server
To enable the **AI Agent REST API**, local 3D binary model streaming, and live reload:

```bash
# 1. Clone & Enter Repository
git clone https://github.com/blackboxes/boxem.git
cd boxem

# 2. Start the Server (Default: http://localhost:8080)
npm start
```

* 🎮 **Master Power Tool**: [`http://localhost:8080/index.html`](http://localhost:8080/index.html)
* 🌟 **Showcase & Embeds**: [`http://localhost:8080/marketing.html`](http://localhost:8080/marketing.html)
* 🤖 **AI Agent REST API**: [`http://localhost:8080/api/model?occ=fullstack_web&time=4&cost=8500`](http://localhost:8080/api/model?occ=fullstack_web&time=4&cost=8500)
* 📖 **OpenAPI 3.1.0 Spec**: [`http://localhost:8080/api/openapi.json`](http://localhost:8080/api/openapi.json)

---

## 📐 Mathematical Equilibrium Engine

All parameter trade-offs adhere to the reciprocal constraint equation:

$$N_S \cdot N_Q = K \cdot N_T \cdot N_C$$

Where:
* **Timeline**: $N_T = \max\left(0.001, \frac{\text{Time in Weeks}}{10.0}\right)$
* **Investment**: $N_C = \max\left(0.001, \frac{\text{Cost in USD}}{25000.0}\right)$
* **Craft Quality**: $N_Q = \max\left(0.001, \frac{\text{Quality Percent}}{100.0}\right)$
* **Scope Volume**: $N_S = \max\left(0.001, \frac{\text{Scope Percent}}{100.0}\right)$
* **Equilibrium Constant**: $K \approx 1.0303$

### Mathematical Safety & Division Guards
All operations implement $\epsilon = 0.001$ boundary division guards to prevent division-by-zero, infinite matrices, and WebGL NaN freeze states.

---

## 📚 225+ Researched Profession Library

Box'em includes a researched database of **225 professions** across 15 industries ([`src/data/professions.json`](src/data/professions.json)):
* **Industry Sectors**: Software & Cloud, AI & Robotics, Film & VFX, Architecture & BIM, MedTech & Biosensors, Skilled Trades & Construction, Legal, Finance, and more.
* **Granular Deliverables**: Over 900 domain-specific scope milestones and researched market hourly rates ($10/hr – $2,000/hr).

---

## 🚀 Key Capabilities

* **3D Tetrahedral Obsidian Reactor**: Real-time Three.js spatial lattice with 4 interactive constraint nodes.
* **🔮 20 Crystalline Shaders**:
  * **12 Free Tiers**: *Classic, Quartz, Emerald, Liquid, Polar, Magma, Rose, Nebula, Citrine, Aquamarine, Amethyst, Titanium*.
  * **8 Backer-Exclusive Tiers**: *Kintsugi Gold, Abyssal Depths, Solar Flare, Opaline Core, Damascus Steel, Neon Vapor, Carbon Lattice, Void Singularity*.
* **📦 1-Click Export & Download Suite**:
  * Standalone 3D Binary `.glb` (GLTF 2.0) with embedded `.userData.boxemConfig`.
  * Standardized `.boxem.json` configuration conforming to [JSON Schema v1.0](schemas/v1.schema.json).
  * Markdown Client Pitch Proposals & AI Agent System Prompts.
  * 1-line responsive `<iframe>` interactive embeds.
* **🤖 Programmatic AI Agent Integration**:
  * Zero-friction headless REST API (`GET /api/model`, `POST /api/model`, `GET /api/professions`) for LLM copilot ingestion.

---

## 🧪 Automated Verification & Testing

Box'em ships with a **9-Persona Synergistic Enterprise Audit Suite** and Monte Carlo simulation test harness:

```bash
# Run All Test Suites & 9-Persona Audits
npm test

# Run 225,000-Iteration Monte Carlo Simulation (Vector 4)
npm run simulate
```

---

## 🤝 Get Involved & Be Part of the Project

We welcome contributions from developers, 3D artists, quantitative analysts, and industry specialists!

### How You Can Contribute
1. **Expand the Profession Matrix**: Add or refine industry benchmarks in [`src/data/professions.json`](src/data/professions.json).
2. **Submit 3D Models & Shaders**: Add lightweight, stylized `.glb` node assets to [`models/`](models/) or new WebGL shaders.
3. **Share Industry Presets**: Contribute real-world constraint configurations to [`presets/`](presets/).
4. **Report Gaps & Ideas**: Check out our [Contributing Guidelines](CONTRIBUTING.md) and submit a Pull Request.

Please review our [Code of Conduct](CODE_OF_CONDUCT.md) before participating.

---

## 💎 Voluntary One-Time Backer Program

Box'em is proudly **100% free and open-source under the MIT License**, with **zero recurring subscriptions**.

If Box'em powers your agency, consultancy, or workflow, consider supporting ongoing development with a **one-time voluntary sponsorship**:
* 🔓 **Permanent Unlock**: All 8 Backer-Exclusive Shaders.
* 🎨 **Custom Mesh Customization**: Assign custom 3D geometries to spatial nodes.
* 🌟 **Live Sponsor Hall of Fame**: Instant live listing in our Cloudflare D1 edge ticker stream.

---

## 🔒 Security & Defensive Architecture

* **Defensive Schema Sanitization**: All client-side JSON imports are stripped of scripts and validated against strict numerical bounds.
* **HMAC SHA-256 Webhooks**: Cloudflare Worker donation webhooks verify cryptographic signatures.
* **Relative Assets**: Zero hardcoded local machine paths or external trackers.
* For security disclosures, please refer to our [Security Policy](SECURITY.md).

---

## 📄 License & Governance

Licensed under the [MIT License](LICENSE) &copy; 2026 **Club V Crew** / **Blackboxes Engine**. All rights reserved.

<div align="center">
  <sub>Engineered for spatial precision, mathematical equilibrium, and developer autonomy.</sub>
</div>
