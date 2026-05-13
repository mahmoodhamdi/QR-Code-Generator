import Database from 'better-sqlite3';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'marketingqr.sqlite');

export function openDb(): Database.Database {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const fs = require('node:fs');
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  return db;
}

export function ensureSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS qrs (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      short_code TEXT NOT NULL UNIQUE,
      name TEXT,
      destination TEXT NOT NULL,
      destination_b TEXT,
      split_pct INTEGER DEFAULT 0,
      password_hash TEXT,
      starts_at INTEGER,
      expires_at INTEGER,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS qrs_user ON qrs(user_id);
    CREATE INDEX IF NOT EXISTS qrs_short ON qrs(short_code);

    CREATE TABLE IF NOT EXISTS scans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      qr_id TEXT NOT NULL REFERENCES qrs(id) ON DELETE CASCADE,
      ts INTEGER NOT NULL,
      country TEXT,
      device TEXT,
      browser TEXT,
      referrer TEXT,
      variant TEXT
    );

    CREATE INDEX IF NOT EXISTS scans_qr_ts ON scans(qr_id, ts);
  `);
}
