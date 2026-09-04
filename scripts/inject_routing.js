
const fs = require("fs");
const path = require("path");

const routingFunction = `
    // Smart Ecosystem Routing & Cumulative Pool Sync (Box'em Standard)
    function initEcosystemIntegration() {
      const host = window.location.hostname;
      
      const isBlackboxesNet = host.endsWith("blackboxes.net");
      const isLiveWeb = window.location.protocol.startsWith("http") && !host.includes("localhost") && !host.includes("127.0.0.1");

      if (isLiveWeb) {
        document.querySelectorAll(".ecosystem-link").forEach(a => {
          const target = a.dataset.target;
          if (target) {
            if (isBlackboxesNet) {
              a.href = "https://" + (target === "ecosystem" ? "ecosystem" : target) + ".blackboxes.net/";
            } else {
              const pagesDevMap = {
                ecosystem: "https://ecosystem-9de.pages.dev/",
                boxem: "https://boxem.blackboxes.net/",
                orbitem: "https://orbitem.pages.dev/",
                pulseem: "https://pulseem.pages.dev/",
                capem: "https://capem.pages.dev/",
                synthem: "https://synthem.pages.dev/",
                balancem: "https://balancem.pages.dev/"
              };
              if (pagesDevMap[target]) a.href = pagesDevMap[target];
            }
          }
        });
      }

      const poolEl = document.getElementById("ecosystem-pool-display") || document.getElementById("root-pool-badge");
      if (poolEl) {
        try {
          const stored = localStorage.getItem("blackboxes_cumulative_donation_pool");
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed && typeof parsed.totalUsd === "number") {
              const count = parsed.backerCount || parsed.backersCount || 2;
              poolEl.textContent = "Live Cumulative Pool: $" + Math.round(parsed.totalUsd).toLocaleString() + " USD • " + count + " Backers";
            }
          }
        } catch(e) {}
      }
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initEcosystemIntegration);
    } else {
      initEcosystemIntegration();
    }
`;

const ENGINES = ["Box_em", "Orbit_em", "Pulse_em", "Cap_em", "Synth_em", "Balanc_em"];

ENGINES.forEach(eng => {
  const p = path.join(eng, "index.html");
  let html = fs.readFileSync(p, "utf8");

  // Remove any misplaced script outside body
  html = html.replace(/\/\/ Smart Ecosystem Routing[\s\S]*?<\/body>/, "</body>");

  if (!html.includes("function initEcosystemIntegration")) {
    html = html.replace("</script>", routingFunction + "\n  </script>");
  }

  fs.writeFileSync(p, html);
  console.log("[" + eng + "] Injected clean ecosystem routing inside script tag");
});

// Root index.html
let rootHtml = fs.readFileSync("index.html", "utf8");
ENGINES.forEach(eng => {
  const id = eng.toLowerCase().replace("_", "");
  const targetTag = '<a href="' + eng + '/index.html"';
  const replacementTag = '<a href="' + eng + '/index.html" class="ecosystem-link" data-target="' + id + '"';
  rootHtml = rootHtml.split(targetTag).join(replacementTag);
});

if (!rootHtml.includes("function initEcosystemIntegration")) {
  rootHtml = rootHtml.replace("</body>", "<script>" + routingFunction + "</script>\n</body>");
}
fs.writeFileSync("index.html", rootHtml);
console.log("[Root Hub] Updated index.html with live ecosystem-link routing");
