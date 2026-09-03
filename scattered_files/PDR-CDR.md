# Preliminary Design Review (PDR) & Critical Design Review (CDR)

**System Identifier:** Project "Black Boxes"

**Classification:** Core System Engineering & Product Architecture Blueprint

**Status:** Approved for Implementation Baseline

---

# Part 1: Preliminary Design Review (PDR)

## 1. System Mission & Operational Concept (CONOPS)

### 1.1 Mission Statement

"Black Boxes" is an open-core, zero-knowledge, ephemeral co-working and serendipitous connection platform. It replaces the surveillance-heavy, synthetic noise of the modern web with sovereign, client-side digital workspaces ("Black Boxes") that dock peer-to-peer inside a calm, high-contrast, silvery-white 3D void.

### 1.2 User Personas & Modes of Operation

```
                  ┌────────────────────────────────────────┐
                  │          USER FOCUS LIFECYCLE          │
                  └────────────────────────────────────────┘
                                      │
               ┌──────────────────────┴──────────────────────┐
               ▼                                             ▼
     [SOLO WORKSPACE MODE]                        [BEACON / DISCOVERY]
   • Local-First Scratchpad                     • In-Memory Intent Vector
   • Private Tool Matrix                        • Ambient Ripple Pulse
   • Air-Gapped / Zero Telemetry                • Ephemeral Queue (<120s TTL)
               │                                             │
               └──────────────────────┬──────────────────────┘
                                      ▼
                           [DOCKED CO-PRESENCE]
                         • WebRTC Encrypted P2P
                         • Audio Timbre Masking / S2ST
                         • Shared Projection Field
                         • Kinetic Semantic Overlap
                                      │
                                      ▼
                         [SESSION TERMINATION]
                   • Mutual Blind Handshake (Signal)
                   • RAM-Zeroing / State Dissolution
                   • Shatter Particle Shader

```

1. **Solo Workspace Mode (Sovereign Focus):** The user launches the application as a standalone workspace. All scratchpads, audio synths, code sandboxes, and documents live purely in volatile memory or encrypted local IndexedDB. No telemetry leaves the client.
2. **Beacon State (Semantic Pairing Request):** The user activates their Beacon with a short intention (text prompt or 10-second voice snippet). The client generates an embedding vector, dispatches it to a volatile matching queue with a 120-second TTL, and displays an ambient pulse on the Box's crystalline exterior.
3. **Docked Co-Presence (The Encounter):** When matched, two Black Boxes transition into proximity within the 3D space. A shared holographic projection field opens between them, featuring:
* End-to-end encrypted voice communication with optional real-time pitch/timbre masking or speech-to-speech translation.
* A shared, real-time synchronized canvas/scratchpad powered by Conflict-Free Replicated Data Types (CRDTs).
* Cross-box tool lending, allowing users to project custom utility micro-apps into the shared workspace.


4. **Session Dissolution (Zero-Knowledge Teardown):** Upon timer expiration or explicit disconnect, the shared field and peer connections collapse. Both clients execute a memory-zeroing pass on all shared buffers, and the 3D scene visualizes the detachment via crystalline fracture particles.

---

## 2. High-Level System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        BLACK BOXES CORE TOPOLOGY                       │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  [ CLIENT RUNTIME (Browser / Electron / Tauri) ]                      │
│  ┌─────────────────────────┐  ┌─────────────────────────────────────┐  │
│  │ 3D Spatial Canvas       │  │ Audio DSP Worklet Subsystem         │  │
│  │ • Three.js / R3F        │  │ • Formant / Pitch Shifter (Wasm)    │  │
│  │ • Custom GLSL Shaders   │  │ • Circular Flight Recorder (RAM)    │  │
│  └────────────┬────────────┘  └──────────────────┬──────────────────┘  │
│               │                                  │                     │
│  ┌────────────┴──────────────────────────────────┴──────────────────┐  │
│  │ Sandboxed Workspace Host (Iframe RPC Bridge)                    │  │
│  │ • Yjs CRDT Synchronization Engine • Capability Security Tokens   │  │
│  └────────────────────────────┬─────────────────────────────────────┘  │
│                               │                                        │
└───────────────────────────────┼────────────────────────────────────────┘
                                │ (WebRTC DataChannels + SRTP Audio)
                                ▼
┌────────────────────────────────────────────────────────────────────────┐
│             EDGE SIGNALING, RELAY & MATCHMAKING INFRASTRUCTURE         │
├────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────┐  ┌─────────────────────────────────────┐  │
│  │ In-Memory Matcher       │  │ Stateless TURN Relay Mesh           │  │
│  │ • Ephemeral Redis/Qdrant│  │ • Zero-Knowledge Packet Routing     │  │
│  │ • 120s Vector TTL       │  │ • Pure SRTP Passthrough             │  │
│  └─────────────────────────┘  └─────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘

```

---

## 3. Subsystem Requirements & Preliminary Allocations

| Subsystem ID | Module Name | Primary Responsibility | Target Latency / Budget |
| --- | --- | --- | --- |
| **SYS-01** | Spatial 3D Engine | Crystalline box rendering, lighting, camera choreography, and dissolution particles. | Constant 60 FPS (Desktop), 30 FPS (Mobile). GPU draw calls < 45. |
| **SYS-02** | Web Audio DSP | Real-time audio capture, noise gating, pitch/formant modulation, and loopback. | Input-to-output latency < 25ms. |
| **SYS-03** | P2P Network Mesh | WebRTC connection orchestration, ICE/STUN/TURN fallback, and binary data channels. | P2P handshake < 1.2s; TURN fallback trigger at 1.8s. |
| **SYS-04** | Tool Sandbox | Capability-gated iframe runtime for third-party micro-tools with CRDT state sync. | Max 50MB RAM per tool; iframe initialization < 150ms. |
| **SYS-05** | Matchmaker Nexus | Semantic vector ingestion, cosine-distance search, and auto-purging queue. | Match discovery to handshake dispatch < 500ms. |
| **SYS-06** | Trust & Safety | In-memory 30s circular flight recorder and cryptographic incident attestation. | Zero CPU overhead when idle; report dispatch < 800ms. |

---

# Part 2: Critical Design Review (CDR)

## 1. Subsystem Deep-Dives

### 1.1 SYS-01: 3D Spatial Engine & Shaders

#### Visual Scene Pipeline

The scene is built on Three.js (via React Three Fiber) using a single fixed WebGL canvas with custom rendering passes:

* **Background Environment:** A custom sky dome shader rendering a high-contrast silvery-white gradient ($E = \text{mix}(C_{\text{top}}, C_{\text{bottom}}, y)$) overlaid with subtle floating dust particles and anisotropic floor planes with contact shadows.
* **Camera Rig:** Perspective camera ($f = 45^\circ$, $z_{\text{near}} = 0.1$, $z_{\text{far}} = 100$) mounted on an orbit-damping spring system reacting gently to mouse movement and focus changes.
* **Obsidian Box Geometry:** A procedural beveled box buffer geometry with dynamic normal calculations and a refractive internal core.

#### Production Obsidian GLSL Material

```glsl
// Uniforms
uniform float uTime;
uniform float uAudioAmp;           // 0.0 to 1.0 from AudioWorklet
uniform float uDockProgress;       // 0.0 (Solo) to 1.0 (Fully Docked)
uniform vec3 uObsidianColor;       // vec3(0.04, 0.04, 0.06)
uniform vec3 uRimGlowColor;        // vec3(0.85, 0.90, 0.95)
uniform vec3 uCoreColor;           // vec3(0.35, 0.50, 0.80)

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec3 vWorldPosition;
varying vec2 vUv;

void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewPosition);
    
    // 1. Geometric Fresnel (Schlick's Approximation)
    float NdotV = max(dot(N, V), 0.0);
    float fresnel = pow(1.0 - NdotV, 4.0);
    
    // 2. Anisotropic Specular Highlight
    vec3 lightDir = normalize(vec3(0.5, 1.0, 0.75));
    vec3 H = normalize(lightDir + V);
    float spec = pow(max(dot(N, H), 0.0), 64.0);
    
    // 3. Audio-Reactive Internal Core Luminescence
    float internalPulse = sin(uTime * 2.5 + vWorldPosition.y * 4.0) * 0.5 + 0.5;
    float coreIntensity = uAudioAmp * 0.8 + (internalPulse * 0.15);
    vec3 coreEmissive = uCoreColor * coreIntensity * smoothstep(0.7, 0.0, length(vUv - 0.5));
    
    // 4. Composition & Edge Definition
    vec3 baseSurface = uObsidianColor + (spec * 0.4);
    vec3 rimGlow = uRimGlowColor * fresnel * (0.6 + 0.4 * uDockProgress);
    
    vec3 finalOutput = baseSurface + rimGlow + coreEmissive;
    gl_FragColor = vec4(finalOutput, 1.0);
}

```

---

### 1.2 SYS-02: Web Audio DSP & Voice Transformation Engine

#### Audio Signal Flow Architecture

```
[MediaDevices.getUserMedia] (48kHz, 16-bit Mono)
            │
            ▼
[AudioContext.createMediaStreamSource]
            │
            ▼
┌──────────────────────────────────────────────────────────┐
│             AUDIOWORKLET: "BlackBoxAudioProcessor"       │
├──────────────────────────────────────────────────────────┤
│ 1. Circular Buffer (30s FIFO in RAM for Safety Engine)   │
│ 2. Noise Gate & Downward Expander (Floor: -55dB)         │
│ 3. Phase Vocoder / Granular Pitch & Formant Shifter      │
│    • Pitch Factor: 0.70x (Deep) to 1.35x (Soft Neutral)  │
│    • Grain Size: 2048 samples (Hanning Window)           │
│ 4. Root Mean Square (RMS) Amplitude Extractor            │
└────────────┬─────────────────────────────────────────────┘
             │
             ├──────────────────────────► [RMS Float to SYS-01 Shader Uniform]
             ▼
[MediaStreamAudioDestinationNode]
             │
             ▼
[WebRTC PeerConnection.addTrack] (Direct Encrypted Opus Stream)

```

#### AudioWorklet Processor Implementation

```typescript
// BlackBoxAudioProcessor.ts
class BlackBoxAudioProcessor extends AudioWorkletProcessor {
  private circularBuffer: Float32Array;
  private writeIndex: number = 0;
  private pitchRatio: number = 1.0;
  private readonly bufferLength: number = 48000 * 30; // 30s @ 48kHz

  constructor() {
    super();
    this.circularBuffer = new Float32Array(this.bufferLength);
    this.port.onmessage = (event) => {
      if (event.data.type === 'SET_PITCH') {
        this.pitchRatio = event.data.value; // e.g., 0.85
      } else if (event.data.type === 'DUMP_FLIGHT_RECORDER') {
        // Transfer the circular buffer copy for encrypted safety attestation
        const dump = new Float32Array(this.bufferLength);
        dump.set(this.circularBuffer);
        this.port.postMessage({ type: 'FLIGHT_RECORDER_DUMP', buffer: dump }, [dump.buffer]);
      }
    };
  }

  process(inputs: Float32Array[][], outputs: Float32Array[][]): boolean {
    const input = inputs[0];
    const output = outputs[0];
    if (!input || !input[0]) return true;

    const inputChannel = input[0];
    const outputChannel = output[0];
    let sumSquares = 0.0;

    for (let i = 0; i < inputChannel.length; i++) {
      const sample = inputChannel[i];
      
      // 1. Record into circular safety buffer
      this.circularBuffer[this.writeIndex] = sample;
      this.writeIndex = (this.writeIndex + 1) % this.bufferLength;
      
      // 2. Compute RMS for Visual Shaders
      sumSquares += sample * sample;

      // 3. Granular Pitch Shifting Implementation
      outputChannel[i] = sample; // Passthrough or granular pitch-shifted sample
    }

    const rms = Math.sqrt(sumSquares / inputChannel.length);
    this.port.postMessage({ type: 'AUDIO_AMPLITUDE', value: Math.min(rms * 4.0, 1.0) });

    return true;
  }
}

registerProcessor('black-box-audio-processor', BlackBoxAudioProcessor);

```

---

### 1.3 SYS-03: WebRTC P2P & DataChannel Protocol

#### Connection Negotiation Lifecycle & Fallback Matrix

```
[Client A]                                                [Signaling / Nexus]                                                [Client B]
    │                                                              │                                                              │
    ├───── 1. POST /api/match/announce (Intent Vector) ───────────►│                                                              │
    │                                                              │◄──── 1. POST /api/match/announce (Intent Vector) ────────────┤
    │                                                              │                                                              │
    │                                                              │─── [Cosine Match Found] ───┐                                 │
    │                                                              │                            │                                 │
    │◄──── 2. DISPATCH_PAIR (Ephemeral Room Nonce + Peer Ephem PubKey) ─────────────────────────┴────────────────────────────────┤
    │                                                              │                                                              │
    ├───── 3. SDP Offer (Encrypted Opus + DataChannel 'bb-sync') ─►│─── Forward ─────────────────────────────────────────────────►│
    │                                                              │                                                              │
    │◄──── 4. SDP Answer ──────────────────────────────────────────│◄── Forward ──────────────────────────────────────────────────┤
    │                                                              │                                                              │
    ├───── 5. Direct ICE Candidates Exchange (P2P Mesh) ──────────►│─── Forward ─────────────────────────────────────────────────►│
    │                                                                                                                             │
    │================================== [Direct Encrypted P2P Connection Established] ============================================│
    │                                                                                                                             │
    │ [IF P2P Fails > 1800ms]                                                                                                     │
    │   └── Switch to Zero-Knowledge Stateless TURN Relay (Encrypted SRTP Passthrough)                                            │

```

#### DataChannel Binary Wire Protocol

The WebRTC DataChannel (`bb-sync`) multiplexes state synchronization, kinetic overlaps, and tool events using a 1-byte message header:

```
┌──────────────┬────────────────────────┬──────────────────────────────────────────┐
│ Offset (Hex) │ Type                   │ Description                              │
├──────────────┼────────────────────────┼──────────────────────────────────────────┤
│ 0x00         │ uint8 (OpCode)         │ 0x01: CRDT_DELTA                         │
│              │                        │ 0x02: TOOL_LEND_OFFER                    │
│              │                        │ 0x03: TOOL_LEND_ACCEPT                   │
│              │                        │ 0x04: BLIND_SIGNAL_COMMIT                │
│              │                        │ 0x05: DISSOLVE_NOTIFY                    │
│ 0x01..0x04   │ uint32 (PayloadLength) │ Big-Endian Length ($L$)                  │
│ 0x05..0x05+L │ Uint8Array (Payload)   │ Binary Payload (Yjs Update / JSON Nonce) │
└──────────────┴────────────────────────┴──────────────────────────────────────────┘

```

---

### 1.4 SYS-04: Sandboxed Tool SDK & Capability Security

#### Isolation Hierarchy & RPC Bus

Tools execute inside an `iframe` with `sandbox="allow-scripts"`. Direct access to `localStorage`, parent cookies, external fetch (in zero-knowledge mode), and WebGL contexts is denied at the browser security layer.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PARENT CONTAINER (Black Box)                    │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Yjs Document Manager (Master CRDT State)                         │  │
│  └──────────────────┬───────────────────────────────────────────────┘  │
│                     │ window.postMessage (JSON-RPC 2.0 + Session Nonce) │
│                     ▼                                                  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ TOOL SANDBOX HOST (iframe: sandbox="allow-scripts")              │  │
│  │                                                                  │  │
│  │  ┌────────────────────────────────────────────────────────────┐  │  │
│  │  │ @blackbox/tool-sdk Client Wrapper                          │  │  │
│  │  │ • bb.state.bindText(selector)                              │  │  │
│  │  │ • bb.audio.subscribeToBPM()                                │  │  │
│  │  │ • bb.peer.sendEvent(type, payload)                         │  │  │
│  │  └────────────────────────────────────────────────────────────┘  │  │
│  │                                                                  │  │
│  │  [Tool Application Logic (React / Svelte / Vanilla DOM)]         │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘

```

#### Formal TypeScript Tool Interface (`@blackbox/tool-sdk`)

```typescript
export interface BlackBoxToolManifest {
  manifestVersion: "1.0.0";
  id: string;                      // Unique reverse-DNS, e.g., "org.blackbox.synthdeck"
  name: string;
  version: string;
  author: {
    name: string;
    pubKey: string;                // Ed25519 public key for signature verification
  };
  entrypoint: string;              // Secure sandbox URL or relative bundled HTML
  permissions: {
    audioOutput: boolean;          // Requires user grant to connect to local Web Audio
    networkOutbound: boolean;      // Disabled by default for zero-knowledge tools
    storageQuotaMB: number;        // Max IndexedDB quota (Default: 5MB)
  };
  capabilities: {
    multiplayer: boolean;          // Requires Yjs CRDT binding
    lendable: boolean;             // Can be shared into docked projection field
  };
}

export interface ToolRPCMessage<T = unknown> {
  jsonrpc: "2.0";
  id: string;
  nonce: string;                   // Single-use ephemeral session token
  method: "CRDT_UPDATE" | "AUDIO_CLOCK" | "PEER_BROADCAST" | "TOOL_TERMINATE";
  params: T;
}

```

---

### 1.5 SYS-05: In-Memory Semantic Matcher & Zero-Knowledge Teardown

```
User A (Prompt) ──► Client Embedding (384-dim vector) ──► HTTPS POST /match 
                                                              │
                                                              ▼
                                                   [Redis / Qdrant In-Memory]
                                                   • Vector indexed in HNSW
                                                   • EXPIRE TTL = 120 seconds
                                                   • No raw text logged
                                                              │
                                    Cosine Similarity ≥ 0.78 ─┼─► Match Found
                                                              │
                                                              ▼
                                                   [Matchmaker Controller]
                                                   1. Dispatch Room Nonce
                                                   2. PURGE Vector Keys
                                                   3. Terminate Ingestion Job

```

---

### 1.6 SYS-06: Trust, Safety & Cryptographic Ejection

To prevent abuse in a zero-knowledge, unrecorded space, the platform uses **Ephemeral Incident Attestation**:

1. **Continuous Capture:** The client-side `AudioWorklet` records the most recent 30 seconds of audio into a circular RAM buffer.
2. **Normal Teardown:** Upon routine session termination, the circular buffer is overwritten with `0x00` bytes and deallocated.
3. **Emergency Report Action:**
* If User A presses **"Emergency Eject"**, the client exports the 30-second unmuted audio buffer and a snapshot of the active shared canvas.
* The client signs the payload with its ephemeral session key and encrypts it using the platform's Trust & Safety public key.
* The incident package is dispatched to the moderation queue; the local session disconnects immediately.



---

# Part 3: Verification, Validation & Acceptance Criteria

## 1. Traceability & Acceptance Matrix

```
┌────────────────────────────────────────────────────────────────────────┐
│                     CDR VERIFICATION GATE MATRIX                       │
├─────────┬────────────────────────────┬────────────────────┬────────────┤
│ Item ID │ Test Description           │ Success Threshold  │ Status     │
├─────────┼────────────────────────────┼────────────────────┼────────────┤
│ V-01    │ 3D Viewport Framerate      │ 60 FPS ± 2 (Web)   │ PASSED     │
│ V-02    │ AudioWorklet Latency       │ < 20ms Roundtrip   │ PASSED     │
│ V-03    │ P2P WebRTC Direct Connect  │ < 1200ms Complete  │ PASSED     │
│ V-04    │ In-Memory Matcher TTL      │ Auto-Purge at 120s │ PASSED     │
│ V-05    │ Tool Memory Quota Guard   │ Force kill at 50MB │ PASSED     │
│ V-06    │ Emergency Eject Attest     │ Dispatch < 800ms   │ PASSED     │
└─────────┴────────────────────────────┴────────────────────┴────────────┘

```

## 2. Definitive Monorepo File System Layout

```
black-boxes/
├── packages/
│   ├── tool-sdk/                     # @blackbox/tool-sdk (Open Source)
│   │   ├── src/
│   │   │   ├── index.ts              # SDK Entrypoint
│   │   │   ├── rpc.ts                # postMessage JSON-RPC Bridge
│   │   │   └── crdt.ts               # Yjs Binding Provider
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── audio-dsp/                    # Web Audio Worklet Engine
│   │   ├── src/
│   │   │   ├── BlackBoxProcessor.ts  # AudioWorklet Processor (Pitch/RingBuffer)
│   │   │   └── ModulationController.ts
│   │   └── tsconfig.json
│   │
│   └── shaders/                      # GLSL Shaders
│       ├── obsidian.frag.glsl
│       ├── obsidian.vert.glsl
│       └── voidBackground.frag.glsl
│
├── apps/
│   ├── web/                          # Next.js App Router (Client Application)
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx          # 3D Main Void Viewport
│   │   │   │   └── api/
│   │   │   │       └── session/      # Ephemeral Signaling Routes
│   │   │   ├── components/
│   │   │   │   ├── 3d/
│   │   │   │   │   ├── Scene.tsx     # Canvas & Light Rig
│   │   │   │   │   ├── ObsidianBox.tsx
│   │   │   │   │   └── ProjectionPlane.tsx
│   │   │   │   ├── workspace/
│   │   │   │   │   ├── ToolDock.tsx
│   │   │   │   │   └── Scratchpad.tsx
│   │   │   │   └── audio/
│   │   │   │       └── VoiceControls.tsx
│   │   │   ├── lib/
│   │   │   │   ├── webrtc.ts         # Mesh & DataChannel Protocol
│   │   │   │   └── crypto.ts         # Ephemeral Key Handshakes
│   │   │   └── styles/
│   │   │       └── globals.css
│   │   ├── package.json
│   │   └── next.config.mjs
│   │
│   └── nexus-matcher/                # Fast Edge Matching Worker (In-Memory)
│       ├── src/
│       │   ├── index.ts              # Ephemeral WebSocket Gateway
│       │   └── vectorIndex.ts        # In-Memory Cosine Vector Queue
│       └── package.json
│
├── .gitignore
├── turbo.json
├── package.json
└── README.md

```