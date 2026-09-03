Antigravity Agent Operational Directive

1. Project Identity & Naming RulesParent Brand: Blackboxes (Always capitalized as single word)Application Name: Box'em (3D Reciprocal Constraint Engine)Schema File Format: .boxem.jsonRule: Maintain strict brand consistency across UI, CLI scripts, schemas, and generated code.

2. Core Architectural PrinciplesSingle-File Web Distribution: The main web app core must compile into a self-contained single-file bundle (index.html).$0/Month Infrastructure: Only use serverless edge free tiers: GitHub Pages/Actions, Cloudflare Workers, Cloudflare D1 SQL, Cloudflare Turnstile.Math Solver Safety: All reciprocal calculations must use $\epsilon$-division guards ($\epsilon = 0.001$) and strict value clamping. Never allow NaN coordinate states.Performance Target: 90+ FPS under WebXR rendering using Troika SDF 3D text and instanced UI quad atlases (no live HTML DOM rasterization in VR).

3. Local Operational & Memory Workspace (.agent/)To maintain session memory, context persistence, and execution state without polluting the open-source git repository, initialize a local runtime workspace at .agent/.Mandatory Directory SetupCreate the following local structure prior to task execution:.agent/
├── memory.json         # Persistent state, task status tracking, feature flags
├── scratchpad.md       # Agent draft notes, execution logs, and temp diffs
└── logs/               # Verbose CLI output, test runs, build logs
Gitignore PolicyEnsure .gitignore contains the following entries to keep local agent state out of version control:# Local AI Agent Workspace & State
.agent/
.antigravity/
*.log
.env
.env.local

4. Execution Protocol & Verification QueueRefer to PLAN.md Section 9 for task specs:T1.1 (JSON Schema Middleware): Validate all .boxem.json imports with Ajv schema guards before updating WebGL state.T1.2 (Troika SDF Migration): Replace 2D DOM overlays with troika-three-text spatial text nodes.T2.1 (Custom GLTF Loader): Add safe GLTFLoader with local octahedron fallback on load/security failure.T2.2 (Data Portability): Maintain roundtrip parity between .boxem.json exports and runtime engine state.T3.1 (Cloudflare HMAC Worker): Verify X-Hub-Signature-256 SHA-256 tokens on incoming webhooks.T3.2 (D1 Relational Ticker): Use Cloudflare D1 SQL batch transactions for live donation tracking.5. Definition of Done (DoD)Code passes all unit/schema tests (npm run test:schema).WebGL/WebXR maintains zero frame drops and zero NaN matrix crashes.All newly added files comply with the zero-cost architecture and .gitignore rules.