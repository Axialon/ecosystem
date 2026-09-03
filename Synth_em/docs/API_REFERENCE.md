# Synth'em API Reference & Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "SynthEmState",
  "type": "object",
  "required": ["version", "meta", "constraints", "submodules"],
  "properties": {
    "version": { "type": "string", "enum": ["1.0.0"] },
    "meta": { "type": "object" },
    "constraints": {
      "type": "object",
      "required": ["harmonicDrivePercent", "dynamicCrestDb", "pitchRatio", "reverbDecaySec", "filterCutoffHz", "stereoWidthPercent"]
    },
    "submodules": { "type": "array" }
  }
}
```
