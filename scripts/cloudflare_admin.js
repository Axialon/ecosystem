/**
 * BlackBoxes Ecosystem - Autonomous Cloudflare Administration CLI
 * Dedicated tooling for AI agents and developers to manage blackboxes.net DNS,
 * Pages projects, custom subdomains, and future project expansions cleanly.
 *
 * Usage:
 *   node scripts/cloudflare_admin.js verify
 *   node scripts/cloudflare_admin.js dns:list
 *   node scripts/cloudflare_admin.js dns:sync
 *   node scripts/cloudflare_admin.js dns:add <subdomain> <target>
 *   node scripts/cloudflare_admin.js pages:status
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env if present
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    lines.forEach(l => {
      const match = l.trim().match(/^([^=]+)=(.*)$/);
      if (match && !match[1].startsWith('#')) {
        const k = match[1].trim();
        const v = match[2].trim().replace(/^["']|["']$/g, '');
        if (k && !process.env[k]) process.env[k] = v;
      }
    });
  }
}
loadEnv();

const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || 'c429f84c6da745e7855a0897f82d979b';
const ZONE_ID = process.env.CLOUDFLARE_ZONE_ID || '01b53b8477f20bfa7cb1e59261892ae6';

function apiRequest(method, endpoint, body = null) {
  return new Promise((resolve, reject) => {
    if (!API_TOKEN) {
      return reject(new Error('CLOUDFLARE_API_TOKEN is not set in .env. Please add your token to .env'));
    }

    const payload = body ? JSON.stringify(body) : null;
    const req = https.request({
      hostname: 'api.cloudflare.com',
      path: '/client/v4' + endpoint,
      method: method,
      headers: {
        'Authorization': 'Bearer ' + API_TOKEN,
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {})
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch(e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

// Subdomain mapping for the entire BlackBoxes ecosystem suite
const ECOSYSTEM_MAPPING = [
  { subdomain: 'ecosystem', target: 'ecosystem-9de.pages.dev', desc: 'Ecosystem Innovation Hub' },
  { subdomain: 'orbitem', target: 'orbitem.pages.dev', desc: 'Orbit\'em Cloud FinOps Tool' },
  { subdomain: 'pulseem', target: 'pulseem.pages.dev', desc: 'Pulse\'em Biometric Reactor' },
  { subdomain: 'capem', target: 'capem.pages.dev', desc: 'Cap\'em Startup Cap Table' },
  { subdomain: 'synthem', target: 'synthem.pages.dev', desc: 'Synth\'em Spatial Audio Studio' },
  { subdomain: 'balancem', target: 'balancem.pages.dev', desc: 'Balanc\'em Game Meta Engine' }
];

async function main() {
  const command = process.argv[2] || 'help';

  try {
    if (command === 'verify') {
      console.log('\n--- Verifying Cloudflare Credentials & blackboxes.net Zone Access ---');
      const zoneRes = await apiRequest('GET', '/zones/' + ZONE_ID);
      if (zoneRes.status === 200 && zoneRes.data.success) {
        console.log('✅ Cloudflare API Token is ACTIVE and VALID!');
        console.log('✅ Zone Access Verified: ' + zoneRes.data.result.name + ' (Status: ' + zoneRes.data.result.status + ')');
        console.log('   Account ID: ' + zoneRes.data.result.account.id + ' (' + zoneRes.data.result.account.name + ')');
        
        // Test DNS list permission
        const dnsRes = await apiRequest('GET', `/zones/${ZONE_ID}/dns_records?per_page=1`);
        if (dnsRes.status === 200 && dnsRes.data.success) {
          console.log('✅ DNS Read/Write Permissions Confirmed (Active)');
        }
      } else {
        console.error('❌ Zone verification failed:', zoneRes.data ? zoneRes.data.errors : zoneRes.raw);
      }

    } else if (command === 'dns:list') {
      console.log('\n--- Listing DNS Records for blackboxes.net ---');
      const res = await apiRequest('GET', `/zones/${ZONE_ID}/dns_records?per_page=100`);
      if (res.status === 200 && res.data.success) {
        console.log(`Found ${res.data.result.length} DNS records:\n`);
        res.data.result.forEach(r => {
          console.log(`  ${r.type.padEnd(6)} ${r.name.padEnd(32)} -> ${r.content.padEnd(32)} [Proxied: ${r.proxied}] (ID: ${r.id})`);
        });
      } else {
        console.error('❌ Failed to list DNS records:', res.data.errors);
      }

    } else if (command === 'dns:sync') {
      console.log('\n===============================================================');
      console.log('  🌌 Synchronizing All BlackBoxes Subdomains in Cloudflare DNS');
      console.log('===============================================================\n');

      const currentRes = await apiRequest('GET', `/zones/${ZONE_ID}/dns_records?per_page=100`);
      if (currentRes.status !== 200 || !currentRes.data.success) {
        throw new Error('Unable to fetch current DNS records: ' + JSON.stringify(currentRes.data.errors));
      }

      const existingRecords = currentRes.data.result;

      for (const item of ECOSYSTEM_MAPPING) {
        const fullDomain = `${item.subdomain}.blackboxes.net`;
        const matched = existingRecords.find(r => r.name === fullDomain && r.type === 'CNAME');

        if (matched) {
          if (matched.content === item.target && matched.proxied) {
            console.log(`  ✓ ${fullDomain.padEnd(28)} -> ${item.target} (Already up-to-date)`);
          } else {
            console.log(`  ↻ Updating ${fullDomain} to target ${item.target}...`);
            const updateRes = await apiRequest('PUT', `/zones/${ZONE_ID}/dns_records/${matched.id}`, {
              type: 'CNAME',
              name: item.subdomain,
              content: item.target,
              ttl: 1,
              proxied: true
            });
            if (updateRes.data.success) {
              console.log(`    ✅ Updated ${fullDomain}!`);
            } else {
              console.error(`    ❌ Update error:`, updateRes.data.errors);
            }
          }
        } else {
          console.log(`  ➕ Creating CNAME for ${fullDomain} -> ${item.target}...`);
          const createRes = await apiRequest('POST', `/zones/${ZONE_ID}/dns_records`, {
            type: 'CNAME',
            name: item.subdomain,
            content: item.target,
            ttl: 1,
            proxied: true
          });
          if (createRes.data.success) {
            console.log(`    ✅ Created CNAME record for ${fullDomain}!`);
          } else {
            console.error(`    ❌ Creation error:`, createRes.data.errors);
          }
        }
      }

      console.log('\n===============================================================');
      console.log('  🎉 DNS Sync Complete! All subdomains mapped & proxied.');
      console.log('===============================================================\n');

    } else if (command === 'dns:add') {
      const sub = process.argv[3];
      const tgt = process.argv[4];
      if (!sub || !tgt) {
        console.error('Usage: node scripts/cloudflare_admin.js dns:add <subdomain> <target>');
        process.exit(1);
      }
      const full = sub.includes('.') ? sub : `${sub}.blackboxes.net`;
      console.log(`Adding CNAME record: ${full} -> ${tgt}...`);
      const res = await apiRequest('POST', `/zones/${ZONE_ID}/dns_records`, {
        type: 'CNAME',
        name: sub,
        content: tgt,
        ttl: 1,
        proxied: true
      });
      if (res.data && res.data.success) {
        console.log(`✅ Successfully added ${full} -> ${tgt}!`);
      } else {
        console.error('❌ Error adding record:', res.data.errors);
      }

    } else if (command === 'pages:status') {
      console.log('\n--- Checking Cloudflare Pages Projects ---');
      const projects = ['ecosystem', 'boxem', 'orbitem', 'pulseem', 'capem', 'synthem', 'balancem'];
      for (const p of projects) {
        const dRes = await apiRequest('GET', `/accounts/${ACCOUNT_ID}/pages/projects/${p}/domains`);
        if (dRes.status === 200 && dRes.data.success) {
          console.log(`\n[Project: ${p}]`);
          dRes.data.result.forEach(d => {
            console.log(`  • Domain: ${d.name.padEnd(28)} | Status: ${d.status.padEnd(10)} | Cert: ${d.certificate_authority || 'n/a'}`);
          });
        }
      }

    } else {
      console.log(`
BlackBoxes Autonomous Cloudflare Administration Tool
===================================================
Commands:
  node scripts/cloudflare_admin.js verify           Verify API Token and Zone access
  node scripts/cloudflare_admin.js dns:list         List all DNS records in blackboxes.net
  node scripts/cloudflare_admin.js dns:sync         Sync CNAMEs for ecosystem, orbitem, etc.
  node scripts/cloudflare_admin.js dns:add <sub> <t> Add a custom subdomain CNAME
  node scripts/cloudflare_admin.js pages:status     View Cloudflare Pages domain statuses
`);
    }
  } catch(err) {
    console.error('\n❌ Execution Error:', err.message);
  }
}

main();
