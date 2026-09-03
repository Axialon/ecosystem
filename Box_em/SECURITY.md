# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

---

## Reporting a Vulnerability

We take the security of **Blackboxes • Box'em** seriously. If you discover a security issue, vulnerability, or potential exploit, please do **NOT** open a public issue.

Instead, please send a detailed report to our core security team:
* **Email**: `security@blackboxes.engine`
* **Subject**: `[SECURITY VULNERABILITY] - <Short Description>`

Please include in your report:
1. Type of issue (e.g., prototype pollution, XSS in payload import, WebGL memory exhaustion, HMAC bypass).
2. Step-by-step instructions or proof-of-concept payload to reproduce the issue.
3. Affected components (e.g., `index.html`, `server.js`, `schemaValidator.js`, `workers/donationWebhook.js`).
4. Potential mitigation or proposed fix (if available).

We will acknowledge receipt of your report within **24 hours** and provide a resolution timeline.

---

## Defensive Security Architecture

Box'em enforces strict security boundaries by design:
* **In-Browser Payload Validation**: Uploaded `.boxem.json` configurations are defanged of all `<script>` tags, HTML attributes, and validated against numerical boundary limits.
* **Strict Asset URL Allowlist**: External 3D model loaders reject untrusted domains to prevent cross-origin tracking or payload injection.
* **HMAC SHA-256 Webhook Verification**: Edge sponsor webhook integrations in Cloudflare Workers require cryptographically verified HMAC signatures.
* **Zero Execution Engine**: Configuration models only alter mathematical vectors and WebGL geometry properties—never evaluating dynamic code or arbitrary JS.
