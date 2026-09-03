/**
 * BlackBoxes Ecosystem Unified Management CLI
 * Usage:
 *   node scripts/manage.js dev           - Start local unified server (port 8080)
 *   node scripts/manage.js test          - Run test suite across all 6 engines
 *   node scripts/manage.js status        - Show git & deployment status of all projects
 *   node scripts/manage.js sync          - Stage, commit, and push all projects to GitHub
 *   node scripts/manage.js deploy <proj> - Deploy project to Cloudflare Pages (e.g. ecosystem, boxem, all)
 *   node scripts/manage.js login         - Authenticate Wrangler with Cloudflare
 */

const { execSync, spawn } = require("child_process");
const path = require("path");

const ENGINES = [
  { id: "Box_em", subdomain: "boxem", project: "boxem" },
  { id: "Orbit_em", subdomain: "orbitem", project: "orbitem" },
  { id: "Pulse_em", subdomain: "pulseem", project: "pulseem" },
  { id: "Cap_em", subdomain: "capem", project: "capem" },
  { id: "Synth_em", subdomain: "synthem", project: "synthem" },
  { id: "Balanc_em", subdomain: "balancem", project: "balancem" }
];

const action = process.argv[2] || "help";
const target = process.argv[3];

function run(cmd, cwd = process.cwd()) {
  try {
    return execSync(cmd, { cwd, encoding: "utf8", stdio: "inherit" });
  } catch(e) {
    return null;
  }
}

if (action === "dev" || action === "start") {
  console.log("Starting unified BlackBoxes Ecosystem Server...");
  require("../server.js");
} else if (action === "test") {
  console.log("Running comprehensive ecosystem tests...");
  run("npm test");
} else if (action === "status") {
  console.log("\n================ BLACKBOXES ECOSYSTEM STATUS ================\n");
  console.log("Apex Domain: blackboxes.net (Untouched / empty)\n");
  console.log("Projects & Subdomains:");
  console.log("  [ecosystem]  https://ecosystem.blackboxes.net  (Root Hub)");
  ENGINES.forEach(eng => {
    console.log("  [" + eng.subdomain.padEnd(9) + "]  https://" + eng.subdomain + ".blackboxes.net  (" + eng.id + ")");
  });
  console.log("\nLocal Git Monorepo Status:");
  run("git status -s");
} else if (action === "sync") {
  const msg = target || "feat(sync): update BlackBoxes ecosystem suite";
  console.log("Synchronizing changes across all engines and pushing to GitHub...");
  ENGINES.forEach(eng => {
    const dir = path.resolve(__dirname, "..", eng.id);
    console.log("Syncing " + eng.id + "...");
    try {
      execSync("git add .", { cwd: dir, stdio: "pipe" });
      try { execSync(`git commit -m "${msg}"`, { cwd: dir, stdio: "pipe" }); } catch(e) {}
      execSync("git push origin main", { cwd: dir, stdio: "pipe" });
      console.log("  ✓ " + eng.id + " pushed to Axialon/" + eng.id);
    } catch(e) {
      console.log("  ✗ " + eng.id + " sync error: " + e.message);
    }
  });

  console.log("Syncing root ecosystem monorepo...");
  try {
    execSync("git add .", { stdio: "pipe" });
    try { execSync(`git commit -m "${msg}"`, { stdio: "pipe" }); } catch(e) {}
    execSync("git push origin main", { stdio: "pipe" });
    console.log("  ✓ Root monorepo pushed to Axialon/ecosystem");
  } catch(e) {
    console.log("  ✗ Root sync error: " + e.message);
  }
  console.log("\n✓ Sync complete!");
} else if (action === "deploy") {
  const proj = target || "ecosystem";
  if (proj === "all") {
    console.log("Deploying all projects to Cloudflare Pages...");
    ENGINES.forEach(eng => {
      console.log("\nDeploying " + eng.id + " -> " + eng.subdomain + ".blackboxes.net ...");
      run("npx wrangler pages deploy " + eng.id + " --project-name=" + eng.project + " --branch=main");
    });
    console.log("\nDeploying Ecosystem Hub -> ecosystem.blackboxes.net ...");
    run("npx wrangler pages deploy . --project-name=ecosystem --branch=main");
  } else {
    const matched = ENGINES.find(e => e.subdomain === proj || e.id.toLowerCase() === proj.toLowerCase());
    if (matched) {
      console.log("Deploying " + matched.id + " to Cloudflare Pages (project: " + matched.project + ")...");
      run("npx wrangler pages deploy " + matched.id + " --project-name=" + matched.project + " --branch=main");
    } else if (proj === "ecosystem" || proj === "hub") {
      console.log("Deploying Ecosystem Hub to Cloudflare Pages...");
      run("npx wrangler pages deploy . --project-name=ecosystem --branch=main");
    } else {
      console.error("Unknown project: " + proj + ". Valid options: ecosystem, boxem, orbitem, pulseem, capem, synthem, balancem, all");
    }
  }
} else if (action === "login" || action === "auth") {
  console.log("Starting interactive Wrangler authentication...");
  console.log("This will open your browser at dash.cloudflare.com for you to click 'Allow'.");
  run("npx wrangler login");
} else {
  console.log(`
BlackBoxes Management CLI
=========================
Commands:
  node scripts/manage.js dev           Start unified local server at http://localhost:8080
  node scripts/manage.js test          Run test suites across all 6 engines
  node scripts/manage.js status        Show deployment & subdomain status
  node scripts/manage.js sync          Push all changes to GitHub (root + all engines)
  node scripts/manage.js deploy <name> Deploy to Cloudflare Pages (e.g. ecosystem, boxem, all)
  node scripts/manage.js login         Log into Cloudflare via Wrangler OAuth
`);
}
