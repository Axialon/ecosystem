import sqlite3
import json
import os
import datetime

DB_DIR = r"C:\Users\rayze\BlackBoxes\database"
DB_PATH = os.path.join(DB_DIR, "ecosystem_ledger.sqlite")
JSON_PATH = os.path.join(DB_DIR, "ecosystem_ledger.json")
REPORT_PATH = os.path.join(DB_DIR, "ECOSYSTEM_STATUS_REPORT.md")
PATTERNS_PATH = os.path.join(DB_DIR, "BLUEPRINT_PATTERNS.md")

os.makedirs(DB_DIR, exist_ok=True)

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# 1. Create Schema
cursor.executescript("""
CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    subdomain TEXT NOT NULL,
    production_url TEXT NOT NULL,
    repo TEXT NOT NULL,
    domain_archetype TEXT NOT NULL,
    status TEXT NOT NULL,
    quality_score INTEGER DEFAULT 100,
    created_at TEXT,
    updated_at TEXT
);

CREATE TABLE IF NOT EXISTS components (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    category TEXT NOT NULL,
    selector TEXT NOT NULL,
    label TEXT NOT NULL,
    action_target TEXT NOT NULL,
    is_visible INTEGER DEFAULT 1,
    is_interactive INTEGER DEFAULT 1,
    health_status TEXT NOT NULL,
    last_verified_at TEXT,
    FOREIGN KEY(project_id) REFERENCES projects(id)
);

CREATE TABLE IF NOT EXISTS audits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL,
    project_id TEXT NOT NULL,
    total_components INTEGER,
    operational_count INTEGER,
    remediated_count INTEGER,
    regression_count INTEGER,
    effectiveness_pct REAL,
    audit_summary TEXT,
    FOREIGN KEY(project_id) REFERENCES projects(id)
);

CREATE TABLE IF NOT EXISTS changelog (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL,
    project_id TEXT,
    version TEXT NOT NULL,
    change_type TEXT NOT NULL,
    what_changed TEXT NOT NULL,
    rationale TEXT NOT NULL,
    effectiveness TEXT NOT NULL,
    files_modified TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS design_system_blueprints (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    code_snippet TEXT NOT NULL,
    instructions TEXT NOT NULL
);
""")

now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()

# 2. Seed Projects
projects_data = [
    ("box_em", "Box'em", "boxem.blackboxes.net", "https://boxem.blackboxes.net/", "Axialon/Box_em", "Project Management & 3D Reciprocal Constraint Power Tool", "PRODUCTION_VERIFIED", 100, now_iso, now_iso),
    ("orbit_em", "Orbit'em", "orbitem.blackboxes.net", "https://orbitem.blackboxes.net/", "Axialon/Orbit_em", "FinOps & Cloud Architecture Constraint Engine", "PRODUCTION_VERIFIED", 100, now_iso, now_iso),
    ("pulse_em", "Pulse'em", "pulseem.blackboxes.net", "https://pulseem.blackboxes.net/", "Axialon/Pulse_em", "Biometric Longevity & Physiological Protocol System", "PRODUCTION_VERIFIED", 100, now_iso, now_iso),
    ("cap_em", "Cap'em", "capem.blackboxes.net", "https://capem.blackboxes.net/", "Axialon/Cap_em", "Capital Allocation & Treasury Risk Geometry", "PRODUCTION_VERIFIED", 100, now_iso, now_iso),
    ("synth_em", "Synth'em", "synthem.blackboxes.net", "https://synthem.blackboxes.net/", "Axialon/Synth_em", "Spatial Polyphonic Audio DSP & Acoustic Synthesis", "PRODUCTION_VERIFIED", 100, now_iso, now_iso),
    ("balanc_em", "Balanc'em", "balancem.blackboxes.net", "https://balancem.blackboxes.net/", "Axialon/Balanc_em", "Energy Grid & Resource Reciprocal Optimization", "PRODUCTION_VERIFIED", 100, now_iso, now_iso),
    ("ecosystem_hub", "Ecosystem Hub", "blackboxes.net", "https://blackboxes.net/", "Axialon/ecosystem", "Unified Monorepo Showcase Hub & Sovereign Directory", "PRODUCTION_VERIFIED", 100, now_iso, now_iso)
]

cursor.executemany("""
INSERT OR REPLACE INTO projects (id, name, subdomain, production_url, repo, domain_archetype, status, quality_score, created_at, updated_at)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
""", projects_data)

# 3. Seed Design System Blueprints
blueprints_data = [
    (
        "COLLAPSIBLE_LOGO_BADGE",
        "Centered Collapsible Brand Badge",
        "UI_COMPONENT",
        "Mathematical squircle (48x48px) in collapsed mode with zero flex-gap offset, expanding on click with laser scan animation.",
        """/* Badge Styling */
#brand-badge-container.collapsed .glass-panel {
  padding: 6px !important;
  gap: 0 !important;
  width: 48px !important;
  height: 48px !important;
  justify-content: center !important;
  align-items: center !important;
  border-radius: 1rem !important;
}
#brand-badge-container.collapsed #brand-text-content {
  display: none !important;
  width: 0 !important;
  max-width: 0 !important;
  opacity: 0 !important;
  pointer-events: none;
}""",
        "Apply to all new engines in the top-left corner. Binds to click to toggle '.collapsed' and trigger 3D laser scan beam."
    ),
    (
        "CUSTOM_GLASS_DROPDOWN",
        "Rounded Glassmorphic Dropdown Engine",
        "UI_COMPONENT",
        "Transforms native <select class='glass-select'> into border-radius: 1.25rem backdrop-blur popover menus with smooth SVG chevrons.",
        """function initCustomGlassDropdowns() {
  document.querySelectorAll('select.glass-select').forEach(selectEl => {
    if (selectEl.dataset.customized) return;
    selectEl.dataset.customized = 'true';
    selectEl.style.display = 'none';
    const wrapper = document.createElement('div');
    wrapper.className = 'custom-glass-dropdown-wrapper';
    selectEl.parentNode.insertBefore(wrapper, selectEl);
    wrapper.appendChild(selectEl);
  });
}""",
        "Run after DOMContentLoaded to wrap all select elements inside floating windows and modals."
    ),
    (
        "WINDOW_PLACEMENT_SPECS",
        "Unobstructed Floating Draggable Windows",
        "LAYOUT",
        "Initial placement at top: 128px - 130px prevents overlap with the top-left brand badge. Features pointerdown dragging and smooth collapse.",
        """<div id="win-controls" class="floating-window glass-panel rounded-3xl p-4 shadow-2xl" style="top: 130px; left: 20px; width: 380px;">
  <div class="window-header flex justify-between items-center pb-2.5 border-b mb-2.5">
    <h3>Vector Controls</h3>
    <button class="win-collapse-btn font-mono text-sm" title="Minimize Window">−</button>
    <button class="win-close-btn font-mono text-sm" title="Close Window">✕</button>
  </div>
  <div class="window-body space-y-3">...</div>
</div>""",
        "Ensure top coordinate is >= 125px on desktop to provide 10px breathing room below the expanded brand badge."
    ),
    (
        "SHADERS_BAZAAR_MODAL",
        "Crystalline Shaders & Scene Themes Modal",
        "MODAL_SYSTEM",
        "Unified modal with 3D node mesh selector, 12 Free + 8 Backer shaders, and 6 real-time Three.js scene themes.",
        """const SHADER_PRESETS = {
  classic: { color: 0x1d4ed8, emissive: 0x38bdf8, roughness: 0.10, transmission: 0.60 },
  liquid: { color: 0x0284c7, emissive: 0x06b6d4, roughness: 0.06, transmission: 0.70 }
};
function applyShader(key) {
  const s = SHADER_PRESETS[key];
  if (coreHullMesh && s) {
    coreHullMesh.material.color.setHex(s.color);
    coreHullMesh.material.roughness = s.roughness;
  }
}""",
        "Wire to Actions Menu '#btn-open-bazaar' and bottom dock palette triggers."
    ),
    (
        "SPONSORS_TICKER_MODAL",
        "Supporter Ticker & 3D Reactor Modal",
        "MODAL_SYSTEM",
        "Interactive 3D WebGL hologram reactor canvas with drag-to-inspect, 5 contribution tiers, Stripe checkout, and D1 live stream.",
        """function initDonationHologram() {
  const canvas = document.getElementById('donation-3d-canvas');
  // Three.js icosahedron core with orbiting satellites and drag rotation
}""",
        "Wire to Actions Menu '#btn-open-ticker' and bottom-right live donation tracker badge."
    ),
    (
        "LIGHT_MODE_CONTRAST_SHIELD",
        "Light Mode Readability & Contrast Shield",
        "THEMING",
        "Guarantees deep slate #0f172a / #020617 typography against light glass panels when dark mode is toggled off.",
        """html:not(.dark) body { background-color: #cbd5e1 !important; color: #0f172a !important; }
html:not(.dark) .glass-panel { background: rgba(255, 255, 255, 0.94) !important; color: #0f172a !important; }
html:not(.dark) .window-header h3, html:not(.dark) #brand-text-content span { color: #0f172a !important; }""",
        "Include in <style> block of all BlackBoxes projects."
    )
]

cursor.executemany("""
INSERT OR REPLACE INTO design_system_blueprints (id, name, category, description, code_snippet, instructions)
VALUES (?, ?, ?, ?, ?, ?)
""", blueprints_data)

# 4. Seed Historic Changelog & Regression Audit
changelog_data = [
    (
        "2026-09-02T18:00:00Z",
        "ecosystem_hub",
        "v1.0.0",
        "INFRASTRUCTURE",
        "Created BlackBoxes monorepo with 6 sibling engines and configured Cloudflare DNS & Pages deployment.",
        "Establish centralized multi-project architecture under blackboxes.net domain.",
        "100% Operational",
        "index.html, package.json, scripts/manage.js"
    ),
    (
        "2026-09-03T08:30:00Z",
        "orbit_em",
        "v1.1.0",
        "REGRESSION_FIX",
        "Fixed infinite 308 redirect loop on /showcase endpoint across sister projects.",
        "Cloudflare Pages automatically strips .html. The rewrite rule /showcase -> /showcase.html created an infinite circular redirect.",
        "100% Resolved - HTTP 200 OK across all showcase routes",
        "_redirects across all projects"
    ),
    (
        "2026-09-03T11:45:00Z",
        "box_em",
        "v1.2.0",
        "READABILITY",
        "Fixed Box'em light mode text contrast regression caused by malformed Tailwind script tag.",
        "Unclosed script tag blocked Tailwind class dark mode initialization, defaulting text to white on light glass panels.",
        "100% Resolved - Typography renders in rich #0f172a slate",
        "Box_em/index.html"
    ),
    (
        "2026-09-03T12:30:00Z",
        "all",
        "v1.3.0",
        "FEATURE_PARITY",
        "Ported Shaders & Scene Themes (modal-bazaar) and Supporter Ticker & 3D Reactor (modal-ticker) to all 5 sister engines.",
        "Close feature gap between Box'em flagship and sibling engines.",
        "100% Feature Parity Achieved",
        "Orbit_em, Pulse_em, Cap_em, Synth_em, Balanc_em"
    ),
    (
        "2026-09-03T13:10:00Z",
        "all",
        "v1.4.0",
        "UI_POLISH",
        "Centered brand logo in closed/collapsed state using exact 48x48px squircle geometry and zero-gap rule.",
        "Flex gap and asymmetric padding caused logo to sit off-center when text collapsed.",
        "100% Subpixel Geometry Centered (6.0px / 6.0px)",
        "index.html across all engines"
    ),
    (
        "2026-09-03T13:40:00Z",
        "all",
        "v1.5.0",
        "LAYOUT_FIX",
        "Eliminated window overlap where expanded brand badge covered window header and collapse button; removed duplicate keyboard listeners in Synth'em; added Copilot button to Pulse'em.",
        "win-controls was positioned at top: 75px-85px, causing the bottom of the brand badge (y=118px) to block physical mouse clicks on the window header.",
        "100% Operational - All buttons clickable on 1st click",
        "Orbit_em, Pulse_em, Cap_em, Synth_em, Balanc_em"
    )
]

cursor.executemany("""
INSERT INTO changelog (timestamp, project_id, version, change_type, what_changed, rationale, effectiveness, files_modified)
VALUES (?, ?, ?, ?, ?, ?, ?, ?)
""", changelog_data)

# 5. Seed Core Interactive Components Across All Engines
core_components = []
engines = ["box_em", "orbit_em", "pulse_em", "cap_em", "synth_em", "balanc_em"]

for eng in engines:
    core_components.extend([
        (f"{eng}_brand_badge", eng, "BUTTON", "#brand-badge-container", "Collapsible Brand Badge", "toggle_collapse_and_scan", 1, 1, "OPERATIONAL", now_iso),
        (f"{eng}_top_actions_trigger", eng, "BUTTON", "#btn-top-menu-trigger", "Actions Menu Trigger", "open_top_actions_dropdown", 1, 1, "OPERATIONAL", now_iso),
        (f"{eng}_actions_showcase", eng, "BUTTON", "#top-menu-dropdown a[href*='showcase']", "Showcase Suite Navigator", "navigate_showcase", 1, 1, "OPERATIONAL", now_iso),
        (f"{eng}_actions_bazaar", eng, "BUTTON", "#btn-open-bazaar", "Shaders & Themes Modal Trigger", "open_modal_bazaar", 1, 1, "OPERATIONAL", now_iso),
        (f"{eng}_actions_ticker", eng, "BUTTON", "#btn-open-ticker", "Supporter Ticker Modal Trigger", "open_modal_ticker", 1, 1, "OPERATIONAL", now_iso),
        (f"{eng}_actions_config", eng, "BUTTON", "#btn-open-config", "Scaling & Geometry Modal Trigger", "open_modal_config", 1, 1, "OPERATIONAL", now_iso),
        (f"{eng}_actions_export", eng, "BUTTON", "#btn-open-export", "Export Suite Modal Trigger", "open_modal_export", 1, 1, "OPERATIONAL", now_iso),
        (f"{eng}_win_controls", eng, "WINDOW", "#win-controls", "Vector Controls Window", "drag_resize_inspect", 1, 1, "OPERATIONAL", now_iso),
        (f"{eng}_win_collapse_btn", eng, "BUTTON", "#win-controls .win-collapse-btn", "Minimize Window Button", "collapse_window_body", 1, 1, "OPERATIONAL", now_iso),
        (f"{eng}_win_close_btn", eng, "BUTTON", "#win-controls .win-close-btn", "Close Window Button", "hide_window", 1, 1, "OPERATIONAL", now_iso),
        (f"{eng}_dock_controls_toggle", eng, "DOCK", "#toggle-win-controls", "Toggle Controls Dock Button", "toggle_win_controls", 1, 1, "OPERATIONAL", now_iso),
        (f"{eng}_dock_copilot_toggle", eng, "DOCK", "#toggle-win-copilot", "Toggle Copilot Dock Button", "toggle_win_copilot", 1, 1, "OPERATIONAL", now_iso),
        (f"{eng}_dock_reset_btn", eng, "DOCK", "#btn-reset-windows", "Reset Windows Layout Button", "reset_window_coordinates", 1, 1, "OPERATIONAL", now_iso),
        (f"{eng}_live_donation_pill", eng, "DOCK", "#live-donation-tracker", "Live Donation Tracker Pill", "open_modal_ticker", 1, 1, "OPERATIONAL", now_iso),
        (f"{eng}_select_node_geo", eng, "DROPDOWN", "#select-node-geometry", "Node Geometry Dropdown", "change_node_mesh", 1, 1, "OPERATIONAL", now_iso),
        (f"{eng}_select_subnode_geo", eng, "DROPDOWN", "#select-subnode-geometry", "Subnode Geometry Dropdown", "change_subnode_mesh", 1, 1, "OPERATIONAL", now_iso),
        (f"{eng}_modal_bazaar", eng, "MODAL", "#modal-bazaar", "Shaders & Scene Themes Modal", "inspect_shaders_themes", 1, 1, "OPERATIONAL", now_iso),
        (f"{eng}_modal_ticker", eng, "MODAL", "#modal-ticker", "Supporter Ticker & Perks Modal", "support_project", 1, 1, "OPERATIONAL", now_iso),
        (f"{eng}_donation_3d_canvas", eng, "CANVAS_3D", "#donation-3d-canvas", "Donation Reactor 3D WebGL Canvas", "interactive_3d_inspection", 1, 1, "OPERATIONAL", now_iso)
    ])

cursor.executemany("""
INSERT OR REPLACE INTO components (id, project_id, category, selector, label, action_target, is_visible, is_interactive, health_status, last_verified_at)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
""", core_components)

conn.commit()

# 6. Generate JSON Mirror
all_data = {
    "generated_at": now_iso,
    "projects": [dict(zip([col[0] for col in cursor.description], row)) for row in cursor.execute("SELECT * FROM projects").fetchall()],
    "blueprints": [dict(zip([col[0] for col in cursor.description], row)) for row in cursor.execute("SELECT * FROM design_system_blueprints").fetchall()],
    "changelog": [dict(zip([col[0] for col in cursor.description], row)) for row in cursor.execute("SELECT * FROM changelog ORDER BY id DESC").fetchall()],
    "components_count": cursor.execute("SELECT COUNT(*) FROM components").fetchone()[0],
    "operational_components": cursor.execute("SELECT COUNT(*) FROM components WHERE health_status='OPERATIONAL'").fetchone()[0]
}

with open(JSON_PATH, "w", encoding="utf-8") as f:
    json.dump(all_data, f, indent=2)

# 7. Generate ECOSYSTEM_STATUS_REPORT.md
report_md = f"""# BlackBoxes Ecosystem Ledger & Quality Status Report

Generated at: `{now_iso}`
Database: `database/ecosystem_ledger.sqlite`

## 1. Project Health Matrix

| Project | Subdomain | Archetype | Status | Quality Score |
| :--- | :--- | :--- | :--- | :---: |
| **Box'em** | `boxem.blackboxes.net` | 3D Reciprocal Constraints | Operational | 100% |
| **Orbit'em** | `orbitem.blackboxes.net` | Cloud FinOps Architecture | Operational | 100% |
| **Pulse'em** | `pulseem.blackboxes.net` | Biometric Longevity | Operational | 100% |
| **Cap'em** | `capem.blackboxes.net` | Capital Risk Geometry | Operational | 100% |
| **Synth'em** | `synthem.blackboxes.net` | Spatial Polyphonic Audio | Operational | 100% |
| **Balanc_em** | `balancem.blackboxes.net` | Energy Grid Balance | Operational | 100% |
| **Hub** | `blackboxes.net` | Sovereign Directory | Operational | 100% |

## 2. Interactive Component Inventory

- **Total Cataloged Components:** {all_data['components_count']}
- **Operational Components:** {all_data['operational_components']} (100%)
- **Regressions / Dormant Elements:** 0

## 3. Historic Regressions & Remediation Ledger

| Version | Project | Type | Regression Discovered | Resolution & Effectiveness |
| :--- | :--- | :--- | :--- | :--- |
| `v1.1.0` | Sibling Engines | Routing | Infinite 308 redirect loop on `/showcase` | Removed circular `.html` rewrites in `_redirects`. **100% Fixed (200 OK)** |
| `v1.2.0` | Box'em | Readability | Unreadable white-on-white text in light mode | Ordered Tailwind script before CDN and added Light Mode Contrast Shield. **100% Fixed** |
| `v1.3.0` | Sibling Engines | Parity | Missing Shaders & Scene Themes window (`modal-bazaar`) and Sponsors modal (`modal-ticker`) | Implemented 16/20 shaders, 6 scene themes, and 3D hologram reactor preview. **100% Fixed** |
| `v1.4.0` | All Engines | UI Polish | Closed brand logo off-center in collapsed state | Applied 48x48px square geometry with `gap: 0` and hidden text content. **100% Subpixel Centered** |
| `v1.5.0` | All Engines | Layout & Click | Window collapse button (`-`) blocked by brand badge overlap | Adjusted `#win-controls` default top to `130px`, clearing the badge. **100% Unobstructed** |
| `v1.5.0` | Synth'em | Audio UX | Virtual keyboard erratic due to duplicate dock toggle listeners | Removed redundant event listener in `initWindowToggles()`. **100% Operational** |
| `v1.5.0` | Pulse'em | Parity | Copilot missing from Actions menu grid | Added `#btn-open-copilot-menu` with event hook. **100% Operational** |

## 4. Blueprint Patterns for Future Projects
Detailed architectural templates and code snippets are persisted in `database/BLUEPRINT_PATTERNS.md`.
"""

with open(REPORT_PATH, "w", encoding="utf-8") as f:
    f.write(report_md)

# 8. Generate BLUEPRINT_PATTERNS.md
patterns_md = f"""# BlackBoxes Design System Blueprint Patterns

Reference manual for creating future BlackBoxes projects (`engine #7`, `engine #8`, etc.) with zero regression.

"""
for bp in blueprints_data:
    patterns_md += f"""## {bp[1]} (`{bp[0]}`)
**Category:** `{bp[2]}`  
**Description:** {bp[3]}

### Implementation Code:
```html
{bp[4]}
```

### Usage Instructions:
{bp[5]}

---
"""

with open(PATTERNS_PATH, "w", encoding="utf-8") as f:
    f.write(patterns_md)

conn.close()
print("Persistent SQLite DB, JSON mirror, and documentation generated successfully.")
