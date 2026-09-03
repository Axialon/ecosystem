# BlackBoxes Design System Blueprint Patterns

Reference manual for creating future BlackBoxes projects (`engine #7`, `engine #8`, etc.) with zero regression.

## Centered Collapsible Brand Badge (`COLLAPSIBLE_LOGO_BADGE`)
**Category:** `UI_COMPONENT`  
**Description:** Mathematical squircle (48x48px) in collapsed mode with zero flex-gap offset, expanding on click with laser scan animation.

### Implementation Code:
```html
/* Badge Styling */
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
}
```

### Usage Instructions:
Apply to all new engines in the top-left corner. Binds to click to toggle '.collapsed' and trigger 3D laser scan beam.

---
## Rounded Glassmorphic Dropdown Engine (`CUSTOM_GLASS_DROPDOWN`)
**Category:** `UI_COMPONENT`  
**Description:** Transforms native <select class='glass-select'> into border-radius: 1.25rem backdrop-blur popover menus with smooth SVG chevrons.

### Implementation Code:
```html
function initCustomGlassDropdowns() {
  document.querySelectorAll('select.glass-select').forEach(selectEl => {
    if (selectEl.dataset.customized) return;
    selectEl.dataset.customized = 'true';
    selectEl.style.display = 'none';
    const wrapper = document.createElement('div');
    wrapper.className = 'custom-glass-dropdown-wrapper';
    selectEl.parentNode.insertBefore(wrapper, selectEl);
    wrapper.appendChild(selectEl);
  });
}
```

### Usage Instructions:
Run after DOMContentLoaded to wrap all select elements inside floating windows and modals.

---
## Unobstructed Floating Draggable Windows (`WINDOW_PLACEMENT_SPECS`)
**Category:** `LAYOUT`  
**Description:** Initial placement at top: 128px - 130px prevents overlap with the top-left brand badge. Features pointerdown dragging and smooth collapse.

### Implementation Code:
```html
<div id="win-controls" class="floating-window glass-panel rounded-3xl p-4 shadow-2xl" style="top: 130px; left: 20px; width: 380px;">
  <div class="window-header flex justify-between items-center pb-2.5 border-b mb-2.5">
    <h3>Vector Controls</h3>
    <button class="win-collapse-btn font-mono text-sm" title="Minimize Window">−</button>
    <button class="win-close-btn font-mono text-sm" title="Close Window">✕</button>
  </div>
  <div class="window-body space-y-3">...</div>
</div>
```

### Usage Instructions:
Ensure top coordinate is >= 125px on desktop to provide 10px breathing room below the expanded brand badge.

---
## Crystalline Shaders & Scene Themes Modal (`SHADERS_BAZAAR_MODAL`)
**Category:** `MODAL_SYSTEM`  
**Description:** Unified modal with 3D node mesh selector, 12 Free + 8 Backer shaders, and 6 real-time Three.js scene themes.

### Implementation Code:
```html
const SHADER_PRESETS = {
  classic: { color: 0x1d4ed8, emissive: 0x38bdf8, roughness: 0.10, transmission: 0.60 },
  liquid: { color: 0x0284c7, emissive: 0x06b6d4, roughness: 0.06, transmission: 0.70 }
};
function applyShader(key) {
  const s = SHADER_PRESETS[key];
  if (coreHullMesh && s) {
    coreHullMesh.material.color.setHex(s.color);
    coreHullMesh.material.roughness = s.roughness;
  }
}
```

### Usage Instructions:
Wire to Actions Menu '#btn-open-bazaar' and bottom dock palette triggers.

---
## Supporter Ticker & 3D Reactor Modal (`SPONSORS_TICKER_MODAL`)
**Category:** `MODAL_SYSTEM`  
**Description:** Interactive 3D WebGL hologram reactor canvas with drag-to-inspect, 5 contribution tiers, Stripe checkout, and D1 live stream.

### Implementation Code:
```html
function initDonationHologram() {
  const canvas = document.getElementById('donation-3d-canvas');
  // Three.js icosahedron core with orbiting satellites and drag rotation
}
```

### Usage Instructions:
Wire to Actions Menu '#btn-open-ticker' and bottom-right live donation tracker badge.

---
## Light Mode Readability & Contrast Shield (`LIGHT_MODE_CONTRAST_SHIELD`)
**Category:** `THEMING`  
**Description:** Guarantees deep slate #0f172a / #020617 typography against light glass panels when dark mode is toggled off.

### Implementation Code:
```html
html:not(.dark) body { background-color: #cbd5e1 !important; color: #0f172a !important; }
html:not(.dark) .glass-panel { background: rgba(255, 255, 255, 0.94) !important; color: #0f172a !important; }
html:not(.dark) .window-header h3, html:not(.dark) #brand-text-content span { color: #0f172a !important; }
```

### Usage Instructions:
Include in <style> block of all BlackBoxes projects.

---
