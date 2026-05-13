# Marketing Plan — 5 Verticals

## Strategy overview

The QR generator codebase is repackaged into 5 vertical products, each sold to a distinct audience at a distinct price. Selling 5 specialised products beats selling one generic tool because:

1. **Targeted positioning** converts better than "we do everything."
2. **Vertical-specific copy** ranks for vertical-specific search terms.
3. **Price segmentation** captures more willingness-to-pay (a restaurant pays $1,500 for a menu solution; a print shop pays $3,500 for the same software because the use case is more lucrative for them).

## Where to find buyers (per vertical)

### MenuQR Pro
- **Facebook groups**: restaurant owner groups in your region (search "[city] restaurant owners").
- **LinkedIn**: F&B managers, hospitality consultants.
- **Cold outreach**: print shops in your city that print menus — partner with them.
- **Trade shows**: hospitality / HORECA expos.
- **SEO**: "qr menu for restaurant", "digital menu solution", "menu sin contacto" (Spanish), "قائمة طعام QR" (Arabic).

### EventQR Suite
- **Conference organiser communities**: PCMA, Meeting Professionals International.
- **LinkedIn**: event managers at agencies.
- **Cold outreach**: local event production companies.
- **Direct sales**: organisers running 500+ person events (search Eventbrite for events that size in your area).
- **SEO**: "event check-in software", "qr ticket scanner", "self-hosted ticketing".

### BizCard Studio
- **LinkedIn**: target sales people, consultants by job title.
- **Reddit**: r/sales, r/freelance, r/consulting.
- **Twitter/X**: tech and sales communities.
- **Paid ads**: LinkedIn ads targeting sales VPs.
- **SEO**: "digital business card", "vcard qr generator", "modern business card app".

### PrintShopQR
- **Direct cold call** to print shops (find on Google Maps).
- **Print industry associations**: PIA, Print Owner Communities.
- **Trade shows**: PRINT, drupa, GraphExpo.
- **LinkedIn**: print shop owners (search "owner" + "print").
- **SEO**: "bulk qr code generator", "qr code for label printing", "print-ready qr".

### MarketingQR Analytics
- **LinkedIn**: marketing directors, growth managers, agency principals.
- **Indie hackers / SaaS communities**: position as Bitly QR alternative.
- **Reddit**: r/marketing, r/digital_marketing, r/PPC.
- **Paid ads**: Google Ads on "bitly qr alternative", "trackable qr code".
- **SEO**: "dynamic qr code", "qr code analytics", "qr code tracking", "trackable qr code generator".

## Sales process

1. **Lead lands on vertical landing page** (e.g., menuqr.app).
2. **Reads pricing section**, decides budget fit.
3. **Watches demo deployment** (demo-menuqr.example.com).
4. **Clicks "Buy now"** → contact form (email + WhatsApp).
5. **You respond within 2 hours** with payment link (Stripe / Paymob / wire).
6. **After payment**: send source ZIP, deployment guide, support contact, schedule onboarding call.
7. **Follow up at days 7, 30, 60** to upsell to higher tier or to the next vertical.

## Pricing psychology

- All prices end in 00 (not 999 or 997). Lifetime / business buyers see "round number" as more honest than $X,997.
- One-time pricing > monthly subscriptions for this market. SaaS fatigue is real.
- 3-tier pricing per vertical: Basic, Plus, Lifetime. Most customers pick the middle option — that's where you make money.

## Bundle deals

- 2 verticals: −15% off list.
- 3 verticals: −25% off list.
- All 5 (Master Bundle): $20,000 / 200,000 EGP — perpetual rights.
- White-label rights (resell to your clients): +50% to base.

## Content calendar (first 90 days)

| Week | Action |
| --- | --- |
| 1 | Publish 5 landing pages + 5 blog posts (1 per vertical). |
| 2 | Run 5 social posts (1 per vertical) across LinkedIn, X, Facebook. |
| 3 | Cold outreach: 50 prospects per vertical via LinkedIn DM. |
| 4 | Run a single ad campaign on the strongest performer. |
| 5-8 | Iterate based on conversion data. Double down on the vertical with highest revenue. |
| 9-12 | Add referral program, case studies from first customers. |

## Tools

- **Landing pages**: deploy `marketing/landing-pages/*.html` to Cloudflare Pages or Netlify (free).
- **Demo deployments**: `node scripts/build-vertical.mjs <slug>` then deploy to Vercel.
- **Analytics**: Plausible (privacy-respecting, $9/month) for landing-page traffic.
- **Forms**: Tally.so or Formspree (free tier).
- **Payments**: Stripe (global), Paymob (Egypt), wire transfer for $5k+ deals.
- **Support**: WhatsApp Business + email.

## KPIs to track

- **Landing page conversion**: scan → contact form (target: 3%+).
- **Demo → sale**: contact form → paid (target: 20% within 30 days).
- **Average deal size** per vertical.
- **Bundle take rate**: how many customers buy 2+ verticals.
