import { signQRPayload, verifySignedQR } from '@/lib/qr/secure';

describe('signed QR payloads', () => {
  const secret = 'this-is-a-test-secret-32bytes-min-len';

  it('signs and round-trips a payload', async () => {
    const token = await signQRPayload({ payload: 'ticket-A-12', secret });
    expect(token).toMatch(/^qrsig:\/\//);
    const result = await verifySignedQR(token, secret);
    expect(result.valid).toBe(true);
    expect(result.payload).toBe('ticket-A-12');
  });

  it('rejects with bad signature when secret differs', async () => {
    const token = await signQRPayload({ payload: 'x', secret });
    const result = await verifySignedQR(token, 'wrong-secret-but-long-enough-32');
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('bad-signature');
  });

  it('rejects payload modification (tampering)', async () => {
    const token = await signQRPayload({ payload: 'orig', secret });
    // Replace the body bytes with a different payload; signature should mismatch.
    const tampered = token.replace(/.{3}$/, 'AAA');
    const result = await verifySignedQR(tampered, secret);
    expect(result.valid).toBe(false);
  });

  it('marks expired tokens as expired', async () => {
    const token = await signQRPayload({ payload: 'old', secret, expiresAt: Math.floor(Date.now() / 1000) - 60 });
    const result = await verifySignedQR(token, secret);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('expired');
    expect(result.payload).toBe('old');
  });

  it('accepts unexpired tokens', async () => {
    const token = await signQRPayload({ payload: 'fresh', secret, expiresAt: Math.floor(Date.now() / 1000) + 600 });
    const result = await verifySignedQR(token, secret);
    expect(result.valid).toBe(true);
  });

  it('emits a nonce when oneTime requested', async () => {
    const t1 = await signQRPayload({ payload: 'p', secret, oneTime: true });
    const t2 = await signQRPayload({ payload: 'p', secret, oneTime: true });
    const r1 = await verifySignedQR(t1, secret);
    const r2 = await verifySignedQR(t2, secret);
    expect(r1.nonce).toBeDefined();
    expect(r2.nonce).toBeDefined();
    expect(r1.nonce).not.toBe(r2.nonce);
  });

  it('rejects tokens without the qrsig:// scheme', async () => {
    const result = await verifySignedQR('something-else', secret);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('malformed');
  });

  it('rejects malformed base64 payloads', async () => {
    const result = await verifySignedQR('qrsig://not-valid-json-payload', secret);
    expect(result.valid).toBe(false);
  });

  it('refuses to sign with a too-short secret', async () => {
    await expect(signQRPayload({ payload: 'x', secret: 'short' })).rejects.toThrow();
  });
});
