# Balanc'em: 3D Game Mechanics, RPG Economy & Combat Balancing Engine

## 1. Product Vision & Value Proposition

**Balanc'em** is an interactive, real-time 3D spatial game balancing engine and economy simulator built for indie game developers, RPG designers, competitive combat designers, and game system architects.

Game balance is an intricate multi-dimensional problem where tweaking a single number creates cascading chaos: buffing DPS without adjusting cooldowns turns combat into a spam meta; reducing stamina costs breaks the defensive parry loop; inflating gold drop rates wrecks the in-game auction house. Traditional balancing relies on massive, disconnected Excel workbooks that fail to visualize how class archetypes distort the overall combat and economic envelope.

Balanc'em binds the four core dimensions of game design: **Damage Output / DPS ($N_{\text{DPS}}$)**, **Effective Health Pool & Armor ($N_{\text{EHP}}$)**, **Resource Cost & Cooldown Friction ($N_C$)**, and **Execution Skill Floor & Ceiling ($N_S$)** into a real-time 3D spatial polytope that dynamically deforms to reveal meta imbalances.

```
                    [ EFFECTIVE HEALTH POOL / ARMOR (NEHP) ]
                                      ▲
                                     / \
                                    /   \
                                   /     \
                                  /   K   \
                                 /         \
   [ DAMAGE PER SECOND (NDPS) ] ◄──┼─────────┼──► [ RESOURCE COST / COOLDOWN (NC) ]
                                 \         /
                                  \       /
                                   \     /
                                    \   /
                                      ▼
                      [ EXECUTION SKILL CEILING (NS) ]
```

---

## 2. Game Combat & Economy Equilibrium Mathematics

Balanc'em adapts Box'em's reciprocal solver to combat and progression mechanics:

$$N_{\text{DPS}} \cdot N_{\text{EHP}} = K_{\text{Game}} \cdot N_{\text{ResourceCost}} \cdot N_{\text{SkillCeiling}}$$

### Normalized Parameter Definitions:
- **Damage Throughput ($N_{\text{DPS}}$):**
  $$N_{\text{DPS}} = \max\left(0.001, \frac{\text{Base Damage} \cdot \text{Attack Speed} \cdot (1.0 + \text{Crit Rate} \cdot \text{Crit Dmg})}{500.0}\right)$$
- **Effective Health Pool & Survivability ($N_{\text{EHP}}$):**
  $$N_{\text{EHP}} = \max\left(0.001, \frac{\text{Hit Points}}{1000.0} \cdot \frac{1.0}{1.0 - \min(0.85, \text{Damage Reduction \%})}\right)$$
- **Resource Friction & Downtime ($N_C$):**
  $$N_C = \max\left(0.001, \frac{\text{Mana/Stamina Drain per Sec} \cdot \text{Cooldown in Sec}}{50.0}\right)$$
- **Execution Skill Ceiling ($N_S$):**
  $$N_S = \max\left(0.001, \frac{\text{Actions Per Minute (APM)} \cdot \text{I-Frame Precision Window (ms)}}{120.0 \cdot 100.0}\right)$$

### Visual Deformation & Archetype Morphing:
- **The "Glass Cannon" Morph:** Extreme DPS with negligible EHP stretches the 3D crystal into a razor-sharp elongated needle along the horizontal axis, providing instant visual confirmation of one-shot vulnerability.
- **The "Unkillable Tank" Morph:** High EHP with low DPS expands the crystal into a dense, flattened obsidian shield.
- **The "Broken Meta" Warning:** If a build exceeds the equilibrium envelope ($N_{\text{DPS}} \cdot N_{\text{EHP}} > 1.7 \cdot K$), the central reactor shifts to `magma` flare with visual fracture lines indicating overpowered exploits.

---

## 3. 3D Spatial Visuals & Shader Reuse

Balanc'em reuses Box'em's geometric reactor and crystalline shader matrix:

| Box'em Technical Element | Balanc'em Implementation & Visual Mapping |
| :--- | :--- |
| **Central Obsidian Reactor Core** | **Character Class Combat Polytope**. The mesh dynamically deforms to represent character archetypes (Tank, Assassin, Mage, Support, Bruiser). |
| **Pillar Node 1 (Time / Clock Crystal)** | **DPS Node**: 3D Crystalline Blade / Piercing Gem (`#0284c7` Sky Blue). |
| **Pillar Node 2 (Cost / Coin Gem)** | **Resource / Mana Node**: 3D Arcane Mana Rune (`#059669` Emerald Green). |
| **Pillar Node 3 (Quality / Diamond Core)**| **Survivability / EHP Node**: 3D Aegis Shield Core (`#7c3aed` Violet). |
| **Pillar Node 4 (Scope / Cube Matrix)** | **Skill Ceiling Node**: 3D Mastery Polyhedron (`#d97706` Amber Gold). |
| **Internal Milestone Gems** | **Abilities & Equipment Affixes**: Floating internal 3D crystals representing Ultimate Ability, Passive Perks, Armor Sets, Spell Procs, and Relic Modifiers. |
| **Crystalline Shader Presets** | • `damascus` (Damascus Steel): Physical melee weapons and armor balancing.<br>• `magma` (Volcanic Magma): High-burst fire magic and berserker rage.<br>• `polar` (Frosted Ice): Crowd control, freeze mechanics, and slow debuffs.<br>• `voidsingularity` (Quantum Singularity): Boss raid mechanics and void magic. |
| **CanvasTexture 3D Billboards** | Real-time TTK (Time-To-Kill in seconds), Sustained DPS, EHP total, and APM requirement hovering directly over nodes. |

---

## 4. 200+ Game Archetype & Genre Matrix

Balanc'em includes pre-configured balancing curves for major gaming genres:

1. **Soulslike Action RPG Boss:** Extreme EHP, high single-hit punishment, strict telegraph windows ($N_{\text{EHP}} = 95\%$, $N_{\text{DPS}} = 70\%$, Skill Window = 120ms).
2. **Competitive Hero Shooter Assassin (e.g. Genji/Tracer):** Ultra-fast TTK, hyper-mobility, sub-1000ms survivability ($N_{\text{DPS}} = 92\%$, $N_{\text{EHP}} = 22\%$, APM = 240).
3. **MMORPG Holy Trinity Tank:** Mitigates 80% incoming raid damage, low sustained DPS, high taunt resource friction ($N_{\text{EHP}} = 98\%$, $N_{\text{DPS}} = 15\%$).
4. **Fast-Paced Roguelike Deckbuilder:** Synergy scaling, exponential relic multiplication, diminishing returns curves ($N_C = 40\%$, $N_{\text{DPS}} = 120\%$).
5. **RTS Macro/Micro Economy:** Resource gatherer trade-offs, tech tree rush vs. defensive turtle ($N_{\text{APM}} = 300$, Eco Scale = 85%).
6. **Survival Extraction Shooter Gunplay:** Recoil climb, armor penetration mechanics, low TTK ($N_{\text{DPS}} = 88\%$, $N_{\text{EHP}} = 35\%$).
7. **Tabletop D&D 5e / Pathfinder Class Matrix:** Challenge Rating (CR) scaling, action economy balance, spell slot attrition.

---

## 5. Multi-Engine & GDD Export Pipeline

1. **Unity, Unreal Engine & Godot Data Tables:** Direct 1-click export of structured `.json` and `.csv` Curve Tables for instant import into Unreal Engine DataTables or Unity ScriptableObjects.
2. **Standardized `.balance.json` Schema:** Full mathematical state serialization for version-controlled balancing branches in Git.
3. **Interactive Game Design Document (GDD) Brief (Markdown):** Formatted patch notes, damage curve tables, and mathematical formulas ready for studio documentation.
4. **Standalone 3D Character Build (`.glb`):** Binary 3D asset with embedded combat stats in `userData.gameboxConfig`.
5. **1-Click Responsive `<iframe>` Build Calculator:** For community game wikis (Fandom, Liquipedia), Steam Community Hubs, and Discord embeds.
6. **Programmatic AI Balancing API:** `GET /api/balance-model?genre=moba&archetype=carry&dps=450` returns JSON balancing curves for automated game testing bots.

---

## 6. Sustainable Voluntary Sponsor & Indie Dev Model

Balanc'em is **100% free and open-source under MIT**, replacing costly enterprise balancing suites with an open community tool:

### Voluntary Sponsorship Tiers:
- **Tier 1: Indie Dev Backer ($5+)**
  - Unlocks 3 backer shaders (*Damascus Steel, Magma Burst, Solar Flare*).
  - Unlocks custom 3D Fantasy/Sci-Fi weapon node meshes (Broadsword, Arcane Staff, Plasma Rifle, Tower Shield).
- **Tier 2: Studio & Guild Patron ($25+)**
  - Unlocks all 8 backer shaders (*Kintsugi Legendary, Cyberpunk Vapor, Void Singularity*).
  - Permanent listing on the live Cloudflare D1 Game Studio Sponsor Ticker in the 3D viewport.
  - Custom studio logo watermarks and unlimited custom 3D GLTF asset slots.

### Edge Infrastructure:
- **Cloudflare Worker + D1 SQL:** Handles instantaneous webhook attestation with HMAC SHA-256 signatures from GitHub Sponsors, Open Collective, and Stripe.
- **Interactive 3D Boss Crystal Stage:** The donation modal features an interactive 3D Boss Core that unlocks legendary cosmetic aura effects as backer amounts scale.

---

## 7. High Shareability & Viral Loops

1. **"Community Build & Patch Calculator" Interactive Links:** Players and theorycrafters share exact build URLs (e.g. `balanc.dev/#game=soulslike&weapon=colossal_sword&dps=780`) to demonstrate min-maxed loadouts.
2. **Steam Guide & Wiki 3D Interactive Embeds:** Community creators embed live 3D build calculators directly inside Steam Guides and Fandom wikis.
3. **Reddit r/gamedev & r/indiegames 3D Visualizer Cards:** 1-click generation of animated WebGL capture gifs showing "How we balanced 24 character classes in our indie RPG".
4. **Community Patch Note Teardowns:** Studios embed live 3D before-and-after balance comparisons directly in Discord and Steam announcement blogs.
