
const fs = require("fs");
const path = require("path");

const cssSnippet = `
    /* Tactile Glassmorphic Up/Down Number Stepper Ticker - Box'em Design */
    .glass-stepper-container {
      display: flex;
      align-items: center;
      background: rgba(15, 23, 42, 0.65);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 0.75rem;
      padding: 1px 2px;
      box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.25);
      transition: all 0.2s ease;
    }
    .glass-stepper-container:focus-within {
      border-color: #38bdf8;
      box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.35);
    }
    .glass-stepper-input {
      width: 100%;
      background: transparent;
      border: none;
      outline: none;
      text-align: center;
      font-family: monospace;
      font-size: 11px;
      font-weight: 800;
      color: #f8fafc;
      padding: 1px 2px;
      -moz-appearance: textfield;
    }
    .glass-stepper-input::-webkit-outer-spin-button,
    .glass-stepper-input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    .glass-stepper-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      border-radius: 0.5rem;
      background: rgba(30, 41, 59, 0.8);
      color: #cbd5e1;
      border: 1px solid rgba(255, 255, 255, 0.1);
      font-size: 9px;
      cursor: pointer;
      transition: all 0.15s ease;
      user-select: none;
      flex-shrink: 0;
    }
    .glass-stepper-btn:hover {
      background: #38bdf8;
      color: #020617;
      transform: scale(1.08);
    }
    .glass-stepper-btn:active {
      transform: scale(0.92);
    }
`;

const jsSnippet = `
    function stepNumberInput(inputId, delta) {
      const el = document.getElementById(inputId);
      if (!el) return;
      const current = parseFloat(el.value) || 0;
      const min = el.min !== "" ? parseFloat(el.min) : -Infinity;
      const max = el.max !== "" ? parseFloat(el.max) : Infinity;
      const nextVal = Math.min(max, Math.max(min, current + delta));
      const step = parseFloat(el.step) || 1;
      const decimals = (String(step).split(".")[1] || "").length;
      el.value = Number(nextVal.toFixed(Math.max(decimals, 2)));
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
    }
    window.stepNumberInput = stepNumberInput;
`;

const ENGINES_CONFIG = {
  Pulse_em: [
    { id: "input-strain", step: 25, width: "w-24" },
    { id: "input-recovery", step: 2, width: "w-24" },
    { id: "input-fuel", step: 5, width: "w-24" },
    { id: "input-autophagy", step: 2, width: "w-24" },
    { id: "input-longevity", step: 2, width: "w-24" }
  ],
  Cap_em: [
    { id: "input-capital", step: 250, width: "w-28" },
    { id: "input-valuation", step: 1000, width: "w-28" },
    { id: "input-runway", step: 1, width: "w-24" },
    { id: "input-esop", step: 1, width: "w-24" },
    { id: "input-founder", step: 2, width: "w-24" }
  ],
  Synth_em: [
    { id: "input-drive", step: 2, width: "w-24" },
    { id: "input-crest", step: 2, width: "w-24" },
    { id: "input-pitch", step: 25, width: "w-26" },
    { id: "input-reverb", step: 2, width: "w-24" },
    { id: "input-cutoff", step: 100, width: "w-28" },
    { id: "input-width", step: 2, width: "w-24" }
  ],
  Balanc_em: [
    { id: "input-dps", step: 50, width: "w-26" },
    { id: "input-ehp", step: 500, width: "w-28" },
    { id: "input-resource", step: 25, width: "w-24" },
    { id: "input-skill", step: 2, width: "w-24" },
    { id: "input-mobility", step: 2, width: "w-24" },
    { id: "input-crit", step: 2, width: "w-24" }
  ]
};

Object.entries(ENGINES_CONFIG).forEach(([eng, inputs]) => {
  const filePath = path.join(eng, "index.html");
  let html = fs.readFileSync(filePath, "utf8");

  if (!html.includes(".glass-stepper-container")) {
    html = html.replace("</style>", cssSnippet + "\n  </style>");
  }

  if (!html.includes("function stepNumberInput")) {
    html = html.replace("function initScalingSuite()", jsSnippet + "\n    function initScalingSuite()");
  }

  inputs.forEach(({ id, step, width }) => {
    const regex = new RegExp("<input\\s+type=['\"]number['\"]\\s+id=['\"]" + id + "['\"][^>]*/>");
    const match = html.match(regex);
    if (match) {
      const oldTag = match[0];
      const minMatch = oldTag.match(/min=['"]([^'"]+)['"]/);
      const maxMatch = oldTag.match(/max=['"]([^'"]+)['"]/);
      const stepMatch = oldTag.match(/step=['"]([^'"]+)['"]/);
      const minAttr = minMatch ? (' min="' + minMatch[1] + '"') : "";
      const maxAttr = maxMatch ? (' max="' + maxMatch[1] + '"') : "";
      const stepAttr = stepMatch ? (' step="' + stepMatch[1] + '"') : (' step="' + step + '"');

      const replacement = `<div class="glass-stepper-container h-7 ${width}">
            <button type="button" class="glass-stepper-btn" onclick="stepNumberInput('${id}', -${step})">▼</button>
            <input type="number" id="${id}"${minAttr}${maxAttr}${stepAttr} class="glass-stepper-input font-bold" />
            <button type="button" class="glass-stepper-btn" onclick="stepNumberInput('${id}', ${step})">▲</button>
          </div>`;
      html = html.replace(oldTag, replacement);
      console.log("[" + eng + "] Upgraded " + id + " to glass-stepper ticker");
    } else {
      console.log("[" + eng + "] Could not find input tag for " + id);
    }
  });

  fs.writeFileSync(filePath, html);
  console.log("[" + eng + "] Saved successfully with Box'em up/down tickers");
});
