# MarketingQR Analytics

> Trackable QR codes for marketing campaigns.

## What's bundled

- **Dynamic QR codes** — change the destination URL after printing, without changing the QR.
- **Scan analytics** — total scans, scans over time, device type, country (no IP stored), browser family, referrer.
- **A/B testing** — split scan traffic between two destinations.
- **Time-bound QRs** — only redirects between dates you set.
- **Password-protected QRs** — scanner enters a password before destination is revealed.
- **Lead capture** — redirect through an email-capture page before final destination.
- **Self-hosted Docker** OR **managed on our servers** — your choice.
- All client-only features from the base bundle (templates, batch, history).

## Pricing

| Tier | USD | EGP |
| --- | --- | --- |
| Self-hosted basic (source + deploy + 6mo support) | $3,500 | 35,000 |
| Managed (we host + manage, $200/month after) | $7,500 setup | 75,000 setup |
| Enterprise (custom features, dedicated support) | $15,000+ | 150,000+ |

## Who buys this?

Marketing agencies, growth teams at e-commerce/SaaS, OOH advertising firms, billboard companies.

## Selling angles

- Bitly QR costs $35-200/month. You pay $15/month for a VPS and own the source forever.
- Privacy-respecting analytics — no Google Analytics, no Facebook Pixel, no personal data stored.
- A/B test destinations on the same printed QR — measure which landing page converts better.
- Self-host means full GDPR control.

## Demo

`https://demo-marketingqr.example.com` (deploy with `BRAND=marketingqr npm run build` plus the backend in `backend/`).

## Optional backend

This vertical is the only one that requires the optional Node + SQLite backend in `backend/`. The other four verticals run client-only.
