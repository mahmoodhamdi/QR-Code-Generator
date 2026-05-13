import express, { type Request, type Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import type Database from 'better-sqlite3';
import { hashPassword, verifyPassword, signSession, authRequired, type UserRow } from './auth.js';
import { fingerprint, shouldUseVariantB } from './analytics.js';

export function createServer(db: Database.Database) {
  const app = express();
  app.set('trust proxy', 1);
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || true, credentials: true }));
  app.use(express.json({ limit: '50kb' }));
  app.use(cookieParser);

  const apiLimiter = rateLimit({ windowMs: 60_000, max: 60, standardHeaders: true });
  const authLimiter = rateLimit({ windowMs: 60_000, max: 5, standardHeaders: true });

  app.get('/health', (_, res) => res.json({ ok: true }));

  // ── Auth ────────────────────────────────────────────────────────
  const authBody = z.object({ email: z.string().email(), password: z.string().min(8).max(200) });

  app.post('/api/auth/signup', authLimiter, (req, res) => {
    const parsed = authBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'invalid input' });
    const { email, password } = parsed.data;
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) return res.status(409).json({ error: 'email taken' });
    const id = nanoid();
    db.prepare('INSERT INTO users (id, email, password_hash, created_at) VALUES (?, ?, ?, ?)')
      .run(id, email, hashPassword(password), Date.now());
    return res.json({ id, email, session: signSession(id) });
  });

  app.post('/api/auth/login', authLimiter, (req, res) => {
    const parsed = authBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'invalid input' });
    const { email, password } = parsed.data;
    const user = db.prepare('SELECT id, password_hash FROM users WHERE email = ?').get(email) as { id: string; password_hash: string } | undefined;
    if (!user || !verifyPassword(password, user.password_hash)) {
      return res.status(401).json({ error: 'invalid credentials' });
    }
    return res.json({ id: user.id, email, session: signSession(user.id) });
  });

  // ── Dynamic QRs ─────────────────────────────────────────────────
  const qrBody = z.object({
    name: z.string().max(120).optional(),
    destination: z.string().url(),
    destinationB: z.string().url().optional(),
    splitPct: z.number().int().min(0).max(100).optional(),
    expiresAt: z.number().int().optional(),
    startsAt: z.number().int().optional(),
  });

  app.post('/api/qrs', apiLimiter, authRequired(db), (req: Request & { user?: UserRow }, res: Response) => {
    const parsed = qrBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'invalid input', details: parsed.error.flatten() });
    const body = parsed.data;
    const id = nanoid();
    const shortCode = nanoid(8);
    const now = Date.now();
    db.prepare(`
      INSERT INTO qrs (id, user_id, short_code, name, destination, destination_b, split_pct, starts_at, expires_at, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      req.user!.id,
      shortCode,
      body.name ?? null,
      body.destination,
      body.destinationB ?? null,
      body.splitPct ?? 0,
      body.startsAt ?? null,
      body.expiresAt ?? null,
      now,
      now,
    );
    return res.json({ id, shortCode, url: `${publicBase(req)}/q/${shortCode}` });
  });

  app.get('/api/qrs', apiLimiter, authRequired(db), (req: Request & { user?: UserRow }, res) => {
    const rows = db.prepare('SELECT id, short_code, name, destination, destination_b, split_pct, expires_at, created_at FROM qrs WHERE user_id = ? ORDER BY created_at DESC').all(req.user!.id);
    res.json({ qrs: rows });
  });

  app.put('/api/qrs/:id', apiLimiter, authRequired(db), (req: Request & { user?: UserRow }, res) => {
    const parsed = qrBody.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'invalid input' });
    const fields: string[] = [];
    const values: unknown[] = [];
    if (parsed.data.destination !== undefined) { fields.push('destination = ?'); values.push(parsed.data.destination); }
    if (parsed.data.destinationB !== undefined) { fields.push('destination_b = ?'); values.push(parsed.data.destinationB); }
    if (parsed.data.splitPct !== undefined) { fields.push('split_pct = ?'); values.push(parsed.data.splitPct); }
    if (parsed.data.name !== undefined) { fields.push('name = ?'); values.push(parsed.data.name); }
    if (parsed.data.expiresAt !== undefined) { fields.push('expires_at = ?'); values.push(parsed.data.expiresAt); }
    if (parsed.data.startsAt !== undefined) { fields.push('starts_at = ?'); values.push(parsed.data.startsAt); }
    if (!fields.length) return res.json({ ok: true });
    fields.push('updated_at = ?'); values.push(Date.now());
    values.push(req.params.id, req.user!.id);
    const result = db.prepare(`UPDATE qrs SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`).run(...values);
    if (result.changes === 0) return res.status(404).json({ error: 'not found' });
    res.json({ ok: true });
  });

  app.get('/api/qrs/:id/stats', apiLimiter, authRequired(db), (req: Request & { user?: UserRow }, res) => {
    const qr = db.prepare('SELECT id FROM qrs WHERE id = ? AND user_id = ?').get(req.params.id, req.user!.id);
    if (!qr) return res.status(404).json({ error: 'not found' });
    const total = (db.prepare('SELECT COUNT(*) AS c FROM scans WHERE qr_id = ?').get(req.params.id) as { c: number }).c;
    const byDevice = db.prepare('SELECT device, COUNT(*) AS c FROM scans WHERE qr_id = ? GROUP BY device').all(req.params.id);
    const byCountry = db.prepare('SELECT country, COUNT(*) AS c FROM scans WHERE qr_id = ? GROUP BY country').all(req.params.id);
    const byBrowser = db.prepare('SELECT browser, COUNT(*) AS c FROM scans WHERE qr_id = ? GROUP BY browser').all(req.params.id);
    const daily = db.prepare(`
      SELECT (ts / 86400000) AS day, COUNT(*) AS c
      FROM scans WHERE qr_id = ? AND ts > ?
      GROUP BY day ORDER BY day
    `).all(req.params.id, Date.now() - 30 * 86400000);
    res.json({ total, byDevice, byCountry, byBrowser, daily });
  });

  // ── Public redirect with analytics tracking ────────────────────
  app.get('/q/:shortCode', (req, res) => {
    const row = db.prepare(`
      SELECT id, destination, destination_b, split_pct, starts_at, expires_at
      FROM qrs WHERE short_code = ?
    `).get(req.params.shortCode) as
      | { id: string; destination: string; destination_b: string | null; split_pct: number; starts_at: number | null; expires_at: number | null }
      | undefined;

    if (!row) return res.status(404).send('Not found');

    const now = Date.now();
    if (row.starts_at && now < row.starts_at) return res.status(403).send('Not yet active');
    if (row.expires_at && now > row.expires_at) return res.status(410).send('Expired');

    const useB = !!row.destination_b && shouldUseVariantB(row.id, row.split_pct);
    const target = useB ? row.destination_b! : row.destination;

    const fp = fingerprint({
      ua: req.headers['user-agent'] as string | undefined,
      acceptLanguage: req.headers['accept-language'] as string | undefined,
      countryHeader: (req.headers['cf-ipcountry'] || req.headers['x-country']) as string | undefined,
      referrer: req.headers.referer as string | undefined,
    });

    if (fp.device !== 'bot') {
      db.prepare(`
        INSERT INTO scans (qr_id, ts, country, device, browser, referrer, variant)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(row.id, now, fp.country, fp.device, fp.browser, fp.referrer, useB ? 'B' : 'A');
    }

    res.redirect(302, target);
  });

  return app;
}

function publicBase(req: Request): string {
  return process.env.PUBLIC_BASE || `${req.protocol}://${req.get('host')}`;
}

// Minimal cookie parser to keep deps small. Only reads the `session` cookie.
function cookieParser(req: Request & { cookies?: Record<string, string> }, _: Response, next: () => void) {
  const header = req.headers.cookie || '';
  const cookies: Record<string, string> = {};
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx > -1) cookies[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim());
  }
  req.cookies = cookies;
  next();
}
