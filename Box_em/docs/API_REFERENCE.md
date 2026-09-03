# Blackboxes • Box'em API & Protocol Reference

## 1. REST API Endpoints

The local development server (`server.js`) and production edge workers provide REST endpoints for programmatic AI Agent integration.

### `GET /api/professions`
Returns the complete list of 225 researched industry professions with metadata, benchmark rates, and scope deliverables.

**Response Example (`200 OK`)**:
```json
{
  "total": 225,
  "professions": [
    {
      "id": "fullstack_web",
      "category": "Software & Cloud Engineering",
      "title": "Full-Stack Web Architect",
      "badge": "FULLSTACK",
      "rate": 110,
      "time": 4.0,
      "cost": 8500,
      "qual": 88,
      "submodules": [
        { "id": "mod_1", "name": "Core React/Next Architecture", "reqQuality": 80 },
        { "id": "mod_2", "name": "Node/GraphQL Edge Services", "reqQuality": 85 },
        { "id": "mod_3", "name": "CI/CD & Kubernetes Pipeline", "reqQuality": 90 },
        { "id": "mod_4", "name": "Enterprise Security Hardening", "reqQuality": 95 }
      ]
    }
  ]
}
```

---

### `GET /api/model` (Alias: `/api/solve`)
Solves trade-offs and returns a fully compliant `.boxem.json` v1.0.0 model payload.

**Query Parameters**:
| Parameter | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| `occ` | string | `fullstack_web` | Profession identifier from 225 matrix. |
| `time` | float | Profession default | Timeline in weeks ($0.5 - 52.0$). |
| `cost` | integer | Profession default | Investment budget in USD ($500 - 1,000,000$). |
| `qual` | integer | Profession default | Quality craft percentage ($10 - 100$). |
| `scope` | integer | `100` | Scope completion percentage ($10 - 100$). |
| `lock` | string | `time` | Solving target: `time`, `cost`, `quality`, or `scope`. |
| `shader` | string | `classic` | Shading preset: `classic`, `kintsugi`, `liquid`, `quartz`, `emerald`, `sapphire`. |

**Response Example (`200 OK`)**:
```json
{
  "$schema": "https://blackboxes.engine/schema/v1.json",
  "version": "1.0.0",
  "meta": {
    "brand": "Blackboxes",
    "app": "Box'em",
    "title": "Full-Stack Web Architect Matrix",
    "occupation": "fullstack_web",
    "author": "AI Agent Protocol Solver",
    "generatedAt": "2026-08-25T06:30:00.000Z"
  },
  "constraints": {
    "timeWeeks": 4.0,
    "costBudget": 8500,
    "qualityPercent": 88,
    "scopePercent": 100,
    "lockMode": "time",
    "baseRate": 110
  },
  "submodules": [
    { "id": "mod_1", "name": "Core React/Next Architecture", "reqQuality": 80 },
    { "id": "mod_2", "name": "Node/GraphQL Edge Services", "reqQuality": 85 },
    { "id": "mod_3", "name": "CI/CD & Kubernetes Pipeline", "reqQuality": 90 },
    { "id": "mod_4", "name": "Enterprise Security Hardening", "reqQuality": 95 }
  ],
  "visuals": {
    "shaderPreset": "classic",
    "theme": "light",
    "modelUrl": "http://localhost:8080/models/clock_crystal.glb"
  }
}
```

---

## 2. `.boxem.json` Schema Specification (v1.0.0)

The full JSON schema is published at [`schemas/v1.schema.json`](../schemas/v1.schema.json).

### Required Top-Level Fields
* `version`: Must be semantic version string (e.g. `"1.0.0"`).
* `meta`: Contains `brand` (`"Blackboxes"`), `app` (`"Box'em"`), `title`, and `occupation`.
* `constraints`: Contains `timeWeeks`, `costBudget`, `qualityPercent`, `scopePercent`, and `lockMode`.
* `submodules`: Non-empty array of deliverables with `id`, `name`, and `reqQuality`.
