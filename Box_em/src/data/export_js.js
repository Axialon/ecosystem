const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, 'professions.json');
const jsPath = path.join(__dirname, 'professions.js');

const raw = fs.readFileSync(jsonPath, 'utf8');
const jsContent = `/**
 * Blackboxes Box'em - 225 Researched Professions Library
 * Auto-generated dataset with verified rates, timelines, deliverables, and quality thresholds.
 */
window.BOXEM_PROFESSIONS = ${raw};
`;

fs.writeFileSync(jsPath, jsContent);
console.log(`✔ Generated window.BOXEM_PROFESSIONS in: ${jsPath} (${(fs.statSync(jsPath).size / 1024).toFixed(1)} KB)`);
