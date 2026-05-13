# What the customer receives after purchase

When a customer pays for any vertical, they receive:

## 1. Source code package

- A private GitHub repo (or zip file delivery, customer's choice) containing:
  - Full Next.js source tree
  - All 5 brand configs (so they can switch verticals later if they want)
  - The `backend/` directory (relevant only to MarketingQR)
  - All tests (jest unit + playwright e2e + vitest backend)
  - CI/CD GitHub Actions workflows
  - Dockerfile + docker-compose.yml
  - `.env.example` files
- Customer can fork it to their own GitHub org / GitLab / Bitbucket.

## 2. Deployment guide (PDF + Markdown)

- Step-by-step deployment to Vercel, Netlify, or any VPS.
- Brand-specific environment variables.
- Custom domain setup.
- HTTPS / Let's Encrypt configuration.

## 3. Customised branding

For **Plus / Lifetime / Enterprise** tiers:

- We update `brands/<their-slug>/brand.config.ts` with the customer's:
  - Logo (light + dark)
  - Primary / secondary colors
  - Product name (replacing our placeholder)
  - Support email
  - Domain
- Re-build the deployment package with the customised brand baked in.
- The customer gets a deployment-ready ZIP they can `git push` to their cloud provider.

## 4. Privacy / compliance assets

- The `/privacy` page customised to the customer's legal name + jurisdiction.
- Optional: GDPR / CCPA compliance addendum (extra $400).
- Architectural documentation explaining what data is stored where (helpful for InfoSec reviews).

## 5. Support contact

- A dedicated email channel for the duration of the support period (30/90/180 days depending on tier).
- For Enterprise: WhatsApp / Slack shared channel + SLA-backed response times.

## 6. Onboarding session (Plus tier and above)

- 1-hour video call walking the customer through:
  - Codebase structure
  - How to customise translations
  - How to add a custom QR type
  - Backup / restore procedures (for MarketingQR backend)
- Recording sent afterwards for the customer's team archive.

## 7. Updates for the support period

- Free upgrades to bug fixes and minor versions during the support period.
- Major version upgrades (e.g., Next.js 16 → 17) are included for **Lifetime** tier only.

## 8. License document

- A written licence covering:
  - The customer's right to use the code for their business.
  - **White-label rights** (if upgrade purchased): right to resell branded versions to their clients, up to the agreed client count.
  - Restrictions: cannot re-sell the source code as-is (only branded deployments).
  - No warranty (provided as-is, with reasonable support effort).

## Delivery timeline

| Step | Time |
| --- | --- |
| Payment confirmed | T = 0 |
| Source code delivered | T + 2 hours |
| Branding customisation (Plus+) | T + 1-3 business days |
| Onboarding call scheduled | T + 1 week |
| Final ZIP / GitHub access | T + 5 business days (Plus+) |

## Money-back guarantee

Customers can request a full refund within **14 days** for any reason, no questions asked. After 14 days, support continues per the agreed tier but no refunds.
