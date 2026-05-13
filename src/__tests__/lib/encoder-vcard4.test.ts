import { encodeVCard } from '@/lib/qr/encoder';
import type { VCardData } from '@/types/qr';

const base: VCardData = { firstName: 'Jane', lastName: 'Doe' };

describe('vCard 4.0 features', () => {
  it('defaults to version 3.0', () => {
    expect(encodeVCard(base)).toContain('VERSION:3.0');
  });

  it('emits version 4.0 when requested', () => {
    expect(encodeVCard({ ...base, vcardVersion: '4.0' })).toContain('VERSION:4.0');
  });

  it('embeds PNG photo data url (v3 format)', () => {
    const out = encodeVCard({ ...base, photoDataUrl: 'data:image/png;base64,iVBORw0KGgo=' });
    expect(out).toContain('PHOTO;ENCODING=b;TYPE=PNG:iVBORw0KGgo=');
  });

  it('embeds JPEG photo data url (v4 format)', () => {
    const out = encodeVCard({
      ...base,
      vcardVersion: '4.0',
      photoDataUrl: 'data:image/jpeg;base64,/9j/4A=',
    });
    expect(out).toContain('PHOTO:data:image/jpeg;base64,/9j/4A=');
  });

  it('ignores invalid photo data url', () => {
    const out = encodeVCard({ ...base, photoDataUrl: 'not-a-data-url' });
    expect(out).not.toContain('PHOTO');
  });

  it('encodes birthday in compact form', () => {
    expect(encodeVCard({ ...base, birthday: '1990-05-13' })).toContain('BDAY:19900513');
  });

  it('encodes social profile handles with prefixes', () => {
    const out = encodeVCard({
      ...base,
      social: { linkedin: 'janedoe', twitter: '@janex', github: 'janedoe' },
    });
    expect(out).toContain('X-SOCIALPROFILE;TYPE=linkedin:https://linkedin.com/in/janedoe');
    expect(out).toContain('X-SOCIALPROFILE;TYPE=twitter:https://x.com/janex');
    expect(out).toContain('X-SOCIALPROFILE;TYPE=github:https://github.com/janedoe');
  });

  it('honours pre-built URLs in social handles', () => {
    const out = encodeVCard({
      ...base,
      social: { linkedin: 'https://linkedin.com/in/customer-page' },
    });
    expect(out).toContain('X-SOCIALPROFILE;TYPE=linkedin:https://linkedin.com/in/customer-page');
  });

  it('emits URL;TYPE for v4 social fields', () => {
    const out = encodeVCard({
      ...base,
      vcardVersion: '4.0',
      social: { instagram: 'janedoe' },
    });
    expect(out).toContain('URL;TYPE=instagram:https://instagram.com/janedoe');
  });

  it('escapes commas in note field', () => {
    const out = encodeVCard({ ...base, note: 'one, two, three' });
    expect(out).toContain('NOTE:one\\, two\\, three');
  });

  it('escapes newlines in note field', () => {
    const out = encodeVCard({ ...base, note: 'line1\nline2' });
    expect(out).toContain('NOTE:line1\\nline2');
  });

  it('uses CRLF line endings (RFC 6350)', () => {
    expect(encodeVCard(base)).toContain('\r\n');
  });
});
