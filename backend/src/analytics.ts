// Privacy-respecting analytics extractor. Pulls device/browser/country
// without storing IPs or precise location.

export interface ScanContext {
  ua?: string;
  acceptLanguage?: string;
  countryHeader?: string; // CF-IPCountry, X-Country, etc.
  referrer?: string;
}

export interface ScanFingerprint {
  device: 'mobile' | 'tablet' | 'desktop' | 'bot' | 'unknown';
  browser: string;
  country: string | null;
  referrer: string | null;
}

const BOT_RE = /bot|crawler|spider|crawling|slurp|facebookexternalhit|preview/i;

export function fingerprint(ctx: ScanContext): ScanFingerprint {
  const ua = (ctx.ua || '').toLowerCase();

  let device: ScanFingerprint['device'] = 'unknown';
  if (BOT_RE.test(ua)) device = 'bot';
  else if (/ipad|tablet/.test(ua)) device = 'tablet';
  else if (/iphone|android|mobile/.test(ua)) device = 'mobile';
  else if (ua) device = 'desktop';

  let browser = 'other';
  if (ua.includes('edg/')) browser = 'edge';
  else if (ua.includes('chrome/')) browser = 'chrome';
  else if (ua.includes('firefox/')) browser = 'firefox';
  else if (ua.includes('safari/')) browser = 'safari';
  else if (ua.includes('opr/')) browser = 'opera';

  const country = ctx.countryHeader?.slice(0, 2).toUpperCase() || null;
  const referrer = ctx.referrer ? safeReferrerHost(ctx.referrer) : null;

  return { device, browser, country, referrer };
}

function safeReferrerHost(ref: string): string | null {
  try {
    const u = new URL(ref);
    return u.hostname;
  } catch {
    return null;
  }
}

export function shouldUseVariantB(qrId: string, splitPct: number): boolean {
  if (splitPct <= 0) return false;
  if (splitPct >= 100) return true;
  // Stateless 50/50 via hash of qrId + minute. Acceptable for marketing A/B
  // tests — not for clinical trials.
  const minute = Math.floor(Date.now() / 60000);
  let h = 0;
  const key = `${qrId}-${minute}`;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) | 0;
  return Math.abs(h) % 100 < splitPct;
}
