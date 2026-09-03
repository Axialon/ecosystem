# Contributing to Blackboxes • Box'em

Thank you for your interest in contributing to **Blackboxes • Box'em**, the 3D Reciprocal Constraint Power Tool and Spatial Profession Matrix!

This guide outlines our development workflow, pull request standards, architecture principles, and instructions for contributing new professions, 3D models, or engine optimizations.

---

## 🧭 Code of Conduct

All contributors are expected to adhere to our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before participating in discussions or submitting PRs.

---

## 🛠️ Quickstart: Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/blackboxes/boxem.git
   cd boxem
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Local Development Server**:
   ```bash
   npm start
   ```
   Open `http://localhost:8080/index.html` in your browser.

4. **Run Verification & Audit Suites**:
   ```bash
   npm test
   ```
   Or run the multi-persona audit suite directly:
   ```bash
   npm run audit
   ```

---

## 📦 How to Contribute

### 1. Adding or Updating Professions (225+ Matrix)
Our profession matrix is defined in [`src/data/professions.json`](src/data/professions.json).
Each profession entry must follow this schema:
```json
{
  "id": "quantum_computing_researcher",
  "category": "AI, Machine Learning & Robotics",
  "title": "Quantum Computing Algorithm Architect",
  "badge": "QUANTUM",
  "rate": 195,
  "time": 6.5,
  "cost": 15500,
  "qual": 96,
  "submodules": [
    { "id": "mod_1", "name": "Qubit Hamiltonian Circuit Mapping", "reqQuality": 95 },
    { "id": "mod_2", "name": "Quantum Error Correction Protocol", "reqQuality": 92 },
    { "id": "mod_3", "name": "Variational Quantum Eigensolver Optimization", "reqQuality": 88 },
    { "id": "mod_4", "name": "Noisy Intermediate-Scale Simulation Benchmark", "reqQuality": 85 }
  ]
}
```
After modifying `professions.json`, rebuild the browser bundle:
```bash
npm run generate:professions
```

### 2. Adding 3D Node Models or Shaders
* **3D Models**: Add optimized binary glTF `.glb` files to the `models/` directory. Ensure models are centered at origin `(0, 0, 0)` with uniform bounding scale $\le 1.0\text{m}$.
* **Crystalline Shaders**: Add shader configurations to `SHADER_PRESETS` in `index.html` (supporting `coreColor`, `coreEmissive`, `roughness`, `transmission`, and `ior`).

### 3. AI Agent Integrations
* Box'em supports programmatic AI queries via `/api/model` and `/api/professions`.
* See [`docs/API_REFERENCE.md`](docs/API_REFERENCE.md) and [`agent_prompt_template.md`](agent_prompt_template.md) for details.

---

## 🧪 Testing & Quality Gates

Every pull request must pass 100% of our test suites:
```bash
npm test
```
This runs:
* Schema validation & prototype pollution defense tests
* 3D GLTF model loader security allowlist tests
* Binary `.glb` magic header and container integrity tests
* Presets library compliance tests
* 225 professions matrix completeness tests
* Cloudflare Worker HMAC SHA-256 signature tests
* End-to-end local asset delivery tests
* Mathematical boundary and singularity convergence tests
* Multi-Persona Automated Audit Suite

---

## 📜 Pull Request Checklist

Before submitting your PR:
- [ ] Code follows project conventions (clean, dependency-free vanilla JS where possible).
- [ ] Added or updated test cases if introducing new features.
- [ ] Verified `npm test` passes 100% locally.
- [ ] Updated relevant documentation in `/docs` or `README.md`.
- [ ] PR title follows [Conventional Commits](https://www.conventionalcommits.org/) (e.g., `feat: add quantum computing profession matrix`).

---

## ⚖️ License
By contributing to Blackboxes • Box'em, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).
