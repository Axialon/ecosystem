# Blackboxes Box'em - AI Agent Integration & Protocol Specification

This document details the exact protocol for AI Agents (Claude, ChatGPT, Antigravity, Gemini, LangChain, AutoGen, n8n) to programmatically interact with, configure, and extract 3D reciprocal constraint models from **Blackboxes Box'em**.

---

## 🤖 Direct REST API Endpoints

The local Box'em server provides programmatic endpoints:

### 1. `GET /api/model` (Solve & Return Configured 3D Matrix)
Generates the fully solved reciprocal constraint matrix in `.boxem.json` v1.0.0 format.

* **Example Query**:
  ```http
  GET /api/model?occ=fullstack_web&time=3.5&cost=12000&qual=92&scope=100&lock=time
  ```
* **Response Payload**:
  ```json
  {
    "$schema": "https://blackboxes.engine/schema/v1.json",
    "version": "1.0.0",
    "meta": {
      "brand": "Blackboxes",
      "app": "Box'em",
      "title": "Full-Stack Web Architect Matrix",
      "occupation": "fullstack_web",
      "author": "AI Agent Protocol",
      "generatedAt": "2026-08-25T15:42:00.000Z"
    },
    "constraints": {
      "timeWeeks": 3.5,
      "costBudget": 12000,
      "qualityPercent": 92,
      "scopePercent": 100,
      "lockMode": "time",
      "baseRate": 110
    },
    "submodules": [
      { "id": "mod_1", "name": "Core Backend Architecture & APIs", "reqQuality": 80 },
      { "id": "mod_2", "name": "Dynamic Responsive Frontend Client", "reqQuality": 75 },
      { "id": "mod_3", "name": "Automated CI/CD & Cloud Infrastructure", "reqQuality": 85 },
      { "id": "mod_4", "name": "Full Unit & Integration Test Suite", "reqQuality": 90 }
    ],
    "visuals": {
      "shaderPreset": "classic",
      "theme": "light",
      "modelUrl": "http://localhost:8080/models/clock_crystal.glb"
    }
  }
  ```

### 2. `GET /api/professions` (List 225 Researched Profiles)
Returns all 225 industry professions with market rates, baseline timelines, budgets, and milestone deliverables.

---

## 📦 3D Binary GLB Export with Embedded Metadata
When Box'em exports a `.glb` WebXR model, the complete `.boxem.json` configuration is baked directly into the glTF root `asset.extras.boxem` block:

```json
{
  "asset": {
    "version": "2.0",
    "generator": "THREE.GLTFExporter",
    "extras": {
      "boxemConfig": {
        "version": "1.0.0",
        "meta": { "brand": "Blackboxes", "app": "Box'em", "occupation": "fullstack_web" },
        "constraints": { "timeWeeks": 4.0, "costBudget": 8500, "qualityPercent": 88, "scopePercent": 100 }
      }
    }
  }
}
```

Any 3D pipeline (Blender, Unreal Engine, Unity, WebXR runtime, or AI agent) can parse `extras.boxemConfig` directly from the binary file.
