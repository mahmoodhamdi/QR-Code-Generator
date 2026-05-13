import crypto from 'node:crypto';
import type { Request, Response, NextFunction } from 'express';
import type Database from 'better-sqlite3';

// Lightweight session via signed cookie. For a production deploy, consider
// swapping in @fastify/jwt or a managed identity provider.

const SECRET = process.env.SESSION_SECRET || 'change-me-please-change-me-please';

export interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  created_at: number;
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, expected] = stored.split(':');
  if (!salt || !expected) return false;
  const actual = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(actual, 'hex'));
}

export function signSession(userId: string): string {
  const payload = `${userId}.${Date.now()}`;
  const sig = crypto.createHmac('sha256', SECRET).update(payload).digest('base64url');
  return `${Buffer.from(payload).toString('base64url')}.${sig}`;
}

export function verifySession(token: string): { userId: string } | null {
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  const payload = Buffer.from(body, 'base64url').toString();
  const expected = crypto.createHmac('sha256', SECRET).update(payload).digest('base64url');
  if (sig !== expected) return null;
  const [userId] = payload.split('.');
  return { userId };
}

export function authRequired(db: Database.Database) {
  return (req: Request & { user?: UserRow }, res: Response, next: NextFunction) => {
    const token = req.cookies?.session || req.headers.authorization?.replace(/^Bearer\s+/, '');
    if (!token) return res.status(401).json({ error: 'auth required' });
    const session = verifySession(token);
    if (!session) return res.status(401).json({ error: 'invalid session' });
    const row = db.prepare('SELECT id, email, password_hash, created_at FROM users WHERE id = ?').get(session.userId) as UserRow | undefined;
    if (!row) return res.status(401).json({ error: 'user not found' });
    req.user = row;
    next();
  };
}
