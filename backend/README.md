# MarketingQR Backend

Minimal Express + SQLite backend that powers the **dynamic QR + analytics** capabilities of the MarketingQR vertical. Self-hostable on any $5 VPS.

## What it provides

- **Dynamic QR redirect**: `GET /q/:shortCode` redirects to the current destination, logging an anonymous scan record.
- **CRUD for QR codes** under `/api/qrs` (auth required).
- **Per-QR analytics** at `/api/qrs/:id/stats`: total scans, by-day, by-device, by-country, by-browser.
- **A/B testing**: split traffic across two destinations.
- **Time-bound QRs**: `startsAt`, `expiresAt` timestamps.
- **Privacy-respecting analytics**: no IPs stored, no cookies for tracking, bots filtered out.

## Architecture

- Node 20 + Express 4
- SQLite via `better-sqlite3` (single-file DB, no external service)
- Session via signed cookie (HMAC-SHA-256)
- Password hashing via `crypto.scrypt` (no bcrypt dep)
- `helmet`, `cors`, `express-rate-limit` for safety
- `zod` for input validation

## Quick start

```bash
cd backend
npm install
npm run dev   # localhost:4000
```

Or production with Docker:

```bash
cp .env.example .env  # set SESSION_SECRET
docker compose up -d
```

## Endpoints

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/signup` | — | Create user account |
| POST | `/api/auth/login` | — | Get session token |
| GET | `/api/qrs` | yes | List current user's QRs |
| POST | `/api/qrs` | yes | Create new dynamic QR |
| PUT | `/api/qrs/:id` | yes | Update destination / split / expiry |
| GET | `/api/qrs/:id/stats` | yes | Per-QR analytics |
| GET | `/q/:shortCode` | — | Public redirect endpoint |
| GET | `/health` | — | Liveness check |

## Environment

| Var | Default | Purpose |
| --- | --- | --- |
| `PORT` | `4000` | HTTP port |
| `SESSION_SECRET` | (must override) | HMAC key for session cookies |
| `CORS_ORIGIN` | `*` | Comma-separated allowed origins |
| `PUBLIC_BASE` | (request host) | Public URL used in short-code links |
| `DB_PATH` | `./data/marketingqr.sqlite` | SQLite file location |

## Privacy notes

- IP addresses are read for `Cloudflare-IPCountry`-style country headers, then discarded — never stored.
- Cookies are only set for authenticated dashboard sessions; the public redirect endpoint sets none.
- Bots (matched by user-agent) skip the analytics insert.
- No third-party analytics dependencies.
