// QR Code Types
export type QRCodeType =
  | 'text'
  | 'url'
  | 'email'
  | 'phone'
  | 'sms'
  | 'whatsapp'
  | 'wifi'
  | 'vcard'
  | 'calendar'
  | 'location'
  | 'crypto'
  | 'appstore';

// QR Style Options
export type QRPatternStyle = 'squares' | 'dots' | 'rounded';
export type QRCornerStyle = 'square' | 'rounded' | 'extra-rounded';
export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';
export type GradientType = 'linear' | 'radial' | 'none';
export type WifiEncryption = 'WPA' | 'WEP' | 'nopass';
export type CryptoType = 'bitcoin' | 'ethereum';

// QR Customization
export interface QRCustomization {
  foregroundColor: string;
  backgroundColor: string;
  gradientType: GradientType;
  gradientColors: [string, string];
  patternStyle: QRPatternStyle;
  cornerStyle: QRCornerStyle;
  logo?: string;
  logoSize: number;
  frameText?: string;
  size: number;
  errorCorrection: ErrorCorrectionLevel;
  margin: number;
}

// Data types for each QR type
export interface TextData {
  text: string;
}

export interface URLData {
  url: string;
}

export interface EmailData {
  email: string;
  subject?: string;
  body?: string;
}

export interface PhoneData {
  phone: string;
}

export interface SMSData {
  phone: string;
  message?: string;
}

export interface WhatsAppData {
  phone: string;
  message?: string;
}

export interface WiFiData {
  ssid: string;
  password?: string;
  encryption: WifiEncryption;
  hidden?: boolean;
}

export interface VCardData {
  firstName: string;
  lastName: string;
  organization?: string;
  title?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  fax?: string;
  website?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  note?: string;
}

export interface CalendarData {
  title: string;
  description?: string;
  location?: string;
  startDate: string;
  endDate: string;
  allDay?: boolean;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  label?: string;
}

export interface CryptoData {
  type: CryptoType;
  address: string;
  amount?: number;
  label?: string;
  message?: string;
}

export interface AppStoreData {
  appStoreUrl?: string;
  playStoreUrl?: string;
}

// Union type for all QR data
export type QRData =
  | { type: 'text'; data: TextData }
  | { type: 'url'; data: URLData }
  | { type: 'email'; data: EmailData }
  | { type: 'phone'; data: PhoneData }
  | { type: 'sms'; data: SMSData }
  | { type: 'whatsapp'; data: WhatsAppData }
  | { type: 'wifi'; data: WiFiData }
  | { type: 'vcard'; data: VCardData }
  | { type: 'calendar'; data: CalendarData }
  | { type: 'location'; data: LocationData }
  | { type: 'crypto'; data: CryptoData }
  | { type: 'appstore'; data: AppStoreData };

// History item
export interface QRHistoryItem {
  id: string;
  type: QRCodeType;
  data: QRData['data'];
  customization: QRCustomization;
  preview: string;
  createdAt: string;
  label?: string;
}

// Template
export interface QRTemplate {
  id: string;
  name: string;
  description: string;
  customization: Partial<QRCustomization>;
  preview: string;
  category: string;
}

// Export format
export type ExportFormat = 'png' | 'svg' | 'pdf' | 'jpeg' | 'webp';

export interface ExportOptions {
  format: ExportFormat;
  quality?: number;
  scale?: number;
}

// Batch generation
export interface BatchItem {
  id: string;
  data: string;
  type: QRCodeType;
  status: 'pending' | 'generating' | 'completed' | 'error';
  preview?: string;
  error?: string;
}
