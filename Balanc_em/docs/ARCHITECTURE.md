# Balanc'em Architecture & Combat Balancing Pipeline

## Combat Balance Equilibrium Formula
$$\text{Balance Ratio} = \frac{(\frac{\text{DPS}}{500.0}) \cdot (\frac{\text{EHP}}{10000.0})}{(\frac{\text{Resource Cost}}{50.0}) \cdot (\frac{\text{APM}}{100.0})}$$

- **Overpowered**: $\text{Ratio} > 1.6$
- **Balanced**: $0.6 \le \text{Ratio} \le 1.6$
- **Underpowered**: $\text{Ratio} < 0.6$

## 3D WebGL Pipeline
- **Combat Polytope**: `OctahedronGeometry(1.25)` in Damascus flame material (`transmission: 0.60`, `side: THREE.DoubleSide`).
- **Ability Gems**: Raycasted micro-crystals with expanded hit spheres for interactive combat ability inspection.
