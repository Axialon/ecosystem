# Contributing to Orbit'em

We welcome contributions to Orbit'em! 

## Development Guidelines
1. **Zero Build Requirement**: All client code must run standalone in modern browsers without compilation steps.
2. **Deterministic Mathematical Solvers**: Any updates to reciprocal constraint calculations must not produce NaN, Infinity, or memory leaks.
3. **9-Persona Compliance**: All PRs must adhere to the 9-Persona Quality Standards (WebGL architecture, UX accessibility, security, quantitative verification, devsecops).

## Adding New Cloud Archetypes
To contribute a new cloud topology archetype, edit `src/data/cloud_archetypes.js` and submit a PR with screenshot verification.
