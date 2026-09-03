# Cap'em API Reference & Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "CapEmState",
  "type": "object",
  "required": ["version", "meta", "constraints", "submodules"],
  "properties": {
    "version": { "type": "string", "enum": ["1.0.0"] },
    "meta": { "type": "object" },
    "constraints": {
      "type": "object",
      "required": ["capitalRaisedUsd", "postMoneyValuationUsd", "runwayMonths", "founderEquityPercent", "esopPoolPercent"]
    },
    "submodules": { "type": "array" }
  }
}
```
