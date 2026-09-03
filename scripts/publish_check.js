const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const ENGINES = ['Box_em', 'Orbit_em', 'Pulse_em', 'Cap_em', 'Synth_em', 'Balanc_em'];
console.log('=== Running Pre-Publish Readiness Checks ===');
let passed = true;
function check(label, ok, err) {
  if (ok) console.log('  [PASS] ' + label);
  else { console.error('  [FAIL] ' + label + ': ' + err); passed = false; }
}
check('Root index.html', fs.existsSync(path.join(ROOT, 'index.html')), 'Missing');
check('Root _headers', fs.existsSync(path.join(ROOT, '_headers')), 'Missing');
check('Root _redirects', fs.existsSync(path.join(ROOT, '_redirects')), 'Missing');
check('Root wrangler.toml', fs.existsSync(path.join(ROOT, 'wrangler.toml')), 'Missing');
check('Root favicon.svg', fs.existsSync(path.join(ROOT, 'favicon.svg')), 'Missing');
ENGINES.forEach(eng => {
  const p = rel => path.join(ROOT, eng, rel);
  check(eng + ' index.html', fs.existsSync(p('index.html')), 'Missing');
  check(eng + ' showcase.html', fs.existsSync(p('showcase.html')), 'Missing');
  check(eng + ' _headers', fs.existsSync(p('_headers')), 'Missing');
  check(eng + ' _redirects', fs.existsSync(p('_redirects')), 'Missing');
  check(eng + ' favicon.svg', fs.existsSync(p('favicon.svg')), 'Missing');
  check(eng + ' server.js', fs.existsSync(p('server.js')), 'Missing');
  const html = fs.readFileSync(p('index.html'), 'utf8');
  check(eng + ' API', html.includes('window.blackboxesAPI'), 'Missing blackboxesAPI');
  check(eng + ' Scaling', html.includes('cardScale =') || html.includes('state.nodeModelsScale'), 'Missing scaling');
  check(eng + ' Escape dismiss', html.includes('modal-config') && html.includes('Escape'), 'Missing Escape handler');
});
if (passed) { console.log('ALL CHECKS PASSED - 100% READY TO PUBLISH'); process.exit(0); }
else { console.error('CHECKS FAILED'); process.exit(1); }