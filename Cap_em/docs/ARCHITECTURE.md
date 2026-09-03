# Cap'em Architecture & Valuation Pipeline

## Cap Table Dilution Mathematics
$$\text{Investor Dilution \%} = \frac{\text{Capital Raised}}{\max(\text{Capital Raised}, \text{Post-Money Valuation})} \cdot 100$$
$$\text{Founder Equity \%} = \max(10, 100 - \text{Investor Dilution} - \text{ESOP Pool})$$

## 3D WebGL Pipeline
- **Treasury Core**: `DodecahedronGeometry(1.25)` rendered in physical gold material (`transmission: 0.60`, `side: THREE.DoubleSide`).
- **Stakeholder Cubes**: High-contrast stakeholder blocks with procedural canvas text badges.
- **Venture Submodules**: Raycast-enabled SAFE / ESOP / Option pool gems.
