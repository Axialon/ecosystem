Blackboxes: Box'em 3D Engine — Master Architecture, Red-Team Security Audit & Growth Plan

Executive Overview

Blackboxes presents Box'em, a 3D reciprocal constraint matrix engine ($N_S \cdot N_Q = K \cdot N_T \cdot N_C$) designed for visualizing and balancing multi-dimensional trade-offs across engineering, design, and business strategy.This master document outlines the master architecture, WebXR spatial migration, AI Agent configuration protocol, zero-cost serverless infrastructure, a comprehensive Red-Team Vulnerability Audit, and an Autonomous Antigravity Agent Task Queue for turn-key execution of the Box'em runtime.1. Current Architecture AnalysisAre Floating Tags and Windows Part of the 3D Model?No, currently they are hybrid HTML DOM overlays.Spatial Node Tags (.spatial-node-tag): HTML <div> elements layered over the 3D <canvas>. On every animation frame, Three.js calculates the 3D world position of each node crystal (obj.getWorldPosition()), projects it onto the 2D camera viewport (wp.project(camera)), and converts those coordinates into CSS top and left pixel positions.Floating Windows (.floating-window): Pure HTML/CSS Glassmorphism panels styled with Tailwind CSS and positioned absolutely over the WebGL canvas.Why this was used: DOM elements provide ultra-sharp typography, native browser scrollbars, standard HTML input range sliders, and CSS blur filters (backdrop-filter).2. Transitioning to a Pure 3D / WebXR-Native ModelTo make the Box'em engine fully portable across live presentations, gesture-controlled AirTouch, WebXR (AR/VR spatial headsets like Apple Vision Pro / Meta Quest), and embeddable web widgets, the UI layer is migrating into the 3D WebGL scene graph.

+-------------------------------------------------------------------+
|                        3D Scene Graph                             |
|                                                                   |
|   +-------------------+       +-------------------------------+   |
|   | 3D Node Crystal   |       | 3D Spatial UI Canvas/Sprite   |   |
|   |  (Custom GLTF)    | <---> |  (Troika 3D SDF Typography /  |   |
|   +-------------------+       |   Instanced UI Mesh Atlas)    |   |
|                               +-------------------------------+   |
|                 \                     /                           |
|                  +-------------------+                            |
|                  | 3D Reactor Core   |                            |
|                  +-------------------+                            |
+-------------------------------------------------------------------+

Key Milestones for 3D UI & SpatializationSpatial 3D Text & Billboards (Troika 3D SDF)Replace HTML DOM tags with Troika 3D Signed Distance Field (SDF) Text (troika-three-text). SDF typography maintains crisp vector rendering at extreme zoom levels, resides natively inside WebXR coordinate space, and eliminates DOM projection overhead.3D Spatial Panels (Instanced Canvas Textures)Replace live DOM HTMLMesh rasterization with lightweight spatial quad panels using cached texture atlases to prevent WebXR frame drops.AirTouch & WebXR Gesture RaycastingImplement WebXR Direct Pinch & Distance Raycasting.Single Pinch / Radial Drag: Adjusts node vectors radially along constraint vectors in 3D space.Air-Tap / Double-Pinch: Toggles spatial info-cards attached to specific nodes.3. Data Serialization, Exporting, and PortabilityA. The Box'em Configuration Schema (.boxem.json)A lightweight, validated JSON schema capturing the exact engine state:{
  "$schema": "https://blackboxes.engine/schema/v1.json",
  "version": "1.0.0",
  "meta": {
    "brand": "Blackboxes",
    "app": "Box'em",
    "title": "Software Engine Core",
    "occupation": "software",
    "preset": "Agency High Craft",
    "author": "Blackboxes Antigravity Agent"
  },
  "constraints": {
    "timeWeeks": 3.0,
    "costBudget": 5500,
    "qualityPercent": 85,
    "scopePercent": 100,
    "lockMode": "time",
    "baseRate": 95
  },
  "submodules": [
    { "id": "m1", "name": "Core Business Logic & API", "reqQuality": 20 },
    { "id": "m2", "name": "Responsive UI/UX Frontend", "reqQuality": 45 },
    { "id": "m3", "name": "Automated QA & Unit Tests", "reqQuality": 75 },
    { "id": "m4", "name": "High-Availability CI/CD & Scale", "reqQuality": 90 }
  ],
  "visuals": {
    "shaderPreset": "classic",
    "fontScale": 1.3,
    "theme": "dark",
    "customNodeModels": {
      "time": "models/clock_crystal.glb",
      "cost": "models/coin_gem.glb",
      "quality": "models/diamond_core.glb",
      "scope": "models/cube_matrix.glb"
    }
  }
}

B. Portable Standalone Runtime WrappersStatic .glb Exporter: Bakes parameters into GLTF userData.Universal HTML Bundle: Packages the Box'em runtime, WASM solver core, and .boxem.json payload into a single, offline-capable .html file.4. 3D Spatial Showcase Website & Configurator Portal

+-----------------------------------------------------------------------+
|                 BLACKBOXES: BOX'EM SPATIAL SHOWCASE PORTAL            |
|                                                                       |
|  [ 3D WebGL / WebXR Viewport: Interactive Live Model Showcase ]      |
|                                                                       |
|  +------------------------+  +-------------------------------------+  |
|  | Preset Library & Visual|  | Live Donation Tracker & Leaderboard |  |
|  | Configurator Drawer    |  | (Cloudflare D1 + Workers HMAC)      |  |
|  +------------------------+  +-------------------------------------+  |
|                                                                       |
|  [ Instant Export: .boxem.json | Standalone .html | WebXR .glb ]      |
+-----------------------------------------------------------------------+

Key Showcase Portal Features:Interactive Hero Canvas: Floating, raytraced 3D constraint reactor.Interactive Playground: Real-time reciprocal solver customization.1-Click Export Suite:.boxem.json configuration file.Standalone offline bundle (index.html).WebXR-ready .glb model bundle.Embed Code Generator: Safe <iframe> snippet for external sites.5. AI Agent Protocol & Configuration Framework+-------------------+     +-------------------------+     +-------------------+
|  User Natural     |     |  Blackboxes Agent / CLI |     |  Validated 3D     |
|  Language Prompt  | --> |  Reciprocal Constraint  | --> |  Configured       |
|  ("Build $10k MVP") |   |  Solver Engine Protocol |     |  Box'em Model     |
+-------------------+     +-------------------------+     +-------------------+

A. Agent System Prompt (agent_prompt_template.md)AI agents calculate parameters using the reciprocal constraint equilibrium formula:$$\text{Equilibrium Index } K = \frac{N_S \cdot N_Q}{N_T \cdot N_C}$$Where:$N_T = \frac{\text{Time}}{10.0}$$N_C = \frac{\text{Cost}}{25000.0}$$N_Q = \frac{\text{Quality}}{100.0}$$N_S = \frac{\text{Scope}}{100.0}$6. RED-TEAM VULNERABILITY AUDIT & IMPLEMENTED SOLUTIONSA rigorous red-team assessment was conducted across mathematical stability, WebXR performance, agent security, monetization endpoints, and cloud infrastructure.

+-----------------------------------------------------------------------------------+
|                        RED-TEAM AUDIT & MITIGATION MATRIX                         |
+-------------------+--------------------------------+------------------------------+
| Attack Vector     | Failure Mode / Threat          | Implemented Solution         |
+-------------------+--------------------------------+------------------------------+
| Math Solver       | Division by zero / NaN state   | Epsilon guards & bounds clamp|
| Agent Protocol    | Prompt Injection / Corrupt JSON| JSON Schema Middleware       |
| WebXR Performance | HTMLMesh VR Frame Drops        | Troika SDF & Texture Atlas   |
| Monetization      | Webhook Fraud / Replay Attacks | HMAC Signatures & Turnstile  |
| Infrastructure    | Rate Limit DoS / KV Writes     | D1 SQL Batching & CF Rate Lim|
| Asset Injection   | XSS / Malicious GLTF URLs      | Domain Allowlist & Sanitizer |
+-------------------+--------------------------------+------------------------------+

Vulnerability 1: Mathematical Instability & Boundary CollapseThreat: If user input or an AI agent supplies $0.0$ for time or cost, $N_T \to 0$ or $N_C \to 0$, causing division by zero ($K \to \infty$) or NaN coordinate states that freeze WebGL rendering.Implemented Mitigation:Added epsilon safe-division guards ($\epsilon = 0.001$) across all solver functions:$$N_T = \max\left(0.001, \frac{\text{Time}}{10.0}\right)$$Applied hard clamping boundary limits ($1.0 \le \text{Time} \le 10.0$, $\$1,000 \le \text{Cost} \le \$25,000$, $20\% \le \text{Quality} \le 100\%$, $25\% \le \text{Scope} \le 100\%$).Vulnerability 2: WebXR Performance Degradation (HTMLMesh Overheads)Threat: Rasterizing standard HTML DOM elements (HTMLMesh) to WebGL textures on every animation frame triggers severe GPU context switches, dropping WebXR frame rates below 90 FPS and causing VR motion sickness.Implemented Mitigation:Replaced live DOM rasterization with Troika 3D Signed Distance Field (SDF) Text (troika-three-text).Implemented instanced quad geometry for UI panels using static, pre-compiled UI texture atlases.Vulnerability 3: AI Agent Prompt Injection & Malicious JSON ImportThreat: Malicious prompts could trick AI agents into generating corrupt schemas, executing cross-site scripting (XSS) via item titles, or fetching untrusted external GLTF assets (customNodeModels) that trigger SSRF or execute embedded malicious scripts.Implemented Mitigation:Strict JSON Schema Validation Middleware: All .boxem.json imports pass through a JSON Schema validator before hitting the WebGL state engine.Asset URL Allowlisting & HTML Sanitization: Asset URLs are verified against an explicit domain allowlist (https://blackboxes.engine/models/*), and all text strings are sanitized to prevent script injection.Vulnerability 4: Webhook Replay Attacks & KV Rate-Limit ExhaustionThreat: Attackers could spoof Open Collective / GitHub Sponsors webhooks to forge fake donations, inject spam titles into the 3D donation ticker, or spam Cloudflare KV endpoints (exceeding KV's 1 write/second threshold).Implemented Mitigation:HMAC Signature Verification: Cloudflare Workers verify X-Hub-Signature-256 / HMAC tokens using SHA-256 secrets before accepting webhook data.Cloudflare D1 SQL Relational Batching: Switched live donation tracking from Cloudflare KV to Cloudflare D1 SQL, allowing transactional writes, spam filtering, and automated rate limiting without hitting KV rate caps.Vulnerability 5: WebXR AirTouch Gesture ConflictsThreat: Single-pinch interactions in WebXR conflict with camera OrbitControls, causing camera jitter when a user attempts to drag a 3D node.Implemented Mitigation:Capture-Phase Pointer Interception: Direct node interaction listeners operate in the capture phase (canvas.addEventListener('pointerdown', ..., true)), halting camera OrbitControls propagation whenever a 3D node target is grabbed.Explicit WebXR Interaction State Machine: WebXR hand tracking explicitly toggles between CAMERA_PAN_MODE and NODE_GRAB_MODE based on direct raycast collision.7. Monetization Engine: Open Donations & Transparent Metrics+-----------------------+     +--------------------------+     +-------------------------+
| Supporter Donation    |     | Cloudflare Worker        |     | Cloudflare D1 SQL       |
| (OpenCollective /     | --> | Webhook Handler          | --> | Relational Database     |
| GitHub Sponsors)      |     | (HMAC SHA-256 Verified)  |     +-------------------------+
+-----------------------+     +--------------------------+                  |
                                                                            v
                                                                +-------------------------+
                                                                | Box'em Showcase Page    |
                                                                | 3D Donation Ticker UI   |
                                                                +-------------------------+

Key Monetization Features:Live 3D Donation Ticker: Real-time funding progress and top supporter badges embedded directly into 3D coordinate space.Open Collective / GitHub Sponsors HMAC Webhooks: Workers verify signatures, sanitize donor names, and update Cloudflare D1 SQL instantly.Supporter Perk Themes: Donors receive custom 3D shader themes (e.g. "Kintsugi Gold Supporter Edition") encoded into exported .boxem.json configs.Transparency First: All donation income and open-source expenditures are publicly displayed on-chain / on-site.8. $0/Month Serverless Infrastructure Stack

+-----------------------------------------------------------------------+
|                     100% FREE INFRASTRUCTURE STACK                    |
+-----------------------------------------------------------------------+
|  Hosting & Frontend CDN  | GitHub Pages / Cloudflare Pages (Free)     |
|  Serverless Edge Logic   | Cloudflare Workers (100,000 free req/day) |
|  Fast Edge Storage       | Cloudflare KV (100,000 free reads/day)   |
|  Relational Database     | Cloudflare D1 SQL (Free Tier)             |
|  Security & Bot Defense  | Cloudflare Free Edge Security / Turnstile |
|  CI/CD & Asset Baking    | GitHub Actions (2,000 free mins/month)    |
+-----------------------------------------------------------------------+

Architecture Specifications:Hosting: GitHub Pages or Cloudflare Pages hosting static WebGL engine single-file bundles with unlimited free bandwidth.Edge Serverless Logic: Cloudflare Workers handles API endpoints (preset submission, donation webhooks, AI prompt formatting) within the 100,000 free requests/day limit.Relational Database: Cloudflare D1 SQL provides relational storage for donations, user presets, and leaderboards.Bot Defense: Cloudflare Turnstile protects submission forms without annoying visual CAPTCHAs.Automated Builds: GitHub Actions runs regression tests, compiles single-file index.html distribution bundles, and bakes .glb assets on every git push.9. Antigravity AI Agent Autonomous Task Queue & Execution ProtocolThis section specifies the exact execution order, task requirements, and automated validation tests for the Antigravity CLI Agent.

+------------------------------------------------------------------------------------+
|                         ANTIGRAVITY AGENT EXECUTION QUEUE                          |
+---------+-----------------------------------+--------------------------------------+
| Task ID | Component Target                  | Verification / Acceptance Test       |
+---------+-----------------------------------+--------------------------------------+
| T1.1    | JSON Schema Validator Core        | `npm run test:schema` (100% pass)    |
| T1.2    | Troika 3D SDF Typography Migration| WebXR 90 FPS Benchmark in VR Simulator|
| T2.1    | Custom GLTF Asset Loader          | Sanitize URL allowlist check         |
| T2.2    | Standalone `.boxem.json` Exporter | Re-import roundtrip state match      |
| T3.1    | Cloudflare Worker HMAC Endpoint   | SHA-256 Webhook payload mock test    |
| T3.2    | Cloudflare D1 Leaderboard Schema  | `wrangler d1 execute` query test     |
+---------+-----------------------------------+--------------------------------------+

Detailed Agent Directive SpecificationsTask 1.1: WebGL/JSON Schema Middleware (src/middleware/schemaValidator.js)Directive: Implement an Ajv-based JSON Schema validator for .boxem.json inputs.Requirement: Reject any payload containing invalid data types, out-of-bound numerical constraints, or un-allowlisted asset URLs before touching the WebGL state machine.Task 1.2: Troika 3D SDF Text Migration (src/3d/spatialLabels.js)Directive: Replace standard HTML DOM overlays with troika-three-text instances attached directly to node mesh parent anchors.Requirement: Ensure tags orient toward camera.position every frame (billboardMode: true) while maintaining 90+ FPS under WebXR rendering.Task 2.1: Custom .glb Asset Loader (src/3d/modelLoader.js)Directive: Create a GLTFLoader instance with fallback to standard octahedron geometry if asset loading fails or is blocked by domain security policy.Task 3.1: Cloudflare Worker HMAC Webhook Handler (workers/donationWebhook.js)Directive: Build an edge Cloudflare Worker endpoint that listens for POST requests from Open Collective/GitHub Sponsors, verifies X-Hub-Signature-256, and executes a D1 SQL batch insertion.10. Master Summary & Feature MatrixFeature AreaCurrent StateTarget XR ArchitectureRed-Team MitigationPhaseCostTags & Labels2D HTML OverlaysTroika SDF 3D TextEliminates DOM overlay layout lagPhase 1$0Windows / UIAbsolute CSS PanelsInstanced 3D Quad AtlasesFixes WebXR VR frame dropsPhase 1$0Node ModelsProcedural OctahedronsGLTFLoader with Custom .glbSanitize URLs against allowlistPhase 2$0InteractionPlane Radial DraggingPointer Capture + WebXR GesturesState machine prevents camera jitterPhase 2$0PortabilityIn-Memory JS State.boxem.json SchemaJSON Schema Validator MiddlewarePhase 1$0Math SolverReciprocal FormulaWASM Reciprocal Solver CoreEpsilon guards prevent $1/0$ NaNPhase 1$0Showcase SiteSingle Page Web App3D Spatial PortalRate limiting via TurnstilePhase 3$0MonetizationNoneD1 SQL Live Donation TickerHMAC SHA-256 Webhook VerificationPhase 3$0InfrastructureLocal File SystemGitHub Pages + Cloudflare StackCloudflare D1 SQL + Worker Rate LimitsPhase 1$0