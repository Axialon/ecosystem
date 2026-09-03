/**
 * Blackboxes Visual Confirmation Runner using Puppeteer
 * Renders HTML pages, waits for Three.js WebGL frames, and saves high-res screenshots.
 */

const puppeteer = require('../Box_em/node_modules/puppeteer');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../.visual_confirmations');
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

async function capturePage(filePath, outputName, waitMs = 2500) {
  console.log(`[Visual Confirmation] Capturing: ${filePath}`);
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--ignore-gpu-blocklist']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  
  const fileUrl = `file://${path.resolve(filePath).replace(/\\/g, '/')}`;
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });

  // Wait for WebGL render & animation frame
  await new Promise(r => setTimeout(r, waitMs));

  const outPath = path.join(OUTPUT_DIR, outputName);
  await page.screenshot({ path: outPath, fullPage: false });
  console.log(`✔ Saved visual confirmation: ${outPath}`);

  await browser.close();
  return outPath;
}

async function recordInteractionReel(engineName, filePath, interactions) {
  console.log(`\n🎬 Recording Interaction Reel for: ${engineName}...`);
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--ignore-gpu-blocklist']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  
  const fileUrl = `file://${path.resolve(filePath).replace(/\\/g, '/')}`;
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));

  const reelDir = path.join(OUTPUT_DIR, 'interaction_reels');
  if (!fs.existsSync(reelDir)) fs.mkdirSync(reelDir, { recursive: true });

  const recordedFrames = [];

  for (let i = 0; i < interactions.length; i++) {
    const act = interactions[i];
    console.log(`  [Step ${i+1}/${interactions.length}] ${act.desc}`);
    
    const stateSnapshot = await page.evaluate(act.action);
    await new Promise(r => setTimeout(r, act.waitMs || 800));

    const frameFile = path.join(reelDir, `${engineName}_step_${i+1}_${act.slug}.png`);
    await page.screenshot({ path: frameFile, fullPage: false });
    recordedFrames.push({ step: i+1, desc: act.desc, file: frameFile, state: stateSnapshot });
    console.log(`  ✔ Captured Frame: ${path.basename(frameFile)}`);
  }

  await browser.close();
  return recordedFrames;
}

async function run() {
  const target = process.argv[2];
  if (target === '--reels') {
    const suites = [
      {
        name: "Orbit_em",
        path: "Orbit_em/index.html",
        interactions: [
          {
            slug: "01_baseline",
            desc: "Baseline Initial State (Budget: $450/mo, SLA: 99.9%, Compute: 40 vCPU)",
            action: () => ({ budget: state.monthlyBudget, sla: state.availabilitySla, compute: state.computeCapacity }),
            waitMs: 600
          },
          {
            slug: "02_high_budget_expansion",
            desc: "User Increases Monthly Budget to $25,000/mo (Reciprocal Compute, SLA, Security surge)",
            action: () => {
              const s = document.getElementById('slider-budget');
              s.value = 25000;
              s.dispatchEvent(new Event('input'));
              return { budget: state.monthlyBudget, sla: state.availabilitySla, compute: state.computeCapacity, latency: state.p99LatencyMs };
            },
            waitMs: 800
          },
          {
            slug: "03_ultra_low_latency",
            desc: "User Drags Latency to 5ms (Reciprocal Compute & Complexity expand, Budget adjusts)",
            action: () => {
              const s = document.getElementById('slider-latency');
              s.value = 5;
              s.dispatchEvent(new Event('input'));
              return { budget: state.monthlyBudget, latency: state.p99LatencyMs, compute: state.computeCapacity };
            },
            waitMs: 800
          }
        ]
      },
      {
        name: "Pulse_em",
        path: "Pulse_em/index.html",
        interactions: [
          {
            slug: "01_baseline",
            desc: "Baseline Initial State (TRIMP: 380, HRV: 85ms, Fuel: 100%)",
            action: () => ({ strain: state.trainingStrainTrimp, recovery: state.autonomicRecoveryHrv, fuel: state.metabolicFuelingPercent }),
            waitMs: 600
          },
          {
            slug: "02_extreme_strain_surge",
            desc: "User Spikes Training Strain to 950 TRIMP (Reciprocal Fuel demand spikes, Recovery tightens)",
            action: () => {
              const s = document.getElementById('slider-strain');
              s.value = 950;
              s.dispatchEvent(new Event('input'));
              return { strain: state.trainingStrainTrimp, recovery: state.autonomicRecoveryHrv, fuel: state.metabolicFuelingPercent, autophagy: state.autophagyScore };
            },
            waitMs: 800
          },
          {
            slug: "03_fasting_autophagy",
            desc: "User Pushes Autophagy Fasting Index to 140 (Reciprocal Fueling drops, Longevity climbs)",
            action: () => {
              const s = document.getElementById('slider-autophagy');
              s.value = 140;
              s.dispatchEvent(new Event('input'));
              return { autophagy: state.autophagyScore, fuel: state.metabolicFuelingPercent, longevity: state.longevityScore };
            },
            waitMs: 800
          }
        ]
      },
      {
        name: "Cap_em",
        path: "Cap_em/index.html",
        interactions: [
          {
            slug: "01_baseline",
            desc: "Baseline Pre-Seed (Founder: 80%, Raised: $750k, Post: $7.5M, Runway: 18 Mo)",
            action: () => ({ founder: state.founderEquityPercent, raised: state.capitalRaisedUsd, val: state.postMoneyValuationUsd }),
            waitMs: 600
          },
          {
            slug: "02_series_a_capital_surge",
            desc: "User Raises $12.5M Capital (Reciprocal Runway expands to 48 Mo, Founder dilutes to 62.5%)",
            action: () => {
              const s = document.getElementById('slider-capital');
              s.value = 12500000;
              s.dispatchEvent(new Event('input'));
              return { founder: state.founderEquityPercent, raised: state.capitalRaisedUsd, runway: state.runwayMonths };
            },
            waitMs: 800
          }
        ]
      },
      {
        name: "Synth_em",
        path: "Synth_em/index.html",
        interactions: [
          {
            slug: "01_baseline",
            desc: "Baseline Synth Patch (Drive: 75%, Cutoff: 1800Hz, Crest: 14dB)",
            action: () => ({ drive: state.harmonicDrivePercent, cutoff: state.vcfCutoffHz, crest: state.dynamicCrestDb }),
            waitMs: 600
          },
          {
            slug: "02_maximum_harmonic_drive",
            desc: "User Drives Harmonic Saturation to 98% (Reciprocal Crest compresses to 4.8dB, Cutoff brightens)",
            action: () => {
              const s = document.getElementById('slider-drive');
              s.value = 98;
              s.dispatchEvent(new Event('input'));
              return { drive: state.harmonicDrivePercent, crest: state.dynamicCrestDb, cutoff: state.vcfCutoffHz, width: state.stereoWidthPercent };
            },
            waitMs: 800
          }
        ]
      },
      {
        name: "Balanc_em",
        path: "Balanc_em/index.html",
        interactions: [
          {
            slug: "01_baseline",
            desc: "Baseline Knight Boss (DPS: 780, EHP: 18,500, APM: 90, Mobility: 35)",
            action: () => ({ dps: state.damagePerSecondDps, ehp: state.effectiveHealthPoolEhp, skill: state.skillCeilingApm }),
            waitMs: 600
          },
          {
            slug: "02_glass_cannon_burst",
            desc: "User Cranks DPS to 4,200 (Reciprocal Glass Cannon: EHP drops to 2,400, APM surges to 350)",
            action: () => {
              const s = document.getElementById('slider-dps');
              s.value = 4200;
              s.dispatchEvent(new Event('input'));
              return { dps: state.damagePerSecondDps, ehp: state.effectiveHealthPoolEhp, skill: state.skillCeilingApm, crit: state.critMultiplier };
            },
            waitMs: 800
          }
        ]
      }
    ];

    for (const suite of suites) {
      await recordInteractionReel(suite.name, suite.path, suite.interactions);
    }
  } else if (target) {
    await capturePage(target, `${path.basename(path.dirname(target))}_${path.basename(target, '.html')}.png`);
  } else {
    console.log('Usage: node scripts/capture_visuals.js <path-to-html> OR node scripts/capture_visuals.js --reels');
  }
}

if (require.main === module) {
  run().catch(err => {
    console.error('Error during capture:', err);
    process.exit(1);
  });
}

module.exports = { capturePage, recordInteractionReel };
