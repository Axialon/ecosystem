Here is the complete, modular `.md` operating specification for **Project: Black Boxes**.

Save these five documents inside a `specs/` or root directory of your workspace. When bootstrapping an autonomous AI coding agent, point it directly to **`StartPrompt.md`**.

---

### File 1: `StartPrompt.md` (Agent Master Bootstrap & Orchestrator)

```markdown
# AGENT DIRECTIVE: PROJECT "BLACK BOXES"

You are the Lead Systems Architect and Principal Engineer for **Project: Black Boxes**.
Your mission is to autonomously scaffold, implement, test, and harden the complete Black Boxes platform end-to-end in rigorous, sequential stages.

---

## 1. System Identity & Core Tenets
- **What It Is:** An open-core, zero-knowledge, ephemeral co-presence platform. Users control sovereign personal workspaces embodied as crystalline obsidian monoliths floating in a high-contrast, silvery-white 3D void.
- **Core Philosophy:** Anti-surveillance, anti-bot, human-first serendipity. When two users seek focus or creative collaboration, their Black Boxes dock peer-to-peer. A shared projection workspace opens between them; all state dissolves completely upon disconnect.
- **Strict Guardrails:** 
  1. No unencrypted user telemetry or persistent activity logs.
  2. RAM-only flight recording for safety attestation (auto-purged unless reported).
  3. Strict capability sandboxing for all third-party micro-tools.

---

## 2. Document Map & Reference Architecture
Read and internalize the companion specifications before generating code:
- **`01_System_Architecture.md`**: High-level topology, monorepo layout, and runtime lifecycles.
- **`02_3D_Visual_Shader_Spec.md`**: Three.js/R3F scene graphs, lighting, and GLSL obsidian shaders.
- **`03_Audio_DSP_WebRTC_Spec.md`**: In-browser AudioWorklets, pitch modulation, and P2P binary protocols.
- **`04_Tool_Sandbox_CRDT_Spec.md`**: Iframe RPC bus, Yjs synchronization, and Bazaar marketplace rules.

---

## 3. Sequential Execution Roadmap
You must execute development in strict chronological stages. Do not jump ahead until the current stage meets all verification criteria:


```

┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   STAGE 1    │────►│   STAGE 2    │────►│   STAGE 3    │────►│   STAGE 4    │
│ Foundation & │     │  3D Void &   │     │ Audio DSP &  │     │  Sandboxed   │
│   Monorepo   │     │ Shaders (R3F)│     │  WebRTC P2P  │     │ Tool Sandbox │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
│
▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   STAGE 8    │◄────│   STAGE 7    │◄────│   STAGE 6    │◄────│   STAGE 5    │
│ Production & │     │ Safety Flight│     │ Tool Bazaar  │     │  In-Memory   │
│ Hardened CI  │     │   Recorder   │     │ & Licensing  │     │ Nexus Matcher│
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘

```

### Stage Breakdown:
1. **Stage 1 (Workspace Scaffolding):** Turborepo, Next.js 14 App Router, TypeScript configs, Tailwind CSS, and base package scaffolding.
2. **Stage 2 (3D Void & Obsidian Box Engine):** Three.js / React Three Fiber scene, custom GLSL obsidian crystal shader with Fresnel and audio-reactive core luminescence, camera spring physics.
3. **Stage 3 (AudioWorklet DSP & WebRTC Mesh):** Client-side pitch/formant shifting processor, RMS amplitude extraction, P2P WebRTC data/audio pipeline with stateless TURN fallback.
4. **Stage 4 (Sandboxed Tool SDK & Shared Projection):** Iframe RPC postMessage bridge, Yjs CRDT binding, tool casting mechanics onto the shared holographic plane.
5. **Stage 5 (In-Memory Nexus Matcher):** WebSocket signaling gateway, ephemeral cosine vector matching queue with 120s TTL and auto-purging logic.
6. **Stage 6 (Tool Bazaar & Creator Economy):** `.bbtool` packaging schema, Ed25519 signature verification, Stripe checkout web hooks.
7. **Stage 7 (Safety Flight Recorder & Attestation):** 30-second circular RAM buffer, emergency eject and signed incident report dispatcher.
8. **Stage 8 (Hardening & Verification):** Vitest/Playwright test suites, memory leak audits, and production Docker/Vercel configurations.

---

## 4. Immediate Next Step
Begin with **Stage 1**: Scaffold the complete monorepo configuration, root dependencies, and package configurations according to `01_System_Architecture.md`.

```

---

### File 2: `01_System_Architecture.md` (System Topology & Lifecycle)

```markdown
# 01. System Architecture & Topology

## 1. High-Level Monorepo Structure


```

black-boxes/
├── apps/
│   ├── web/                          # Next.js 14 App Router (Main Client Workspace)
│   │   ├── src/
│   │   │   ├── app/                  # Layouts, Viewport Page, Ephemeral API routes
│   │   │   ├── components/
│   │   │   │   ├── 3d/               # R3F Canvas, Box Meshes, Void Scene, Projection Plane
│   │   │   │   ├── workspace/        # Tool Dock, Local Scratchpad, Control Bar
│   │   │   │   └── audio/            # Audio Settings, Pitch Sliders, Timbre Presets
│   │   │   └── lib/
│   │   │       ├── webrtc/           # PeerConnection, DataChannel multiplexer, Mesh
│   │   │       └── state/            # Local RAM stores (Zustand / Nanostores)
│   │   └── package.json
│   └── nexus-matcher/                # Fast Edge Gateway (Ephemeral In-Memory Matcher)
│       ├── src/
│       │   ├── index.ts              # WebSocket Server
│       │   ├── matcher.ts            # HNSW Cosine Similarity Index (120s TTL)
│       │   └── roomNonce.ts          # Ephemeral Session Token Generator
│       └── package.json
├── packages/
│   ├── tool-sdk/                     # @blackbox/tool-sdk (Open Source Micro-App SDK)
│   │   ├── src/                      # RPC Bus, Manifest Validators, Yjs CRDT Wrappers
│   │   └── package.json
│   ├── audio-dsp/                    # In-Browser Web Audio Worklet DSP Engine
│   │   ├── src/                      # BlackBoxAudioProcessor.ts (Pitch Shifter & Ring Buffer)
│   │   └── package.json
│   └── shaders/                      # GLSL Shaders & Three.js ShaderMaterial definitions
│       ├── src/                      # Obsidian.vert.glsl, Obsidian.frag.glsl, Void.frag.glsl
│       └── package.json
├── turbo.json
├── package.json
└── tsconfig.json

```

---

## 2. State & Lifecycle Model


```

┌────────────────────────────────────────────────────────────┐
│                     1. SOLO WORKSPACE                      │
│ • Sovereign local state (RAM / Encrypted IndexedDB)        │
│ • Air-gapped: No network requests, zero telemetry          │
└─────────────────────────────┬──────────────────────────────┘
│ User activates Beacon
▼
┌────────────────────────────────────────────────────────────┐
│                     2. BEACON ACTIVE                       │
│ • 384-dim semantic vector generated on client              │
│ • Dispatched to Nexus Gateway with 120-second TTL          │
│ • 3D Obsidian Box pulses with ambient wave animation       │
└─────────────────────────────┬──────────────────────────────┘
│ Cosine match found (≥ 0.78)
▼
┌────────────────────────────────────────────────────────────┐
│                     3. DOCKED SESSION                      │
│ • WebRTC P2P direct handshake (DTLS/SRTP audio stream)     │
│ • Shared holographic projection field opens in 3D void     │
│ • Cross-Box Tool Lending & Yjs CRDT real-time sync         │
└─────────────────────────────┬──────────────────────────────┘
│ Timer expires OR User clicks Disconnect
▼
┌────────────────────────────────────────────────────────────┐
│                  4. ZERO-KNOWLEDGE PURGE                   │
│ • 3D Box shatters into glass particles and fades out       │
│ • All shared buffers, Yjs docs, and audio contexts zeroed  │
│ • Client returns to Solo Workspace                         │
└────────────────────────────────────────────────────────────┘

```

```

---

### File 3: `02_3D_Visual_Shader_Spec.md` (Three.js & Custom GLSL)

```markdown
# 02. 3D Visual & Shader Specification

## 1. Visual Design Language
- **Background:** High-contrast silvery-white infinite void with soft radial gradient and subtle floating glass particles.
- **User Representation:** Obsidian crystalline monoliths ($1.4 \times 2.2 \times 1.4$ aspect ratio) featuring sharp beveled edges, high specular reflections, and an audio-reactive internal luminescence.
- **The Projection Field:** A semi-transparent, luminous holographic horizontal plane extending between two docked boxes displaying collaborative tools.

---

## 2. Obsidian Monolith GLSL Shaders

### Vertex Shader (`obsidian.vert.glsl`)
```glsl
varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vWorldPosition;
varying vec2 vUv;

void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
}

```

### Fragment Shader (`obsidian.frag.glsl`)

```glsl
uniform float uTime;
uniform float uAudioAmp;           // 0.0 to 1.0 (Live audio RMS)
uniform float uDockProgress;       // 0.0 (Solo) -> 1.0 (Docked)
uniform vec3 uObsidianColor;       // vec3(0.02, 0.02, 0.04)
uniform vec3 uRimGlowColor;        // vec3(0.85, 0.90, 0.98)
uniform vec3 uCoreColor;           // vec3(0.35, 0.50, 0.85)

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vWorldPosition;
varying vec2 vUv;

void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewPosition);
    
    // 1. Fresnel Edge Reflection (Schlick's approximation)
    float NdotV = max(dot(N, V), 0.0);
    float fresnel = pow(1.0 - NdotV, 3.8);
    
    // 2. Anisotropic Specular Highlight
    vec3 lightDir = normalize(vec3(0.5, 1.0, 0.75));
    vec3 H = normalize(lightDir + V);
    float spec = pow(max(dot(N, H), 0.0), 48.0);
    
    // 3. Audio-Reactive Internal Core Glow
    float pulse = sin(uTime * 3.0 + vWorldPosition.y * 4.0) * 0.5 + 0.5;
    float corePower = (uAudioAmp * 0.85) + (pulse * 0.15);
    vec3 coreEmissive = uCoreColor * corePower * smoothstep(0.7, 0.0, length(vUv - 0.5));
    
    // 4. Final Color Assembly
    vec3 surface = uObsidianColor + (spec * 0.35);
    vec3 edgeGlow = uRimGlowColor * fresnel * (0.6 + 0.4 * uDockProgress);
    
    gl_FragColor = vec4(surface + edgeGlow + coreEmissive, 1.0);
}

```

---

## 3. Kinetic Camera & Motion Rig

* Damped spring physics (mass: 1.0, tension: 120, friction: 14).
* In **Solo Mode**, camera centers at `[0, 1.5, 5]`.
* In **Docked Mode**, camera smoothly interpolates to `[0, 2.0, 6.5]` to frame both Black Boxes and the shared projection plane.

```

---

### File 4: `03_Audio_DSP_WebRTC_Spec.md` (Audio & P2P Protocols)

```markdown
# 03. Audio DSP Engine & WebRTC Specification

## 1. Web Audio Processing Topology


```

[MediaStreamSource (Mic)] ──► [AudioWorklet: BlackBoxAudioProcessor]
│
┌───────────────────────────┴───────────────────────────┐
▼                                                       ▼
[Pitch/Formant Shifter]                                 [Circular RAM Buffer]
(Granular Vocoder 0.7x-1.3x)                            (30s FIFO @ 48kHz)
│                                                       │
▼                                                       ▼
[MediaStreamDestination]                                [Emergency Eject Dump]
│                                              (Encrypted & signed)
▼
[WebRTC PeerConnection.addTrack]

```

---

## 2. AudioWorklet Implementation (`BlackBoxAudioProcessor.ts`)

```typescript
class BlackBoxAudioProcessor extends AudioWorkletProcessor {
  private circularBuffer: Float32Array;
  private writeIndex: number = 0;
  private pitchRatio: number = 1.0;
  private readonly bufferLength: number = 48000 * 30; // 30 seconds

  constructor() {
    super();
    this.circularBuffer = new Float32Array(this.bufferLength);
    this.port.onmessage = (event: MessageEvent) => {
      if (event.data.type === 'SET_PITCH') {
        this.pitchRatio = event.data.value; // e.g. 0.85 (Deep), 1.15 (Soft)
      } else if (event.data.type === 'DUMP_RECORDER') {
        const dump = new Float32Array(this.bufferLength);
        dump.set(this.circularBuffer);
        this.port.postMessage({ type: 'RECORDER_DATA', buffer: dump }, [dump.buffer]);
      }
    };
  }

  process(inputs: Float32Array[][], outputs: Float32Array[][]): boolean {
    const input = inputs[0];
    const output = outputs[0];
    if (!input || !input[0] || !output || !output[0]) return true;

    const inChan = input[0];
    const outChan = output[0];
    let sumSquares = 0.0;

    for (let i = 0; i < inChan.length; i++) {
      const sample = inChan[i];
      
      // Store in volatile circular buffer for safety attestation
      this.circularBuffer[this.writeIndex] = sample;
      this.writeIndex = (this.writeIndex + 1) % this.bufferLength;
      
      sumSquares += sample * sample;
      outChan[i] = sample * this.pitchRatio;
    }

    const rms = Math.sqrt(sumSquares / inChan.length);
    this.port.postMessage({ type: 'RMS_AMPLITUDE', value: Math.min(rms * 4.0, 1.0) });

    return true;
  }
}
registerProcessor('black-box-audio-processor', BlackBoxAudioProcessor);

```

---

## 3. WebRTC DataChannel Protocol (`bb-sync`)

All non-audio data is multiplexed over an encrypted WebRTC DataChannel using binary frames:

| Byte Offset | Field | Type | Description |
| --- | --- | --- | --- |
| `0x00` | OpCode | `uint8` | `0x01`: CRDT Delta, `0x02`: Tool Lend Offer, `0x03`: Tool Accept, `0x04`: Blind Signal, `0x05`: Purge |
| `0x01..0x04` | Length | `uint32_be` | Payload length ($L$) in bytes |
| `0x05..0x05+L` | Payload | `bytes` | Binary payload (Yjs update vector or JSON payload) |

```

---

### File 5: `04_Tool_Sandbox_CRDT_Spec.md` (Tool SDK & Bazaar Ecosystem)

```markdown
# 04. Tool Sandbox SDK & Bazaar Specification

## 1. Sandbox Security Model
Micro-tools execute inside an isolated `iframe` with `sandbox="allow-scripts"`.
- **Blocked:** `localStorage`, cookies, parent DOM access, direct WebGL context creation.
- **Allowed:** Web Audio synthesis (upon permission grant), postMessage RPC bridge to parent workspace.


```

┌──────────────────────────────────────────────────────────┐
│                   PARENT BLACK BOX HOST                  │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Yjs Doc / CRDT Sync Engine                         │  │
│  └────────────────────────┬───────────────────────────┘  │
│                           │ window.postMessage (JSON-RPC) │
│                           ▼                              │
│  ┌────────────────────────────────────────────────────┐  │
│  │ ISOLATED IFRAME HOST (sandbox="allow-scripts")     │  │
│  │  • @blackbox/tool-sdk Client                       │  │
│  │  • Micro-tool UI & Logic (React/Svelte/HTML5)      │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘

```

---

## 2. Tool Manifest Specification

```typescript
export interface BlackBoxToolManifest {
  manifestVersion: "1.0.0";
  id: string;                      // Reverse domain: "org.blackbox.scratchpad"
  name: string;
  version: "1.0.0";
  author: {
    name: string;
    pubKey: string;                // Ed25519 public key for package signature
  };
  entrypoint: string;              // URL or relative bundled HTML file
  permissions: {
    audioOutput: boolean;
    networkOutbound: boolean;      // Disabled in zero-knowledge mode
    storageQuotaMB: number;        // Max 5MB volatile storage
  };
  capabilities: {
    multiplayer: boolean;          // Requires Yjs CRDT binding
    lendable: boolean;             // Can be projected into docked workspace
  };
}

```

---

## 3. The Tool Bazaar & Licensing Model

* **Open Standards:** Community tools are packaged as `.bbtool` archives (ZIP containing `manifest.json`, bundled assets, and cryptographic signature).
* **Pro Commercial Tools:** Verified Bazaar plugins require Ed25519 license validation against the commercial Nexus registry.
* **Lend-to-Earn Mechanics:** When User A lends a premium tool to User B during a session, User B is granted a single-session ephemeral trial. If User B purchases the tool within 24 hours, User A receives a 10% referral credit.

```

```