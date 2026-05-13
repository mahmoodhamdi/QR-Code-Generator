import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import { createServer } from './server.js';
import Database from 'better-sqlite3';
import { ensureSchema } from './db.js';

function freshDb() {
  const db = new Database(':memory:');
  ensureSchema(db);
  return db;
}

describe('auth', () => {
  let db: Database.Database;
  beforeEach(() => { db = freshDb(); });
  afterEach(() => { db.close(); });

  it('signup creates a user and returns a session', async () => {
    const app = createServer(db);
    const res = await request(app).post('/api/auth/signup').send({ email: 'a@b.co', password: 'longpassword' });
    expect(res.status).toBe(200);
    expect(res.body.email).toBe('a@b.co');
    expect(res.body.session).toBeTruthy();
  });

  it('signup rejects duplicate email', async () => {
    const app = createServer(db);
    await request(app).post('/api/auth/signup').send({ email: 'a@b.co', password: 'longpassword' });
    const res = await request(app).post('/api/auth/signup').send({ email: 'a@b.co', password: 'longpassword' });
    expect(res.status).toBe(409);
  });

  it('signup rejects short passwords', async () => {
    const app = createServer(db);
    const res = await request(app).post('/api/auth/signup').send({ email: 'a@b.co', password: 'short' });
    expect(res.status).toBe(400);
  });

  it('login works for valid credentials', async () => {
    const app = createServer(db);
    await request(app).post('/api/auth/signup').send({ email: 'x@y.co', password: 'longpassword' });
    const res = await request(app).post('/api/auth/login').send({ email: 'x@y.co', password: 'longpassword' });
    expect(res.status).toBe(200);
    expect(res.body.session).toBeTruthy();
  });

  it('login rejects wrong password', async () => {
    const app = createServer(db);
    await request(app).post('/api/auth/signup').send({ email: 'x@y.co', password: 'longpassword' });
    const res = await request(app).post('/api/auth/login').send({ email: 'x@y.co', password: 'wrongpwword' });
    expect(res.status).toBe(401);
  });
});

describe('dynamic QR CRUD', () => {
  let db: Database.Database;
  let session: string;
  let app: ReturnType<typeof createServer>;

  beforeEach(async () => {
    db = freshDb();
    app = createServer(db);
    const sign = await request(app).post('/api/auth/signup').send({ email: 'u@x.com', password: 'longpassword' });
    session = sign.body.session;
  });
  afterEach(() => { db.close(); });

  it('creates a QR and lists it', async () => {
    const create = await request(app)
      .post('/api/qrs')
      .set('Authorization', `Bearer ${session}`)
      .send({ destination: 'https://example.com/a' });
    expect(create.status).toBe(200);
    expect(create.body.shortCode).toHaveLength(8);

    const list = await request(app).get('/api/qrs').set('Authorization', `Bearer ${session}`);
    expect(list.status).toBe(200);
    expect(list.body.qrs).toHaveLength(1);
  });

  it('rejects QR creation without auth', async () => {
    const res = await request(app).post('/api/qrs').send({ destination: 'https://example.com' });
    expect(res.status).toBe(401);
  });

  it('rejects invalid destination URL', async () => {
    const res = await request(app)
      .post('/api/qrs')
      .set('Authorization', `Bearer ${session}`)
      .send({ destination: 'not-a-url' });
    expect(res.status).toBe(400);
  });

  it('updates the destination of an existing QR', async () => {
    const create = await request(app)
      .post('/api/qrs')
      .set('Authorization', `Bearer ${session}`)
      .send({ destination: 'https://old.example' });
    const update = await request(app)
      .put(`/api/qrs/${create.body.id}`)
      .set('Authorization', `Bearer ${session}`)
      .send({ destination: 'https://new.example' });
    expect(update.status).toBe(200);
  });
});

describe('public redirect + scan tracking', () => {
  let db: Database.Database;
  let app: ReturnType<typeof createServer>;
  let session: string;
  let shortCode: string;
  let qrId: string;

  beforeEach(async () => {
    db = freshDb();
    app = createServer(db);
    const sign = await request(app).post('/api/auth/signup').send({ email: 'p@p.co', password: 'longpassword' });
    session = sign.body.session;
    const create = await request(app)
      .post('/api/qrs')
      .set('Authorization', `Bearer ${session}`)
      .send({ destination: 'https://example.com/landing' });
    shortCode = create.body.shortCode;
    qrId = create.body.id;
  });
  afterEach(() => { db.close(); });

  it('redirects to the destination', async () => {
    const res = await request(app)
      .get(`/q/${shortCode}`)
      .set('User-Agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1');
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('https://example.com/landing');
  });

  it('records a scan that shows up in stats', async () => {
    await request(app)
      .get(`/q/${shortCode}`)
      .set('User-Agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0)')
      .set('cf-ipcountry', 'EG');

    const stats = await request(app)
      .get(`/api/qrs/${qrId}/stats`)
      .set('Authorization', `Bearer ${session}`);
    expect(stats.status).toBe(200);
    expect(stats.body.total).toBe(1);
    expect(stats.body.byCountry[0].country).toBe('EG');
    expect(stats.body.byDevice[0].device).toBe('mobile');
  });

  it('skips analytics for bots', async () => {
    await request(app).get(`/q/${shortCode}`).set('User-Agent', 'Googlebot/2.1');
    const stats = await request(app)
      .get(`/api/qrs/${qrId}/stats`)
      .set('Authorization', `Bearer ${session}`);
    expect(stats.body.total).toBe(0);
  });

  it('returns 410 for expired QR', async () => {
    const expired = await request(app)
      .post('/api/qrs')
      .set('Authorization', `Bearer ${session}`)
      .send({ destination: 'https://example.com', expiresAt: Date.now() - 1000 });
    const res = await request(app).get(`/q/${expired.body.shortCode}`);
    expect(res.status).toBe(410);
  });

  it('returns 404 for unknown short code', async () => {
    const res = await request(app).get('/q/zzzzzzzz');
    expect(res.status).toBe(404);
  });
});
