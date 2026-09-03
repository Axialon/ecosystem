# Synth'em: 3D Spatial Audio Granular Synth & Generative Studio

## 1. Product Vision & Value Proposition

**Synth'em** is a browser-native 3D spatial audio synthesizer, generative soundscape engine, and psychoacoustic constraint studio built for music producers, game audio designers, film composers, and creative coders.

Traditional digital audio workstations (DAWs) and VST synthesizers are cluttered with flat 2D knob matrices and skeuomorphic dials that obscure multi-dimensional acoustic interactions. In sound design, adjusting frequency pitch directly impacts granular grain density; increasing reverberant diffusion washes out transient punch; boosting harmonic drive alters dynamic crest factor.

Synth'em couples in-browser **AudioWorklet DSP** directly to Box'em's **3D Spatial Obsidian Reactor**, allowing producers to sculpt and balance sound across four acoustic dimensions in real time: **Harmonic Timbre & Drive ($N_H$)**, **Dynamic Range & Crest Factor ($N_D$)**, **Granular Pitch & Time-Stretching ($N_P$)**, and **Spatial Reverb Diffusion & Stereophony ($N_S$)**.

```
                   [ HARMONIC TIMBRE & DRIVE (NH) ]
                                  ▲
                                 / \
                                /   \
                               /     \
                              /   K   \
                             /         \
   [ DYNAMIC CREST FACTOR (ND) ] ◄┼───────┼► [ GRANULAR PITCH / GRAINS (NP) ]
                               \         /
                                \       /
                                 \     /
                                  \   /
                                    ▼
                    [ SPATIAL REVERB DIFFUSION (NS) ]
```

---

## 2. Psychoacoustic Equilibrium & AudioWorklet Engine

Synth'em unites acoustic physics with Box'em's reciprocal solver:

$$N_{\text{Harmonics}} \cdot N_{\text{Dynamics}} = K_{\text{Audio}} \cdot N_{\text{GranularPitch}} \cdot N_{\text{SpatialDiffusion}}$$

### DSP Signal Flow Architecture:
Synth'em directly implements the `BlackBoxAudioProcessor` AudioWorklet from the Black Boxes core specifications:

```
[ In-Browser Synthesizer / Mic / Stems ]
                 │
                 ▼
 ┌──────────────────────────────────────────────────────────┐
 │           AUDIOWORKLET: "SynthEmAudioProcessor"          │
 ├──────────────────────────────────────────────────────────┤
 │ 1. Granular Pitch Shifter (Hanning window, 2048 samples) │
 │ 2. Phase Vocoder & Formant Modulator (0.7x – 1.35x)      │
 │ 3. Dynamic Crest Factor Waveshaper (Soft-clip overdrive) │
 │ 4. Convolution Reverb & Spatial HRTF 3D Panner Node      │
 │ 5. Root Mean Square (RMS) & FFT Frequency Extractor      │
 └────────────────────────────┬─────────────────────────────┘
                              │
                              ├──────────────────────────► [uAudioAmp / Live FFT Uniforms]
                              ▼
                [ WebGL Obsidian 3D Reactor ]
```

### Parameter Normalization:
- **Harmonic Timbre & Saturation ($N_H$):**
  $$N_H = \max\left(0.001, \frac{\text{Total Harmonic Distortion (THD\%)} \cdot \text{Drive Index}}{50.0}\right)$$
- **Dynamic Crest Factor ($N_D$):**
  $$N_D = \max\left(0.001, \frac{\text{Peak dBFS} - \text{RMS dBFS}}{18.0}\right)$$
- **Granular Pitch & Grain Density ($N_P$):**
  $$N_P = \max\left(0.001, \frac{\text{Grain Rate (Hz)} \cdot \text{Pitch Factor}}{120.0 \cdot 1.0}\right)$$
- **Spatial Reverb Diffusion ($N_S$):**
  $$N_S = \max\left(0.001, \frac{\text{RT60 Decay in Seconds} \cdot \text{Stereo Spread \%}}{6.0 \cdot 100.0}\right)$$

---

## 3. 3D Spatial Audio-Reactive Visuals & Shader Matrix

Synth'em elevates Box'em's shaders into live, audio-reactive resonators:

| Box'em Technical Element | Synth'em Implementation & Visual Mapping |
| :--- | :--- |
| **Central Obsidian Reactor Core** | **Audio-Reactive Resonator Core**. Vertex displacements dynamically vibrate with the live AudioWorklet FFT spectrum, while internal luminescence pulses with RMS amplitude (`uAudioAmp`). |
| **Pillar Node 1 (Time / Clock Crystal)** | **Pitch & Time Node**: 3D Tuning Fork / Frequency Crystal (`#0284c7` Sky Blue). |
| **Pillar Node 2 (Cost / Coin Gem)** | **Dynamics Node**: 3D VCA Compressor Monolith (`#059669` Emerald Green). |
| **Pillar Node 3 (Quality / Diamond Core)**| **Timbre Node**: 3D Harmonic Overtone Core (`#7c3aed` Violet). |
| **Pillar Node 4 (Scope / Cube Matrix)** | **Space Node**: 3D Acoustic Diffusion Chamber (`#d97706` Amber). |
| **Internal Milestone Gems** | **Sound FX & Granular Grains**: Floating 3D crystals representing Grain Cloud, Bitcrush, Tape Flutter, Plate Reverb, Chorus, and Sub-Bass Generator. |
| **Crystalline Shader Presets** | • `neonvapor` (Cyberpunk Neon Vapor): High-energy synthwave overdrive & distortion.<br>• `nebula` (Celestial Nebula): Ambient dreamscape & shimmer reverb.<br>• `abyssal` (Abyssal Bioluminescent): Deep sub-bass meditation & binaural beats.<br>• `voidsingularity` (Quantum Void): Drone ambient & granular time-freeze. |
| **CanvasTexture 3D Billboards** | Real-time Frequency (Hz), Grain Size (ms), Reverb RT60 (s), and Crest Factor (dB) hovering in 3D. |

---

## 4. 160+ Sound Design & Music Production Matrix

Synth'em comes pre-loaded with comprehensive audio archetype presets:

1. **Cyberpunk Bassline (Reese / Acid):** Heavy even harmonics, fast grain rate, tight dry dynamics ($N_H = 85\%$, $N_S = 15\%$).
2. **Ambient Shimmer Cathedral:** Infinite RT60 reverb, pitch-shifted octave grains, wide stereo diffusion ($N_S = 98\%$, $N_P = 80\%$).
3. **Lo-Fi Tape Chillhop:** Subdued harmonics, gentle tape flutter, warm transient compression ($N_D = 45\%$, $N_H = 35\%$).
4. **Cinematic Sci-Fi Drone:** Granular cloud freezing, slow LFO filter sweeps, sub-harmonic rumble ($N_S = 90\%$, $N_P = 95\%$).
5. **Hyperpop Granular Vocal Chopper:** Extreme formant shifting, pitch quantizing, crisp transient punch ($N_P = 120\%$, $N_D = 75\%$).
6. **Binaural Meditation Waves (432Hz):** Theta-wave frequency modulation, ultra-clean harmonic purity, surround HRTF field ($N_H = 10\%$, $N_S = 85\%$).
7. **Modular Synth Generative Euclidean Beat:** Algorithmic polyrhythms, dynamic filter modulation, analog warmth ($N_D = 85\%$, $N_H = 65\%$).

---

## 5. Multi-Format Audio & Visual Export Suite

1. **Lossless 24-bit 48kHz `.wav` Recording:** Client-side Web Audio rendering and instant high-res stem export.
2. **Standardized `.synthem.json` Patch Schema:** Validated JSON preset format containing DSP parameters, filter coefficients, and 3D visual theme bindings.
3. **MIDI File & CC Mapping Export:** Exports standard `.mid` automation curves and CC controller mappings.
4. **Standalone 3D WebXR Audio Experience (`.glb`):** Binary 3D asset with embedded audio loops playable directly in Apple Vision Pro and Meta Quest.
5. **1-Click Responsive Audio Visualizer `<iframe>`:** Embeddable audio-reactive 3D player for Bandcamp liner notes, personal producer portfolios, and Spotify Canvas.
6. **AI Sound Designer REST API:** `GET /api/synth-model?genre=ambient&mood=dark&bpm=120` returns playable DSP patch configs.

---

## 6. Voluntary Backer & Open Sound Economy

Synth'em is **100% free and open-source under MIT**, freeing artists from expensive VST plugin licensing locks ($200–$600 per synth):

### Voluntary Sponsorship Tiers:
- **Tier 1: Sound Sculptor ($5+)**
  - Unlocks 3 backer shaders (*Neon Vapor Cyberpunk, Abyssal Sub-Bass, Supernova Drive*).
  - Unlocks curated community sample packs and impulse response (IR) convolution reverb spaces.
- **Tier 2: Master Producer Guild ($25+)**
  - Unlocks all 8 backer shaders (*Damascus Metallic, Opaline Prism, Void Singularity*).
  - Permanent listing on the live Cloudflare D1 Audio Patron Wall in the 3D viewport.
  - Unlimited custom GLTF synthesizer chassis models and custom brand watermarks.

### Edge Infrastructure:
- **Cloudflare Worker + D1 SQL:** Handles instantaneous webhook attestation with HMAC SHA-256 signatures from GitHub Sponsors, Open Collective, and Stripe.
- **Interactive 3D Soundwave Hologram:** The donation modal features an interactive 3D Audio Crystal that pulses and resonates to user-generated harmonic chords.

---

## 7. High Shareability & Viral Loops

1. **"Share Your 3D Sound Patch" URL Hash:** Producers share instant URLs (e.g. `synth.studio/#preset=hyperpop_lead&pitch=1.25&reverb=0.8`) allowing anyone to open the synth and play it live in their browser with zero install.
2. **TikTok / Instagram Reels Audio-Reactive Captures:** 1-click generation of 9:16 vertical WebGL visualizer videos synced to the played audio.
3. **Bandcamp / SoundCloud Embedded 3D Player:** Artists embed an interactive 3D crystal player into their album launch websites where listeners can manipulate the track's spatial reverb in real time.
4. **Reddit r/Synthesizers & r/SoundDesign Presets:** 1-click Markdown preset exports with playable browser links.
