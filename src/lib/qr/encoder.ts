import {
  TextData,
  URLData,
  EmailData,
  PhoneData,
  SMSData,
  WhatsAppData,
  WiFiData,
  VCardData,
  CalendarData,
  LocationData,
  CryptoData,
  AppStoreData,
  QRData,
} from '@/types/qr';

// Escape special characters for WiFi
function escapeWiFi(str: string): string {
  return str.replace(/([\\;,:"])/g, '\\$1');
}

// Format date for iCalendar (YYYYMMDDTHHMMSS format)
function formatICalDate(dateStr: string, allDay?: boolean): string {
  const date = new Date(dateStr);
  if (allDay) {
    return date.toISOString().slice(0, 10).replace(/-/g, '');
  }
  return date.toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';
}

// Encode plain text
export function encodeText(data: TextData): string {
  return data.text;
}

// Encode URL
export function encodeURL(data: URLData): string {
  let url = data.url.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  return url;
}

// Encode Email (mailto:)
export function encodeEmail(data: EmailData): string {
  const params = new URLSearchParams();
  if (data.subject) params.set('subject', data.subject);
  if (data.body) params.set('body', data.body);
  const paramString = params.toString();
  return `mailto:${data.email}${paramString ? '?' + paramString : ''}`;
}

// Encode Phone (tel:)
export function encodePhone(data: PhoneData): string {
  const phone = data.phone.replace(/[^\d+]/g, '');
  return `tel:${phone}`;
}

// Encode SMS
export function encodeSMS(data: SMSData): string {
  const phone = data.phone.replace(/[^\d+]/g, '');
  if (data.message) {
    return `sms:${phone}?body=${encodeURIComponent(data.message)}`;
  }
  return `sms:${phone}`;
}

// Encode WhatsApp
export function encodeWhatsApp(data: WhatsAppData): string {
  const phone = data.phone.replace(/[^\d]/g, '');
  if (data.message) {
    return `https://wa.me/${phone}?text=${encodeURIComponent(data.message)}`;
  }
  return `https://wa.me/${phone}`;
}

// Encode WiFi (WIFI:S:ssid;T:encryption;P:password;H:hidden;;)
export function encodeWiFi(data: WiFiData): string {
  const parts = [
    `S:${escapeWiFi(data.ssid)}`,
    `T:${data.encryption}`,
  ];

  if (data.password && data.encryption !== 'nopass') {
    parts.push(`P:${escapeWiFi(data.password)}`);
  }

  if (data.hidden) {
    parts.push('H:true');
  }

  return `WIFI:${parts.join(';')};;`;
}

// Encode vCard 3.0
export function encodeVCard(data: VCardData): string {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${data.lastName || ''};${data.firstName};;;`,
    `FN:${data.firstName}${data.lastName ? ' ' + data.lastName : ''}`,
  ];

  if (data.organization) lines.push(`ORG:${data.organization}`);
  if (data.title) lines.push(`TITLE:${data.title}`);
  if (data.email) lines.push(`EMAIL:${data.email}`);
  if (data.phone) lines.push(`TEL;TYPE=WORK:${data.phone}`);
  if (data.mobile) lines.push(`TEL;TYPE=CELL:${data.mobile}`);
  if (data.fax) lines.push(`TEL;TYPE=FAX:${data.fax}`);
  if (data.website) lines.push(`URL:${data.website}`);

  if (data.street || data.city || data.state || data.zip || data.country) {
    const adr = [
      '',
      '',
      data.street || '',
      data.city || '',
      data.state || '',
      data.zip || '',
      data.country || '',
    ].join(';');
    lines.push(`ADR;TYPE=WORK:${adr}`);
  }

  if (data.note) lines.push(`NOTE:${data.note}`);

  lines.push('END:VCARD');
  return lines.join('\n');
}

// Encode Calendar Event (iCalendar/VEVENT format)
export function encodeCalendar(data: CalendarData): string {
  const uid = `${Date.now()}@qrgenerator`;
  const dtstamp = formatICalDate(new Date().toISOString());

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//QR Generator//EN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${formatICalDate(data.startDate, data.allDay)}`,
    `DTEND:${formatICalDate(data.endDate, data.allDay)}`,
    `SUMMARY:${data.title}`,
  ];

  if (data.description) lines.push(`DESCRIPTION:${data.description}`);
  if (data.location) lines.push(`LOCATION:${data.location}`);

  lines.push('END:VEVENT', 'END:VCALENDAR');
  return lines.join('\n');
}

// Encode Location (geo: URI)
export function encodeLocation(data: LocationData): string {
  const geo = `geo:${data.latitude},${data.longitude}`;
  if (data.label) {
    return `${geo}?q=${encodeURIComponent(data.label)}`;
  }
  return geo;
}

// Encode Cryptocurrency
export function encodeCrypto(data: CryptoData): string {
  const protocol = data.type === 'bitcoin' ? 'bitcoin' : 'ethereum';
  let uri = `${protocol}:${data.address}`;

  const params = new URLSearchParams();
  if (data.amount) params.set('amount', data.amount.toString());
  if (data.label) params.set('label', data.label);
  if (data.message) params.set('message', data.message);

  const paramString = params.toString();
  return paramString ? `${uri}?${paramString}` : uri;
}

// Encode App Store Links (returns combined URL or individual)
export function encodeAppStore(data: AppStoreData): string {
  // If both URLs, create a smart link landing page concept
  // For simplicity, prioritize App Store, then Play Store
  if (data.appStoreUrl && data.playStoreUrl) {
    // Return App Store URL as primary, but could be enhanced with a link tree
    return data.appStoreUrl;
  }
  return data.appStoreUrl || data.playStoreUrl || '';
}

// Main encoder function
export function encodeQRData(qrData: QRData): string {
  switch (qrData.type) {
    case 'text':
      return encodeText(qrData.data as TextData);
    case 'url':
      return encodeURL(qrData.data as URLData);
    case 'email':
      return encodeEmail(qrData.data as EmailData);
    case 'phone':
      return encodePhone(qrData.data as PhoneData);
    case 'sms':
      return encodeSMS(qrData.data as SMSData);
    case 'whatsapp':
      return encodeWhatsApp(qrData.data as WhatsAppData);
    case 'wifi':
      return encodeWiFi(qrData.data as WiFiData);
    case 'vcard':
      return encodeVCard(qrData.data as VCardData);
    case 'calendar':
      return encodeCalendar(qrData.data as CalendarData);
    case 'location':
      return encodeLocation(qrData.data as LocationData);
    case 'crypto':
      return encodeCrypto(qrData.data as CryptoData);
    case 'appstore':
      return encodeAppStore(qrData.data as AppStoreData);
    default:
      return '';
  }
}
