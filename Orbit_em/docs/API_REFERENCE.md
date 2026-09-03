# Orbit'em API & JSON Schema Reference

## JSON Schema Specification (`.orbit.json`)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "OrbitEmState",
  "type": "object",
  "required": ["version", "meta", "constraints", "submodules"],
  "properties": {
    "version": { "type": "string", "enum": ["1.0.0"] },
    "meta": {
      "type": "object",
      "required": ["brand", "app", "title", "archetype"],
      "properties": {
        "brand": { "type": "string", "enum": ["Blackboxes"] },
        "app": { "type": "string", "enum": ["Orbit'em"] },
        "title": { "type": "string" },
        "archetype": { "type": "string" }
      }
    },
    "constraints": {
      "type": "object",
      "required": ["monthlyBudget", "availabilitySla", "p99LatencyMs", "computeCapacity", "opsComplexity", "securityCompliance"],
      "properties": {
        "monthlyBudget": { "type": "number", "minimum": 50, "maximum": 50000 },
        "availabilitySla": { "type": "number", "minimum": 95.0, "maximum": 99.999 },
        "p99LatencyMs": { "type": "number", "minimum": 2, "maximum": 250 },
        "computeCapacity": { "type": "number", "minimum": 10, "maximum": 500 },
        "opsComplexity": { "type": "number", "minimum": 10, "maximum": 200 },
        "securityCompliance": { "type": "number", "minimum": 50, "maximum": 100 }
      }
    },
    "submodules": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["name", "category", "costShare"],
        "properties": {
          "name": { "type": "string" },
          "category": { "type": "string" },
          "costShare": { "type": "number" },
          "tier": { "type": "string" }
        }
      }
    }
  }
}
```
