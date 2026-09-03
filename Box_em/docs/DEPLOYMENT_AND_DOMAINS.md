# Cloudflare & GitHub Deployment Guide: Domains Architecture

This guide outlines the production deployment setup for **Blackboxes • Box'em** across **`boxem.blackboxes.net`** and **`blackboxes.dev`**.

---

## 🌐 1. Domain Routing Architecture

```
                                  [ INCOMING TRAFFIC ]
                                         |
                                         v
                         +-------------------------------+
                         |   Cloudflare Global Edge DNS  |
                         +-------------------------------+
                                  /             \\
                                 /               \\
            [boxem.blackboxes.net]               [blackboxes.dev]
                     |                                  |
                     v                                  v
      +-----------------------------+     +-----------------------------+
      |  Cloudflare Pages: Box'em   |     |  Cloudflare Pages / Worker  |
      |  - Root / -> index.html     |     |  - Root / -> showcase.html  |
      |  - /showcase -> showcase.html|    |  - /boxem -> Redirects to   |
      |  - /models/* -> 3D Assets   |     |    boxem.blackboxes.net     |
      |  - /api/model -> REST API   |     +-----------------------------+
      |  - /api/donations -> Edge D1|
      +-----------------------------+
```

---

## 🚀 2. Option A (Recommended): Cloudflare Pages with Git Integration

Cloudflare Pages provides zero-configuration Git-connected hosting with instant edge CDN distribution, global caching for 3D binary `.glb` models, and custom domains with free SSL/TLS certificates.

### Step 1: Connect GitHub Repository to Cloudflare Pages
1. Log into your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigate to **Workers & Pages** -> **Create Application** -> **Pages** -> **Connect to Git**.
3. Select your GitHub repository: `blackboxes/boxem` (or your private/public repository).
4. Configure Build Settings:
   * **Project Name**: `boxem`
   * **Production Branch**: `main`
   * **Framework Preset**: `None` (Static HTML / Offline-First)
   * **Build Command**: *(Leave empty - Zero build step required)*
   * **Build Output Directory**: `.` (Root directory)
5. Click **Save and Deploy**.

---

### Step 2: Configure Custom Domain: `boxem.blackboxes.net`
1. In Cloudflare Pages project settings, go to **Custom Domains** -> **Set up a custom domain**.
2. Enter `boxem.blackboxes.net` and click **Continue**.
3. Cloudflare will automatically configure the CNAME DNS record:
   * **Type**: `CNAME`
   * **Name**: `boxem`
   * **Target**: `boxem.pages.dev`
   * **Proxy Status**: `Proxied (Orange Cloud)`

---

### Step 3: Configure Apex / Hub Domain: `blackboxes.dev`
You can configure `blackboxes.dev` in one of two ways:

#### Choice 1: `blackboxes.dev` serves the Interactive 3D Showcase & Matrix Explorer
1. In your Cloudflare Pages project, add `blackboxes.dev` (or `www.blackboxes.dev`) as a secondary custom domain.
2. In Cloudflare Page Rules / Transform Rules:
   * Rewrite `/` on `blackboxes.dev` to `/showcase.html` (or link to `boxem.blackboxes.net`).

#### Choice 2: Bulk Redirect to Subdomain
* Create a Cloudflare Redirect Rule:
  * **When incoming request matches**: `http.host eq "blackboxes.dev"`
  * **Redirect to**: `https://boxem.blackboxes.net` (Status: 301 Permanent Redirect)

---

## ⚡ 3. Edge Worker & Live D1 Database Deployment

For the live voluntary sponsor ticker and HMAC webhook verification:

1. **Create Cloudflare D1 Database**:
   ```bash
   npx wrangler d1 create boxem-db
   ```

2. **Initialize Relational Schema**:
   ```bash
   npx wrangler d1 execute boxem-db --file=workers/schema.sql
   ```

3. **Set Webhook Secret**:
   ```bash
   npx wrangler secret put HMAC_SECRET
   ```

4. **Deploy Edge Worker**:
   ```bash
   npx wrangler deploy
   ```

---

## 🛡️ 4. Clean Route Rewrites & Caching Headers

This repository includes pre-configured edge routing files:
* **[`_redirects`](_redirects)**:
  * Rewrites `/showcase`, `/explore`, and `/overview` cleanly to `showcase.html`.
  * Redirects legacy `/marketing` cleanly to `/showcase`.
  * Rewrites `/schema` to `schemas/v1.schema.json`.
* **[`_headers`](_headers)**:
  * Injects CORS headers (`Access-Control-Allow-Origin: *`) for 3D model streaming.
  * Immutably caches static `.glb` 3D assets on Cloudflare global edge cache (`max-age=31536000`).
