// Signed / expiring / one-time-use QR helpers — designed for ticket and access
// control use cases. The payload is plaintext (so any scanner can read it) but
// the wrapper carries an HMAC the verifier can check, plus optional expiry and
// one-time identifiers.
//
// Wire format (URL-safe base64 of JSON):
//   { v, p, exp?, nonce?, iat, sig }
// where p = payload, sig = HMAC-SHA-256(secret, JSON({v,p,exp,nonce,iat}))

export interface SignedQROptions {
  payload: string;
  secret: string;
  /** Unix epoch (seconds) when the code stops being valid. */
  expiresAt?: number;
  /** If true, includes a random 16-byte nonce so the verifier can mark it consumed. */
  oneTime?: boolean;
}

export interface SignedQRPayload {
  v: 1;
  p: string;
  exp?: number;
  nonce?: string;
  iat: number;
  sig: string;
}

function bytesToB64Url(bytes: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  const b64 = typeof btoa === 'function' ? btoa(bin) : Buffer.from(bytes).toString('base64');
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64UrlToBytes(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? '' : '='.repeat(4 - (s.length % 4));
  const std = (s + pad).replace(/-/g, '+').replace(/_/g, '/');
  const bin = typeof atob === 'function' ? atob(std) : Buffer.from(std, 'base64').toString('binary');
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hmacSha256(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const keyData = enc.encode(secret);
  const msgData = enc.encode(message);

  const crypto = globalThis.crypto;
  if (crypto?.subtle) {
    const key = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const sig = await crypto.subtle.sign('HMAC', key, msgData);
    return bytesToB64Url(new Uint8Array(sig));
  }

  // Node fallback for build-time / SSR usage.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const nodeCrypto = require('crypto') as typeof import('crypto');
  return nodeCrypto.createHmac('sha256', keyData).update(msgData).digest('base64url');
}

function randomNonce(bytes = 16): string {
  if (globalThis.crypto?.getRandomValues) {
    const buf = new Uint8Array(bytes);
    globalThis.crypto.getRandomValues(buf);
    return bytesToB64Url(buf);
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const nodeCrypto = require('crypto') as typeof import('crypto');
  return nodeCrypto.randomBytes(bytes).toString('base64url');
}

export async function signQRPayload(options: SignedQROptions): Promise<string> {
  if (!options.secret) throw new Error('Signing secret required');
  if (options.secret.length < 8) throw new Error('Signing secret too short (min 8 chars)');

  const body: Omit<SignedQRPayload, 'sig'> = {
    v: 1,
    p: options.payload,
    iat: Math.floor(Date.now() / 1000),
    ...(options.expiresAt ? { exp: options.expiresAt } : {}),
    ...(options.oneTime ? { nonce: randomNonce() } : {}),
  };

  const canonical = JSON.stringify(body);
  const sig = await hmacSha256(options.secret, canonical);

  const full: SignedQRPayload = { ...body, sig };
  const json = JSON.stringify(full);
  const enc = new TextEncoder();
  return 'qrsig://' + bytesToB64Url(enc.encode(json));
}

export interface VerifyResult {
  valid: boolean;
  reason?: 'malformed' | 'bad-signature' | 'expired';
  payload?: string;
  nonce?: string;
  expiresAt?: number;
  issuedAt?: number;
}

export async function verifySignedQR(token: string, secret: string): Promise<VerifyResult> {
  try {
    if (!token.startsWith('qrsig://')) return { valid: false, reason: 'malformed' };
    const body = b64UrlToBytes(token.slice('qrsig://'.length));
    const json = new TextDecoder().decode(body);
    const parsed = JSON.parse(json) as SignedQRPayload;

    if (parsed.v !== 1 || typeof parsed.p !== 'string' || typeof parsed.sig !== 'string') {
      return { valid: false, reason: 'malformed' };
    }

    const { sig, ...rest } = parsed;
    const canonical = JSON.stringify(rest);
    const expected = await hmacSha256(secret, canonical);

    if (!constantTimeEquals(sig, expected)) {
      return { valid: false, reason: 'bad-signature' };
    }

    const now = Math.floor(Date.now() / 1000);
    if (rest.exp !== undefined && now > rest.exp) {
      return { valid: false, reason: 'expired', payload: rest.p, expiresAt: rest.exp, issuedAt: rest.iat };
    }

    return {
      valid: true,
      payload: rest.p,
      nonce: rest.nonce,
      expiresAt: rest.exp,
      issuedAt: rest.iat,
    };
  } catch {
    return { valid: false, reason: 'malformed' };
  }
}

function constantTimeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}
