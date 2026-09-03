/**
 * Blackboxes Ecosystem - Local Unified Development Server
 * Serves the Ecosystem Hub and all 6 engines (Box'em, Orbit'em, Pulse'em, Cap'em, Synth'em, Balanc'em)
 * with clean path aliases, 3D glTF model delivery, and live pool synchronization.
 */

const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const PORT = process.env.PORT || 8080;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".glb": "model/gltf-binary",
  ".gltf": "model/gltf+json",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon"
};

const ALIAS_MAP = {
  "/boxem": "/Box_em/index.html",
  "/boxem/": "/Box_em/index.html",
  "/boxem/showcase": "/Box_em/showcase.html",
  "/orbitem": "/Orbit_em/index.html",
  "/orbitem/": "/Orbit_em/index.html",
  "/orbitem/showcase": "/Orbit_em/showcase.html",
  "/pulseem": "/Pulse_em/index.html",
  "/pulseem/": "/Pulse_em/index.html",
  "/pulseem/showcase": "/Pulse_em/showcase.html",
  "/capem": "/Cap_em/index.html",
  "/capem/": "/Cap_em/index.html",
  "/capem/showcase": "/Cap_em/showcase.html",
  "/synthem": "/Synth_em/index.html",
  "/synthem/": "/Synth_em/index.html",
  "/synthem/showcase": "/Synth_em/showcase.html",
  "/balancem": "/Balanc_em/index.html",
  "/balancem/": "/Balanc_em/index.html",
  "/balancem/showcase": "/Balanc_em/showcase.html"
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  if (ALIAS_MAP[pathname]) {
    pathname = ALIAS_MAP[pathname];
  }

  if (pathname === "/") {
    pathname = "/index.html";
  }

  let filePath = path.join(__dirname, pathname);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }

  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    return res.end("404 Not Found: " + pathname);
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";

  const stream = fs.createReadStream(filePath);
  res.writeHead(200, { "Content-Type": contentType });
  stream.pipe(res);
});

server.listen(PORT, () => {
  console.log("\n===============================================================");
  console.log("  🌌 BlackBoxes Ecosystem Server Running at http://localhost:" + PORT);
  console.log("===============================================================");
  console.log("  • Ecosystem Hub:    http://localhost:" + PORT + "/");
  console.log("  • Box'em Engine:    http://localhost:" + PORT + "/boxem");
  console.log("  • Orbit'em Engine:  http://localhost:" + PORT + "/orbitem");
  console.log("  • Pulse'em Engine:  http://localhost:" + PORT + "/pulseem");
  console.log("  • Cap'em Engine:    http://localhost:" + PORT + "/capem");
  console.log("  • Synth'em Engine:  http://localhost:" + PORT + "/synthem");
  console.log("  • Balanc'em Engine: http://localhost:" + PORT + "/balancem");
  console.log("===============================================================\n");
});

module.exports = server;
