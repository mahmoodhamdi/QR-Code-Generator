import { z } from 'zod';
import { SECURITY_LIMITS } from '../constants';

// Helper function to sanitize text (strip HTML)
export const sanitizeText = (text: string): string => {
  return text.replace(/<[^>]*>/g, '').trim();
};

// Helper function to check for blocked protocols
const hasBlockedProtocol = (url: string): boolean => {
  const lowerUrl = url.toLowerCase().trim();
  return SECURITY_LIMITS.blockedProtocols.some((protocol) =>
    lowerUrl.startsWith(protocol)
  );
};

// Text validation
export const textSchema = z.object({
  text: z
    .string()
    .min(1, 'Text is required')
    .max(SECURITY_LIMITS.maxTextLength, `Text must be less than ${SECURITY_LIMITS.maxTextLength} characters`)
    .transform(sanitizeText),
});

// URL validation
export const urlSchema = z.object({
  url: z
    .string()
    .min(1, 'URL is required')
    .max(SECURITY_LIMITS.maxUrlLength, `URL must be less than ${SECURITY_LIMITS.maxUrlLength} characters`)
    .refine((url) => !hasBlockedProtocol(url), 'Invalid URL protocol')
    .refine((url) => {
      try {
        const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
        return ['http:', 'https:'].includes(parsed.protocol);
      } catch {
        return false;
      }
    }, 'Invalid URL format'),
});

// Email validation (RFC 5322 simplified)
export const emailSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .max(SECURITY_LIMITS.maxEmailLength, 'Email is too long')
    .email('Invalid email format'),
  subject: z
    .string()
    .max(200, 'Subject must be less than 200 characters')
    .optional()
    .transform((val) => (val ? sanitizeText(val) : undefined)),
  body: z
    .string()
    .max(1000, 'Body must be less than 1000 characters')
    .optional()
    .transform((val) => (val ? sanitizeText(val) : undefined)),
});

// Phone validation (E.164 format)
const phoneRegex = /^\+?[1-9]\d{1,14}$/;
export const phoneSchema = z.object({
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(phoneRegex, 'Invalid phone number format. Use international format (e.g., +1234567890)'),
});

// SMS validation
export const smsSchema = z.object({
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(phoneRegex, 'Invalid phone number format'),
  message: z
    .string()
    .max(160, 'Message must be less than 160 characters')
    .optional()
    .transform((val) => (val ? sanitizeText(val) : undefined)),
});

// WhatsApp validation
export const whatsappSchema = z.object({
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(phoneRegex, 'Invalid phone number format'),
  message: z
    .string()
    .max(1000, 'Message must be less than 1000 characters')
    .optional()
    .transform((val) => (val ? sanitizeText(val) : undefined)),
});

// WiFi validation
export const wifiSchema = z.object({
  ssid: z
    .string()
    .min(1, 'Network name (SSID) is required')
    .max(32, 'SSID must be less than 32 characters')
    .transform(sanitizeText),
  password: z
    .string()
    .max(63, 'Password must be less than 63 characters')
    .optional(),
  encryption: z.enum(['WPA', 'WEP', 'nopass']),
  hidden: z.boolean().optional(),
});

// vCard validation
export const vcardSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(SECURITY_LIMITS.maxNameLength, 'First name is too long')
    .transform(sanitizeText),
  lastName: z
    .string()
    .max(SECURITY_LIMITS.maxNameLength, 'Last name is too long')
    .optional()
    .transform((val) => (val ? sanitizeText(val) : '')),
  organization: z
    .string()
    .max(100, 'Organization name is too long')
    .optional()
    .transform((val) => (val ? sanitizeText(val) : undefined)),
  title: z
    .string()
    .max(100, 'Title is too long')
    .optional()
    .transform((val) => (val ? sanitizeText(val) : undefined)),
  email: z
    .string()
    .email('Invalid email format')
    .max(SECURITY_LIMITS.maxEmailLength, 'Email is too long')
    .optional()
    .or(z.literal('')),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  fax: z.string().optional(),
  website: z
    .string()
    .max(SECURITY_LIMITS.maxUrlLength, 'Website URL is too long')
    .optional()
    .refine((url) => !url || !hasBlockedProtocol(url), 'Invalid URL protocol'),
  street: z
    .string()
    .max(200, 'Street address is too long')
    .optional()
    .transform((val) => (val ? sanitizeText(val) : undefined)),
  city: z
    .string()
    .max(100, 'City name is too long')
    .optional()
    .transform((val) => (val ? sanitizeText(val) : undefined)),
  state: z
    .string()
    .max(100, 'State name is too long')
    .optional()
    .transform((val) => (val ? sanitizeText(val) : undefined)),
  zip: z
    .string()
    .max(20, 'ZIP code is too long')
    .optional()
    .transform((val) => (val ? sanitizeText(val) : undefined)),
  country: z
    .string()
    .max(100, 'Country name is too long')
    .optional()
    .transform((val) => (val ? sanitizeText(val) : undefined)),
  note: z
    .string()
    .max(500, 'Note is too long')
    .optional()
    .transform((val) => (val ? sanitizeText(val) : undefined)),
});

// Calendar event validation
export const calendarSchema = z.object({
  title: z
    .string()
    .min(1, 'Event title is required')
    .max(200, 'Title must be less than 200 characters')
    .transform(sanitizeText),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional()
    .transform((val) => (val ? sanitizeText(val) : undefined)),
  location: z
    .string()
    .max(200, 'Location must be less than 200 characters')
    .optional()
    .transform((val) => (val ? sanitizeText(val) : undefined)),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  allDay: z.boolean().optional(),
}).refine((data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return end >= start;
}, {
  message: 'End date must be after or equal to start date',
  path: ['endDate'],
});

// Location validation
export const locationSchema = z.object({
  latitude: z
    .number()
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90'),
  longitude: z
    .number()
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180'),
  label: z
    .string()
    .max(100, 'Label must be less than 100 characters')
    .optional()
    .transform((val) => (val ? sanitizeText(val) : undefined)),
});

// Cryptocurrency validation
const bitcoinAddressRegex = /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}$/;
const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/;

export const cryptoSchema = z.object({
  type: z.enum(['bitcoin', 'ethereum']),
  address: z.string().min(1, 'Wallet address is required'),
  amount: z.number().positive('Amount must be positive').optional(),
  label: z
    .string()
    .max(100, 'Label must be less than 100 characters')
    .optional()
    .transform((val) => (val ? sanitizeText(val) : undefined)),
  message: z
    .string()
    .max(200, 'Message must be less than 200 characters')
    .optional()
    .transform((val) => (val ? sanitizeText(val) : undefined)),
}).refine((data) => {
  if (data.type === 'bitcoin') {
    return bitcoinAddressRegex.test(data.address);
  }
  if (data.type === 'ethereum') {
    return ethereumAddressRegex.test(data.address);
  }
  return false;
}, {
  message: 'Invalid wallet address format',
  path: ['address'],
});

// App Store validation
export const appStoreSchema = z.object({
  appStoreUrl: z
    .string()
    .max(SECURITY_LIMITS.maxUrlLength, 'URL is too long')
    .optional()
    .refine((url) => {
      if (!url) return true;
      try {
        const parsed = new URL(url);
        return parsed.hostname.includes('apple.com') || parsed.hostname.includes('apps.apple.com');
      } catch {
        return false;
      }
    }, 'Must be a valid Apple App Store URL'),
  playStoreUrl: z
    .string()
    .max(SECURITY_LIMITS.maxUrlLength, 'URL is too long')
    .optional()
    .refine((url) => {
      if (!url) return true;
      try {
        const parsed = new URL(url);
        return parsed.hostname.includes('play.google.com');
      } catch {
        return false;
      }
    }, 'Must be a valid Google Play Store URL'),
}).refine((data) => data.appStoreUrl || data.playStoreUrl, {
  message: 'At least one app store URL is required',
  path: ['appStoreUrl'],
});

// Export all schemas in a map for dynamic access
export const validationSchemas = {
  text: textSchema,
  url: urlSchema,
  email: emailSchema,
  phone: phoneSchema,
  sms: smsSchema,
  whatsapp: whatsappSchema,
  wifi: wifiSchema,
  vcard: vcardSchema,
  calendar: calendarSchema,
  location: locationSchema,
  crypto: cryptoSchema,
  appstore: appStoreSchema,
} as const;

// Type inference helpers
export type TextFormData = z.infer<typeof textSchema>;
export type URLFormData = z.infer<typeof urlSchema>;
export type EmailFormData = z.infer<typeof emailSchema>;
export type PhoneFormData = z.infer<typeof phoneSchema>;
export type SMSFormData = z.infer<typeof smsSchema>;
export type WhatsAppFormData = z.infer<typeof whatsappSchema>;
export type WiFiFormData = z.infer<typeof wifiSchema>;
export type VCardFormData = z.infer<typeof vcardSchema>;
export type CalendarFormData = z.infer<typeof calendarSchema>;
export type LocationFormData = z.infer<typeof locationSchema>;
export type CryptoFormData = z.infer<typeof cryptoSchema>;
export type AppStoreFormData = z.infer<typeof appStoreSchema>;
