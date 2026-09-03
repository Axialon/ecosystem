const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

// Extract all element IDs queried by getElementById
const getElemRegex = /document\.getElementById\(['"]([^'"]+)['"]\)/g;
let match;
const queriedIds = new Set();
while ((match = getElemRegex.exec(html)) !== null) {
  queriedIds.add(match[1]);
}

console.log(`Checking ${queriedIds.size} queried element IDs in index.html...`);

const missingIds = [];
for (const id of queriedIds) {
  const idPattern = new RegExp(`id=["']${id}["']`);
  if (!idPattern.test(html)) {
    missingIds.push(id);
  }
}

if (missingIds.length > 0) {
  console.error('MISSING IDs FOUND IN HTML:', missingIds);
  process.exit(1);
} else {
  console.log('✔ All getElementById targets exist in DOM!');
}

// Check all querySelector targets
const querySelectorRegex = /document\.querySelectorAll?\(['"]([^'"]+)['"]\)/g;
const queriedSelectors = new Set();
while ((match = querySelectorRegex.exec(html)) !== null) {
  queriedSelectors.add(match[1]);
}

console.log('Queried Selectors:', Array.from(queriedSelectors));
