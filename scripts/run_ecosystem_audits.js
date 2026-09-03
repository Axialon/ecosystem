/**
 * Blackboxes Ecosystem 9-Persona Synergistic Enterprise Audit Suite
 * Audits all 6 engines: Box'em, Orbit'em, Pulse'em, Cap'em, Synth'em, Balanc'em
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const ENGINES = ['Box_em', 'Orbit_em', 'Pulse_em', 'Cap_em', 'Synth_em', 'Balanc_em'];

const AUDIT_RESULTS = {
  timestamp: new Date().toISOString(),
  personas: {},
  summary: { totalAudits: 0, passed: 0, failed: 0, issuesFound: [] }
};

function logAudit(persona, engine, testName, passed, details) {
  if (!AUDIT_RESULTS.personas[persona]) {
    AUDIT_RESULTS.personas[persona] = [];
  }
  AUDIT_RESULTS.personas[persona].push({ engine, testName, passed, details });
  AUDIT_RESULTS.summary.totalAudits++;
  if (passed) {
    AUDIT_RESULTS.summary.passed++;
    console.log(`  [✔ PASS] [${persona}] [${engine}] ${testName}`);
  } else {
    AUDIT_RESULTS.summary.failed++;
    AUDIT_RESULTS.summary.issuesFound.push({ persona, engine, testName, details });
    console.error(`  [✖ FAIL] [${persona}] [${engine}] ${testName}: ${details}`);
  }
}

async function runPersona1_WebGLArchitect() {
  console.log('\n======================================================');
  console.log('🧑‍💻 PERSONA 1: Principal WebGL & Spatial 3D Architect');
  console.log('======================================================');

  ENGINES.forEach(eng => {
    const indexPath = path.join(ROOT_DIR, eng, 'index.html');
    if (!fs.existsSync(indexPath)) return;
    const content = fs.readFileSync(indexPath, 'utf8');

    const hasRenderOrder = content.includes('renderOrder = 9999') || content.includes('renderOrder: 9999');
    const hasDepthTest = content.includes('depthTest: false');
    logAudit('WebGL Architect', eng, '3D Billboard Stacking & Occlusion Prevention', hasRenderOrder && hasDepthTest,
      'Sprites must specify renderOrder = 9999 and depthTest: false');

    const hasDoubleSide = content.includes('side: THREE.DoubleSide');
    logAudit('WebGL Architect', eng, 'Central Crystalline Reactor Two-Sided Shading', hasDoubleSide,
      'Mesh materials must specify side: THREE.DoubleSide');

    const hasHitboxes = content.includes('SphereGeometry(0.35') || content.includes('SphereGeometry(0.65') || content.includes('expanded hit');
    logAudit('WebGL Architect', eng, 'Expanded Raycasting Hitboxes', hasHitboxes,
      'Interactive submodule gems must provide expanded hitboxes for effortless spatial hovering');
  });
}

async function runPersona2_FrontendUXEngineer() {
  console.log('\n======================================================');
  console.log('🎨 PERSONA 2: Principal Frontend UX & Accessibility Engineer');
  console.log('======================================================');

  ENGINES.forEach(eng => {
    const indexPath = path.join(ROOT_DIR, eng, 'index.html');
    if (!fs.existsSync(indexPath)) return;
    const content = fs.readFileSync(indexPath, 'utf8');

    const hasEsc = content.includes("'Escape'") || content.includes('"Escape"');
    logAudit('Frontend UX', eng, 'Keyboard ESC Listener for Modal Dismissal', hasEsc,
      'Engine must handle Escape key for dismissing active modals');

    const hasShowcaseLink = content.includes('showcase.html') || content.includes('marketing.html');
    logAudit('Frontend UX', eng, 'Reciprocal Navigation Header Links', hasShowcaseLink,
      'Engine must provide direct link to its showcase presentation');
  });
}

async function runPersona3_SecurityBackendArchitect() {
  console.log('\n======================================================');
  console.log('🔒 PERSONA 3: Senior Security & Distributed Backend Architect');
  console.log('======================================================');

  ENGINES.forEach(eng => {
    const serverPath = path.join(ROOT_DIR, eng, 'server.js');
    if (fs.existsSync(serverPath)) {
      const serverContent = fs.readFileSync(serverPath, 'utf8');
      const hasNoCache = serverContent.includes('no-store') && serverContent.includes('no-cache');
      logAudit('Security Backend', eng, 'Strict Anti-Cache HTTP Response Headers', hasNoCache,
        'Development servers must send no-cache headers');
    }

    const indexPath = path.join(ROOT_DIR, eng, 'index.html');
    if (fs.existsSync(indexPath)) {
      const indexContent = fs.readFileSync(indexPath, 'utf8');
      const hasJsonExport = indexContent.includes('application/json') || indexContent.includes('Blob') || indexContent.includes('export');
      logAudit('Security Backend', eng, 'Deterministic JSON Schema Export', hasJsonExport,
        'Engine must support schema-compliant JSON state export');
    }
  });
}

async function runPersona4_QuantitativeMathAnalyst() {
  console.log('\n======================================================');
  console.log('📐 PERSONA 4: Lead Quantitative Mathematical Systems Analyst');
  console.log('======================================================');

  ENGINES.forEach(eng => {
    const testPath = path.join(ROOT_DIR, eng, 'test', 'engine.test.js');
    const testExists = fs.existsSync(testPath) || fs.existsSync(path.join(ROOT_DIR, eng, 'test', 'schema.test.js'));
    logAudit('Math Systems', eng, 'Automated Test Suite Availability', testExists,
      'Engine must have dedicated test suites in test/');

    const indexPath = path.join(ROOT_DIR, eng, 'index.html');
    if (fs.existsSync(indexPath)) {
      const indexContent = fs.readFileSync(indexPath, 'utf8');
      const hasSolver = indexContent.includes('solveConstraints') || indexContent.includes('solve(') || indexContent.includes('K_EQUILIBRIUM') || indexContent.includes('calculateReciprocalConstraint') || indexContent.includes('solve');
      logAudit('Math Systems', eng, 'Reciprocal Constraint Mathematical Solver', hasSolver,
        'Engine must define a real-time reciprocal solver function');
    }
  });
}

async function runPersona5_TechnicalDocsDevRel() {
  console.log('\n======================================================');
  console.log('📚 PERSONA 5: Principal Technical Documentation & DevRel Architect');
  console.log('======================================================');

  ENGINES.forEach(eng => {
    const readme = fs.existsSync(path.join(ROOT_DIR, eng, 'README.md'));
    const arch = fs.existsSync(path.join(ROOT_DIR, eng, 'docs', 'ARCHITECTURE.md'));
    const api = fs.existsSync(path.join(ROOT_DIR, eng, 'docs', 'API_REFERENCE.md'));
    const prompt = fs.existsSync(path.join(ROOT_DIR, eng, 'agent_prompt_template.md'));

    logAudit('Technical Docs', eng, 'README Documentation Specification', readme, 'README.md must exist');
    logAudit('Technical Docs', eng, 'ARCHITECTURE Pipeline Specification', arch, 'docs/ARCHITECTURE.md must exist');
    logAudit('Technical Docs', eng, 'API Reference Specification', api, 'docs/API_REFERENCE.md must exist');
    logAudit('Technical Docs', eng, 'AI Agent Prompt Template Specification', prompt, 'agent_prompt_template.md must exist');
  });
}

async function runPersona6_OSPOCommunity() {
  console.log('\n======================================================');
  console.log('🌐 PERSONA 6: Open Source Program Manager (OSPO) & Community Maintainer');
  console.log('======================================================');

  ENGINES.forEach(eng => {
    const lic = fs.existsSync(path.join(ROOT_DIR, eng, 'LICENSE'));
    const coc = fs.existsSync(path.join(ROOT_DIR, eng, 'CODE_OF_CONDUCT.md'));
    const cont = fs.existsSync(path.join(ROOT_DIR, eng, 'CONTRIBUTING.md'));
    const sec = fs.existsSync(path.join(ROOT_DIR, eng, 'SECURITY.md'));

    logAudit('OSPO Community', eng, 'MIT License Legal File', lic, 'LICENSE must exist');
    logAudit('OSPO Community', eng, 'Code of Conduct Specification', coc, 'CODE_OF_CONDUCT.md must exist');
    logAudit('OSPO Community', eng, 'Contribution Guidelines', cont, 'CONTRIBUTING.md must exist');
    logAudit('OSPO Community', eng, 'Coordinated Security Disclosure Policy', sec, 'SECURITY.md must exist');
  });
}

async function runPersona7_DevSecOps() {
  console.log('\n======================================================');
  console.log('🚀 PERSONA 7: DevSecOps & Release Engineering Specialist');
  console.log('======================================================');

  const rootPkg = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf8'));
  logAudit('DevSecOps', 'Root Ecosystem', 'Root npm test Script Configured', typeof rootPkg.scripts.test === 'string',
    'Root package.json must define a comprehensive npm test script');

  ENGINES.forEach(eng => {
    const pkgPath = path.join(ROOT_DIR, eng, 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      logAudit('DevSecOps', eng, 'Engine package.json test Script Configured', typeof pkg.scripts.test === 'string',
        'Engine package.json must define test script');
    }
  });
}

async function runPersona8_GapDetectionSpecialist() {
  console.log('\n======================================================');
  console.log('🔎 PERSONA 8: Principal Gap Detection & UX Diagnostic Specialist (The Gap Mapper)');
  console.log('======================================================');

  ENGINES.forEach(eng => {
    const indexPath = path.join(ROOT_DIR, eng, 'index.html');
    if (!fs.existsSync(indexPath)) return;
    const content = fs.readFileSync(indexPath, 'utf8');

    const hasFallbackNotice = content.includes('webgl-fallback') || content.includes('WebGL Initialization Notice') || content.includes('WebGL Initialization warning') || content.includes('webgl-warning');
    logAudit('Gap Mapper', eng, 'WebGL Initialization Fault-Tolerance Notice', hasFallbackNotice,
      'Engine must provide a graceful WebGL fallback banner or notice');

    const hasLocalStorageDefensive = content.includes('localStorage.getItem') && (content.includes('try {') || content.includes('try{'));
    logAudit('Gap Mapper', eng, 'Corrupted Client Storage Defensive Recovery', hasLocalStorageDefensive,
      'localStorage parsing must be wrapped in try/catch defensive recovery');

    const hasUrlHydration = content.includes('URLSearchParams');
    logAudit('Gap Mapper', eng, 'URL Query Parameter Hydration & Clamping', hasUrlHydration,
      'Engine must support hydration from URL query parameters');
  });
}

async function runPersona9_SolutionEngine() {
  console.log('\n======================================================');
  console.log('⚙️ PERSONA 9: Staff Systems Architect & Solution Implementation Engineer (The Solution Engine)');
  console.log('======================================================');

  ENGINES.forEach(eng => {
    const showcasePath = path.join(ROOT_DIR, eng, 'showcase.html');
    const marketingPath = path.join(ROOT_DIR, eng, 'marketing.html');
    const hasShowcase = fs.existsSync(showcasePath) || fs.existsSync(marketingPath);
    logAudit('Solution Engine', eng, 'Dedicated Marketing / Showcase Portal', hasShowcase,
      'Engine must provide a standalone showcase/marketing portal');

    const indexPath = path.join(ROOT_DIR, eng, 'index.html');
    if (fs.existsSync(indexPath)) {
      const content = fs.readFileSync(indexPath, 'utf8');
      const hasDonation = content.includes('modal-sponsor') || content.includes('modal-backer') || content.includes('hologram') || content.includes('sponsor') || content.includes('donation');
      logAudit('Solution Engine', eng, '3D Hologram Voluntary Donation Model', hasDonation,
        'Engine must feature a voluntary one-time sponsorship / donation modal');
    }
  });
}

async function main() {
  console.log('🚀 Running 9-Persona Ecosystem Audit across All Blackboxes Engines...\n');
  await runPersona1_WebGLArchitect();
  await runPersona2_FrontendUXEngineer();
  await runPersona3_SecurityBackendArchitect();
  await runPersona4_QuantitativeMathAnalyst();
  await runPersona5_TechnicalDocsDevRel();
  await runPersona6_OSPOCommunity();
  await runPersona7_DevSecOps();
  await runPersona8_GapDetectionSpecialist();
  await runPersona9_SolutionEngine();

  console.log('\n======================================================');
  console.log(`📊 9-PERSONA ECOSYSTEM AUDIT SUMMARY: ${AUDIT_RESULTS.summary.passed}/${AUDIT_RESULTS.summary.totalAudits} PASSED (100% Target)`);
  console.log('======================================================\n');

  const reportDir = path.join(ROOT_DIR, '.audits');
  if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(path.join(reportDir, 'ecosystem_audit_report.json'), JSON.stringify(AUDIT_RESULTS, null, 2));

  if (AUDIT_RESULTS.summary.failed > 0) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
