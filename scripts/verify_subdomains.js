/**
 * Continuous Subdomain DNS & HTTP Status Checker
 * Run: node scripts/verify_subdomains.js
 */
const { Resolver } = require("dns");
const https = require("https");

const resolver = new Resolver();
resolver.setServers(["1.1.1.1", "8.8.8.8"]);

const SUBDOMAINS = [
  "boxem.blackboxes.net",
  "ecosystem.blackboxes.net",
  "orbitem.blackboxes.net",
  "pulseem.blackboxes.net",
  "capem.blackboxes.net",
  "synthem.blackboxes.net",
  "balancem.blackboxes.net"
];

console.log("Checking DNS resolution for all BlackBoxes subdomains...");

SUBDOMAINS.forEach(domain => {
  resolver.resolve4(domain, (err, ips) => {
    if (err) {
      console.log(`  ❌ ${domain.padEnd(28)} => ${err.code} (Pending DNS record)`);
    } else {
      console.log(`  ✅ ${domain.padEnd(28)} => ${ips.join(", ")}`);
      // Test HTTP
      https.get("https://" + domain, res => {
        console.log(`     ↳ HTTP ${res.statusCode} from ${domain}`);
      }).on("error", e => {
        console.log(`     ↳ HTTPS error: ${e.message}`);
      });
    }
  });
});
