# Cap'em: 3D Startup Cap Table, Dilution & Valuation Equilibrium Matrix

## 1. Product Vision & Value Proposition

**Cap'em** is an interactive 3D spatial equity engine and cap table simulator built for startup founders, angel investors, venture syndicates, and corporate counsel.

Modeling early-stage fundraising is notoriously prone to hidden traps: stacking multiple post-money SAFEs with varying valuation caps, expanding employee stock option pools (ESOP) pre-money vs. post-money, and trading off operational runway against catastrophic founder dilution. Traditional spreadsheet models are static, confusing to pitch audiences, and obscure the visceral geometric impact of dilution.

Cap'em represents a company's capitalization as a dynamic 3D polyhedral core governed by the four cardinal vectors of startup venture capital: **Capital Raised ($N_C$)**, **Operational Runway in Months ($N_R$)**, **Founder Equity Ownership ($N_E$)**, and **Post-Money Enterprise Valuation ($N_V$)**.

```
                   [ FOUNDER EQUITY OWNERSHIP % (NE) ]
                                   ▲
                                  / \
                                 /   \
                                /     \
                               /   K   \
                              /         \
  [ OPERATIONAL RUNWAY (NR) ] ◄┼─────────┼► [ POST-MONEY VALUATION (NV) ]
                               \         /
                                \       /
                                 \     /
                                  \   /
                                    ▼
                      [ CAPITAL RAISED / DILUTION (NC) ]
```

---

## 2. Venture Capital Equilibrium Mathematics

Cap'em translates cap table and convertible instrument dynamics into a reciprocal equilibrium law:

$$N_{\text{Founder Equity}} \cdot N_{\text{Valuation}} = K_{\text{Venture}} \cdot N_{\text{Runway}} \cdot N_{\text{Capital Raised}}$$

### Normalized Parameter Definitions:
- **Founder Ownership Share ($N_E$):**
  $$N_E = \max\left(0.001, \frac{\text{Founder Equity Percentage}}{100.0}\right)$$
- **Post-Money Enterprise Valuation ($N_V$):**
  $$N_V = \max\left(0.001, \frac{\text{Post-Money Valuation in USD}}{\$20,000,000.00}\right)$$
- **Operational Runway ($N_R$):**
  $$N_R = \max\left(0.001, \frac{\text{Runway in Months}}{24.0} \cdot \frac{\text{Capital Raised}}{\text{Monthly Net Burn Rate}}\right)$$
- **Capital Inflow & Dilution Magnitude ($N_C$):**
  $$N_C = \max\left(0.001, \frac{\text{Total Investment Inflow}}{\$5,000,000.00}\right)$$

### SAFE Note & ESOP Option Pool Solvers:
- **SAFE Note Anti-Dilution Distortion:** Stacking multiple YC Post-Money SAFEs triggers exponential founder compression. When total SAFE notes exceed 25% of the round cap, the central crystal deforms with a sharp inward necking effect.
- **Pre-Money ESOP Shuffle Guard:** Cap'em includes a dynamic toggle for "Unallocated Option Pool Shuffle" (typically 10%–15% forced onto existing founders), calculating the exact effective dilution before term sheet signature.

---

## 3. 3D Spatial Visuals & Shader Reuse

Cap'em reuses Box'em's physical transmission materials and dynamic geometry to give founders an immediate, visual understanding of their capitalization structure:

| Box'em Technical Element | Cap'em Implementation & Visual Mapping |
| :--- | :--- |
| **Central Obsidian Reactor Core** | **The Cap Table Enterprise Core**. The outer volume represents 100% equity; as tranches are sold, the core contracts, refracts, and reveals internal investor ownership volumes. |
| **Pillar Node 1 (Time / Clock Crystal)** | **Runway Node**: 3D Hourglass / Runway Crystal (`#0284c7` Sky Blue). |
| **Pillar Node 2 (Cost / Coin Gem)** | **Capital Raised Node**: 3D Venture Ingot / Treasury Monolith (`#059669` Emerald Green). |
| **Pillar Node 3 (Quality / Diamond Core)**| **Valuation Node**: 3D Enterprise Diamond (`#7c3aed` Royal Violet). |
| **Pillar Node 4 (Scope / Cube Matrix)** | **Founder Equity Node**: 3D Sovereign Founder Monolith (`#d97706` Amber Gold). |
| **Internal Milestone Gems** | **Investor Tranches & Option Pools**: Floating 3D crystals representing Seed Lead VC, Angel Syndicate, Unallocated ESOP (10%), Advisory Pool (2%), and Series A Preferred Stock. |
| **Crystalline Shader Presets** | • `kintsugi` (Kintsugi Gold Fracture): SAFE note conversions and liquidation preference waterfalls.<br>• `emerald` (Emerald Matrix): Cash-flow positive profitable runway.<br>• `damascus` (Damascus Steel): Venture debt / convertible note debt-equity hybrid.<br>• `carbon` (Stealth Carbon): Stealth pre-seed bootstrapping mode. |
| **CanvasTexture 3D Billboards** | Real-time Founder Take-Home (%), Effective Price-per-Share ($), Total Months to Default, and Option Pool Allocation in 3D space. |

---

## 4. 180+ Startup Sector & Funding Stage Matrix

Cap'em includes market-calibrated benchmarks across stages and industries:

1. **Pre-Seed AI / Infra Startup:** $500k SAFE at $6M Post-Money Cap, 18 months runway, 2 founders ($N_E = 91.7\%$).
2. **Seed B2B Enterprise SaaS:** $3.0M priced round at $15M Post-Money, 12% ESOP refresh, 24 months runway ($N_E = 68.4\%$).
3. **Hardware / Robotics Prototype:** $4.5M seed round, heavy capex burn ($140k/mo), 18 months runway ($N_E = 62.0\%$).
4. **Direct-to-Consumer / E-Commerce Brand:** $1.2M SAFE notes with MFN clauses, inventory debt financing ($N_E = 80.5\%$).
5. **MedTech / Biosensor Clinical Trials:** $8.0M Series A, 2x Liquidation Preference, 36-month regulatory runway ($N_E = 52.1\%$).
6. **FinTech Capital Intensive (Debt + Equity):** $15M warehouse debt facility + $3M equity tranche at $18M valuation ($N_E = 74.0\%$).
7. **Bootstrapped Micro-SaaS (Dividend Cashflow):** $0 VC raised, $35k/mo MRR profit, 100% founder retained ($N_E = 100\%$).

---

## 5. Multi-Format Investor Pitch & Legal Export Pipeline

1. **Standardized `.capbox.json` Schema:** Schema-validated, script-sanitized cap table data interchange format.
2. **Interactive 3D Term Sheet Proposal (Markdown & HTML):** Generates ready-to-share pitch deck attachments with dilution charts and payoff waterfalls at various exit scenarios ($10M, $50M, $250M, $1B).
3. **Cap Table Excel / CSV Roundtrip Sync:** Direct export to Carta-compatible CSV format and Excel multi-round workbook.
4. **Standalone 3D `.glb` Enterprise Model:** Binary 3D scene embedded with cap table metadata in `userData.capboxConfig`.
5. **1-Click Responsive `<iframe>` Pitch Deck Embed:** Seamlessly embeds into Pitch.com, DocSend, Notion, and Google Slides.
6. **AI Agent Valuation REST API:** `GET /api/cap-model?raised=2000000&val=10000000&burn=80000` returns JSON and pitch prompt text for AI pitch generation.

---

## 6. Sustainable Voluntary Sponsor & Ecosystem Model

Cap'em is **100% free and open-source under MIT**, eliminating expensive SaaS cap table platform subscriptions ($2,500–$10,000/yr for early startups):

### Voluntary Sponsorship Tiers:
- **Tier 1: Founder Ally ($5+)**
  - Unlocks 3 backer shaders (*Kintsugi Gold, Abyssal Syndicate, Supernova Valuation*).
  - Unlocks custom 3D mesh slots for investor logos and company tokens.
- **Tier 2: Syndicate & Legal Guild ($25+)**
  - Unlocks all 8 backer shaders (*Damascus Preferred, Neon Vapor, Quantum Singularity*).
  - Permanent listing on the live Cloudflare D1 "Founder-Friendly Ecosystem" edge ticker.
  - Custom firm watermark and white-label term sheet PDF header generation.

### Edge Infrastructure:
- **Cloudflare Worker + D1 SQL:** Handles instantaneous webhook attestation with HMAC SHA-256 signatures from GitHub Sponsors, Open Collective, and Stripe.
- **Interactive 3D Valuation Crystal Stage:** The donation modal features an interactive 3D Gold Bullion Crystal that scales its facet refraction with backer contribution tiers.

---

## 7. High Shareability & Viral Loops

1. **"SAFE Note Dilution Calculator" Viral Share Link:** Founders share interactive scenarios (e.g. `cap.dev/#preseed=750k&cap=8M&esop=12`) with co-founders and advisors to test term sheet pushback.
2. **Pitch Deck 3D Holographic Embed:** Founders embed an interactive 3D cap table directly in DocSend pitch decks, allowing VCs to test allocation amounts live.
3. **X/Twitter & LinkedIn "VC Term Sheet Breakdown":** 1-click generation of high-contrast 3D visual comparison cards highlighting the difference between a 1x vs 2x liquidation preference.
4. **Y Combinator / Techstars Startup Guide Generator:** 1-click Markdown export formatted for Hacker News, Substack newsletters, and founder communities.
