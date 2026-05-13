import { encodeQRData } from '@/lib/qr/encoder';
import type { QRData } from '@/types/qr';

describe('encodeQRData dispatch', () => {
  it('dispatches text type', () => {
    expect(encodeQRData({ type: 'text', data: { text: 'hello' } } as QRData)).toBe('hello');
  });

  it('dispatches url type', () => {
    const out = encodeQRData({ type: 'url', data: { url: 'example.com' } } as QRData);
    expect(out).toBe('https://example.com');
  });

  it('dispatches email', () => {
    expect(encodeQRData({ type: 'email', data: { email: 'a@b.c' } } as QRData)).toContain('mailto:a@b.c');
  });

  it('dispatches phone', () => {
    expect(encodeQRData({ type: 'phone', data: { phone: '+1 (555) 555-5555' } } as QRData)).toBe('tel:+15555555555');
  });

  it('dispatches sms', () => {
    expect(encodeQRData({ type: 'sms', data: { phone: '555', message: 'hi' } } as QRData)).toContain('sms:555');
  });

  it('dispatches whatsapp', () => {
    expect(encodeQRData({ type: 'whatsapp', data: { phone: '+1234' } } as QRData)).toContain('wa.me/1234');
  });

  it('dispatches wifi', () => {
    const out = encodeQRData({ type: 'wifi', data: { ssid: 'A', password: 'B', encryption: 'WPA', hidden: false } } as QRData);
    expect(out.startsWith('WIFI:')).toBe(true);
  });

  it('dispatches vcard', () => {
    const out = encodeQRData({ type: 'vcard', data: { firstName: 'A', lastName: 'B' } } as QRData);
    expect(out).toContain('BEGIN:VCARD');
  });

  it('dispatches calendar', () => {
    const out = encodeQRData({
      type: 'calendar',
      data: { title: 'X', startDate: '2026-01-01T10:00:00Z', endDate: '2026-01-01T11:00:00Z' },
    } as QRData);
    expect(out).toContain('BEGIN:VEVENT');
  });

  it('dispatches location', () => {
    expect(encodeQRData({ type: 'location', data: { latitude: 10, longitude: 20 } } as QRData)).toContain('geo:10,20');
  });

  it('dispatches crypto', () => {
    const out = encodeQRData({
      type: 'crypto',
      data: { type: 'bitcoin', address: 'addr', amount: 0.1 },
    } as QRData);
    expect(out).toContain('bitcoin:addr');
  });

  it('dispatches appstore (both URLs prefers app store)', () => {
    const out = encodeQRData({
      type: 'appstore',
      data: { appStoreUrl: 'https://apps.apple.com/x', playStoreUrl: 'https://play.google.com/y' },
    } as QRData);
    expect(out).toBe('https://apps.apple.com/x');
  });

  it('dispatches appstore (play store only)', () => {
    const out = encodeQRData({
      type: 'appstore',
      data: { playStoreUrl: 'https://play.google.com/y' },
    } as QRData);
    expect(out).toBe('https://play.google.com/y');
  });

  it('dispatches appstore (empty)', () => {
    const out = encodeQRData({ type: 'appstore', data: {} } as QRData);
    expect(out).toBe('');
  });

  it('returns empty string for unknown type', () => {
    expect(encodeQRData({ type: 'unknown' as unknown as QRData['type'], data: {} } as QRData)).toBe('');
  });
});

describe('encoder edge cases', () => {
  it('handles unicode in text', () => {
    expect(encodeQRData({ type: 'text', data: { text: '你好 مرحبا 🚀' } } as QRData)).toBe('你好 مرحبا 🚀');
  });

  it('escapes wifi password backslash', () => {
    const out = encodeQRData({
      type: 'wifi',
      data: { ssid: 'net', password: 'a\\b', encryption: 'WPA', hidden: false },
    } as QRData);
    expect(out).toContain('P:a\\\\b');
  });

  it('escapes wifi password semicolons', () => {
    const out = encodeQRData({
      type: 'wifi',
      data: { ssid: 'net', password: 'a;b;c', encryption: 'WPA', hidden: false },
    } as QRData);
    expect(out).toContain('P:a\\;b\\;c');
  });

  it('handles email body with newlines', () => {
    const out = encodeQRData({
      type: 'email',
      data: { email: 'a@b.c', body: 'line1\nline2' },
    } as QRData);
    expect(out).toContain('mailto:a@b.c');
    expect(out).toContain('body=line1%0Aline2');
  });
});
