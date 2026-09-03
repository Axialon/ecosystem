# Synth'em Architecture & Web Audio DSP Pipeline

## Web Audio API Polyphonic Architecture
- **Dual Detuned Oscillators**: Polyphonic voice allocation mixing sawtooth and square waves with detune offset ($1.005\times$).
- **Resonant Low-Pass Filter**: Biquad filter with configurable cutoff ($200\text{Hz} - 10000\text{Hz}$) and $Q=3.5$.
- **Spatial Envelope**: Dynamic attack and exponential release ramp tied to RT60 reverb decay.

## 3D WebGL Audio-Reactive Shader
- `IcosahedronGeometry(1.25, 2)` mesh with dynamic emissive pulsation responding to real-time RMS amplitude.
- Dual-sided glass transmission (`transmission: 0.70`, `side: THREE.DoubleSide`).
