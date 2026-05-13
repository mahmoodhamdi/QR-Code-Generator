# Deployment Guide

How to deploy any vertical bundle to production.

## Prerequisites

- Node.js 20+
- A Linux VPS, Vercel/Netlify account, or any platform that runs Node.js
- A domain (e.g., `menuqr.app`) with DNS pointed at your server
- (MarketingQR only) Docker for the optional backend

## Quick start (any vertical)

```bash
# 1. Clone the source
git clone https://github.com/<your-org>/<your-fork> .
cd <your-fork>

# 2. Install dependencies
npm ci

# 3. Set the brand for the build
export BRAND=menuqr  # or eventqr, bizcard, printshop, marketingqr
export NEXT_PUBLIC_BRAND=$BRAND
export NEXT_PUBLIC_SITE_URL=https://menuqr.app

# 4. Build
npm run build
# Or use the helper script that handles manifest patching:
# node scripts/build-vertical.mjs menuqr

# 5. Run
npm start  # listens on $PORT (default 3000)
```

## Deploy to Vercel (easiest, free tier suffices)

1. Push your forked repo to GitHub.
2. Import into Vercel.
3. Set environment variables in the Vercel project settings:
   - `BRAND=menuqr`
   - `NEXT_PUBLIC_BRAND=menuqr`
   - `NEXT_PUBLIC_SITE_URL=https://menuqr.app`
4. Add your custom domain.
5. Deploy.

## Deploy to a $5 VPS (Hetzner, DigitalOcean, etc.)

```bash
# On the VPS:
apt update && apt install -y nodejs npm caddy git
git clone <your-repo>
cd <your-repo>
npm ci
BRAND=menuqr NEXT_PUBLIC_BRAND=menuqr npm run build
npm install -g pm2
pm2 start npm --name menuqr -- start
pm2 startup
pm2 save
```

Caddy config (`/etc/caddy/Caddyfile`):

```caddyfile
menuqr.app {
  reverse_proxy localhost:3000
}
```

```bash
systemctl reload caddy
```

Caddy auto-provisions HTTPS via Let's Encrypt.

## Deploy MarketingQR with the backend

The MarketingQR vertical needs the dynamic-QR backend in `backend/`. Easiest path: Docker Compose.

```bash
cd backend
cp .env.example .env
# Edit .env: set SESSION_SECRET (32 random bytes), CORS_ORIGIN, PUBLIC_BASE
docker compose up -d

# On the host (or another machine), deploy the frontend
BRAND=marketingqr NEXT_PUBLIC_BRAND=marketingqr NEXT_PUBLIC_BACKEND_URL=https://api.marketingqr.app npm run build
pm2 start npm --name marketingqr -- start
```

Caddy with two domains:

```caddyfile
marketingqr.app {
  reverse_proxy localhost:3000
}

api.marketingqr.app {
  reverse_proxy localhost:4000
}
```

## Production checklist

- [ ] HTTPS enabled (Caddy auto-provisions, Vercel handles it).
- [ ] `NEXT_PUBLIC_SITE_URL` set to your actual domain.
- [ ] Backups configured (if using MarketingQR backend: back up `data/marketingqr.sqlite` daily).
- [ ] Health check endpoint `/api/health` is wired into your uptime monitor (UptimeRobot, Better Stack — both have free tiers).
- [ ] `pm2 startup` enabled so the app survives VPS reboots.
- [ ] DNS TTL set to ≤ 1 hour for the first month, so you can move the domain quickly if needed.

## Updating

```bash
git pull
npm ci
BRAND=menuqr NEXT_PUBLIC_BRAND=menuqr npm run build
pm2 restart menuqr
```

Roughly 30 seconds of downtime per update if you do it serially. For zero-downtime, run two instances behind a load balancer.

## Troubleshooting

**Build fails**: check Node version (`node --version` should be ≥ 20).

**404 on `/privacy` or other pages**: ensure `BRAND` env var was set during build; some pages are conditionally rendered per vertical.

**MarketingQR scans not recording**: check the backend logs (`docker compose logs marketingqr-backend`); verify `cf-ipcountry` or `x-country` header is present if behind a proxy.

**Lighthouse PWA score < 100**: serve over HTTPS (PWA requires a secure origin).
