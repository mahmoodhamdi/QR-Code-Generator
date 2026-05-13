# FAQ

Questions buyers actually ask, with the honest answers.

## Product

### Do I really get the full source code?
Yes. After payment we deliver a GitHub repo (or ZIP) with the entire codebase: Next.js frontend, optional backend, all tests, brand configs, CI workflows, deployment docs.

### Can I modify the code?
Yes, freely. Your purchase grants you the right to customise it for your business. The standard licence forbids reselling the source as-is, but you can resell **branded deployments** if you upgrade to white-label rights (+50%).

### What stack is this built on?
- Next.js 16 (App Router, React Server Components where appropriate)
- TypeScript (strict mode)
- Tailwind CSS v4
- React 19
- Zustand for state
- next-intl for i18n
- shadcn/ui components
- Playwright + Jest for tests
- (MarketingQR only) Express + SQLite + better-sqlite3

### Why Next.js and not [other framework]?
Two reasons: (1) familiarity for the largest pool of developers who might maintain it post-purchase, and (2) SSR + hydration handles the i18n routing cleanly. If you specifically need a non-Next.js port (e.g., Astro, SvelteKit), that's an Enterprise custom-feature engagement.

### Is it really 100% browser-based?
The base bundle + 4 of the 5 verticals are entirely client-side. There's an automated test (`e2e/privacy.spec.ts`) that fails CI if any outbound request is made during QR generation. **MarketingQR is the exception** — it has a backend to power the dynamic QR + analytics features, which the other verticals don't need.

## Pricing & purchasing

### Why are you more expensive than CodeCanyon listings?
CodeCanyon at $20-80 is old jQuery code with no tests and no vertical positioning. We're modern stack, fully tested, and we've done the vertical packaging work. If you want $50 code, CodeCanyon is correct — we won't compete there.

### Can I see the code before buying?
We can share a redacted snapshot or a 30-minute screen-share demo on request. The full source is delivered after payment.

### Do you offer payment plans?
For deals ≥ $5,000: 50/50 (50% upfront, 50% on delivery). Lower-priced tiers are pay-in-full only.

### Can I get a refund?
Yes — 14-day money-back guarantee on any vertical purchase. After 14 days, no refunds, but support continues per your tier.

### Do I need to renew anything?
No. Pay once, use forever. Support periods do expire (30/90/180 days depending on tier), but the code keeps working with or without support.

### What's "white-label rights" and do I need them?
- If you're using the product **for yourself** (your restaurant, your event, your printshop) → you don't need white-label rights.
- If you want to **sell branded versions to your clients** (e.g., you're an agency that sets up MenuQR for 5 different restaurants) → you need white-label rights (+50% on base price).

## Technical

### How do I deploy this?
Vercel works (free tier suffices for low traffic). For your own server, see `sales/DEPLOYMENT_GUIDE.md`. We can deploy it for you for an extra $400.

### Does it work offline?
Yes — it's a PWA. Once a user loads the page, they can generate QR codes without internet.

### How many users can it handle?
The frontend is static — Vercel's free tier handles millions of requests/month. The MarketingQR backend on a $5 Hetzner VPS comfortably handles 100,000 redirects/day. Scale up by adding more SQLite replicas or migrating to Postgres (we can help, $500 migration fee).

### What about GDPR / CCPA?
Out of the box: no personal data is stored. The MarketingQR backend's scan tracking is intentionally anonymous (no IPs, no cookies). For specific compliance review, we can deliver a written DPA — $400 extra.

### What languages does it support?
English + Arabic in production-ready quality. French, Spanish, Portuguese, German, Turkish are stub-translated (key UX strings translated, rest falls back to English) so the UI is functional. We'll fully localise to any language for $600 per language.

### Can I add a new QR type?
Yes — `src/lib/qr/encoder.ts` is where you'd add it. The codebase is structured so adding a new type takes ~2 hours of work (1 hour encoder + tests, 1 hour form + UI). We've done it. We're happy to do it for you on a custom-feature basis ($500/dev-day).

## Support

### What if I have a problem after the support period?
You can renew support at 30% off list price annually. Or post in the customer Discord we'll set up — we monitor it informally even outside support windows.

### Will you update the code over time?
Yes — bug fixes and minor versions are free for the duration of your support period. Major version upgrades (e.g., Next.js 17, React 20) are included only for **Lifetime** tier.

### What if you go out of business?
The code is in your hands. You'd be stuck without us for support, but the product keeps running. This is the main argument for one-time-pay vs. SaaS — your business doesn't depend on our business.

## Sales

### Do you do exclusive deals?
For Enterprise tier customers we'll discuss: exclusive use of a vertical in a specific geography for a defined period. This adds significantly to the price (typically 3-5x) but does happen occasionally.

### Can I be a reseller?
Yes — see the white-label rights section. Resellers get our standard tier discount + ongoing referral commission (10% of net new sales they bring in).

### Do you build custom QR products?
Sometimes, on Enterprise engagements. If you have a niche vertical we haven't covered (e.g., healthcare appointments, museum exhibit tracking, K-12 school IDs), we'll quote it. Minimum project size: $15,000.
