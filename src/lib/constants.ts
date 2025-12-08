import { QRCodeType, QRCustomization, QRTemplate } from '@/types/qr';

export const QR_TYPE_LABELS: Record<QRCodeType, string> = {
  text: 'Plain Text',
  url: 'URL / Website',
  email: 'Email',
  phone: 'Phone Number',
  sms: 'SMS Message',
  whatsapp: 'WhatsApp',
  wifi: 'WiFi Network',
  vcard: 'Contact Card (vCard)',
  calendar: 'Calendar Event',
  location: 'Location',
  crypto: 'Cryptocurrency',
  appstore: 'App Store Links',
};

export const QR_TYPE_ICONS: Record<QRCodeType, string> = {
  text: 'Type',
  url: 'Link',
  email: 'Mail',
  phone: 'Phone',
  sms: 'MessageSquare',
  whatsapp: 'MessageCircle',
  wifi: 'Wifi',
  vcard: 'Contact',
  calendar: 'Calendar',
  location: 'MapPin',
  crypto: 'Bitcoin',
  appstore: 'Store',
};

export const DEFAULT_CUSTOMIZATION: QRCustomization = {
  foregroundColor: '#000000',
  backgroundColor: '#ffffff',
  gradientType: 'none',
  gradientColors: ['#3b82f6', '#8b5cf6'],
  patternStyle: 'squares',
  cornerStyle: 'square',
  logoSize: 20,
  size: 256,
  errorCorrection: 'M',
  margin: 4,
};

export const SIZE_PRESETS = [
  { label: 'Small', value: 128 },
  { label: 'Medium', value: 256 },
  { label: 'Large', value: 512 },
  { label: 'Extra Large', value: 1024 },
  { label: 'Print Ready', value: 2048 },
];

export const ERROR_CORRECTION_LABELS: Record<string, string> = {
  L: 'Low (~7%)',
  M: 'Medium (~15%)',
  Q: 'Quartile (~25%)',
  H: 'High (~30%)',
};

export const SECURITY_LIMITS = {
  maxTextLength: 4000,
  maxUrlLength: 2048,
  maxNameLength: 100,
  maxEmailLength: 254,
  maxLogoSize: 2 * 1024 * 1024, // 2MB
  maxBatchSize: 100,
  allowedImageTypes: ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'],
  blockedProtocols: ['javascript:', 'data:', 'vbscript:', 'file:', 'blob:'],
};

export const WIFI_ENCRYPTION_OPTIONS = [
  { value: 'WPA', label: 'WPA/WPA2' },
  { value: 'WEP', label: 'WEP' },
  { value: 'nopass', label: 'None (Open)' },
];

export const CRYPTO_OPTIONS = [
  { value: 'bitcoin', label: 'Bitcoin' },
  { value: 'ethereum', label: 'Ethereum' },
];

export const PRESET_TEMPLATES: QRTemplate[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Simple black and white QR code',
    customization: {
      foregroundColor: '#000000',
      backgroundColor: '#ffffff',
      patternStyle: 'squares',
      cornerStyle: 'square',
    },
    preview: '/templates/classic.svg',
    category: 'Basic',
  },
  {
    id: 'modern-blue',
    name: 'Modern Blue',
    description: 'Clean blue gradient design',
    customization: {
      foregroundColor: '#3b82f6',
      backgroundColor: '#ffffff',
      patternStyle: 'rounded',
      cornerStyle: 'rounded',
    },
    preview: '/templates/modern-blue.svg',
    category: 'Modern',
  },
  {
    id: 'dark-mode',
    name: 'Dark Mode',
    description: 'Inverted colors for dark backgrounds',
    customization: {
      foregroundColor: '#ffffff',
      backgroundColor: '#1e293b',
      patternStyle: 'squares',
      cornerStyle: 'square',
    },
    preview: '/templates/dark-mode.svg',
    category: 'Dark',
  },
  {
    id: 'dots-purple',
    name: 'Purple Dots',
    description: 'Playful dotted pattern in purple',
    customization: {
      foregroundColor: '#8b5cf6',
      backgroundColor: '#ffffff',
      patternStyle: 'dots',
      cornerStyle: 'rounded',
    },
    preview: '/templates/dots-purple.svg',
    category: 'Modern',
  },
  {
    id: 'gradient-sunset',
    name: 'Sunset Gradient',
    description: 'Warm sunset gradient effect',
    customization: {
      gradientType: 'linear',
      gradientColors: ['#f97316', '#ec4899'],
      backgroundColor: '#ffffff',
      patternStyle: 'rounded',
      cornerStyle: 'extra-rounded',
    },
    preview: '/templates/gradient-sunset.svg',
    category: 'Gradient',
  },
  {
    id: 'gradient-ocean',
    name: 'Ocean Gradient',
    description: 'Cool ocean blue gradient',
    customization: {
      gradientType: 'linear',
      gradientColors: ['#06b6d4', '#3b82f6'],
      backgroundColor: '#ffffff',
      patternStyle: 'rounded',
      cornerStyle: 'rounded',
    },
    preview: '/templates/gradient-ocean.svg',
    category: 'Gradient',
  },
  {
    id: 'minimal-gray',
    name: 'Minimal Gray',
    description: 'Subtle gray for minimalist designs',
    customization: {
      foregroundColor: '#64748b',
      backgroundColor: '#f8fafc',
      patternStyle: 'squares',
      cornerStyle: 'square',
    },
    preview: '/templates/minimal-gray.svg',
    category: 'Minimal',
  },
  {
    id: 'corporate-green',
    name: 'Corporate Green',
    description: 'Professional green for business',
    customization: {
      foregroundColor: '#059669',
      backgroundColor: '#ffffff',
      patternStyle: 'squares',
      cornerStyle: 'rounded',
    },
    preview: '/templates/corporate-green.svg',
    category: 'Business',
  },
  {
    id: 'elegant-gold',
    name: 'Elegant Gold',
    description: 'Luxurious gold accent',
    customization: {
      foregroundColor: '#ca8a04',
      backgroundColor: '#1c1917',
      patternStyle: 'rounded',
      cornerStyle: 'rounded',
    },
    preview: '/templates/elegant-gold.svg',
    category: 'Premium',
  },
  {
    id: 'neon-pink',
    name: 'Neon Pink',
    description: 'Vibrant neon pink',
    customization: {
      foregroundColor: '#ec4899',
      backgroundColor: '#0f172a',
      patternStyle: 'dots',
      cornerStyle: 'extra-rounded',
    },
    preview: '/templates/neon-pink.svg',
    category: 'Neon',
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Natural forest green theme',
    customization: {
      foregroundColor: '#166534',
      backgroundColor: '#f0fdf4',
      patternStyle: 'rounded',
      cornerStyle: 'rounded',
    },
    preview: '/templates/forest.svg',
    category: 'Nature',
  },
  {
    id: 'tech-cyan',
    name: 'Tech Cyan',
    description: 'Futuristic cyan design',
    customization: {
      foregroundColor: '#06b6d4',
      backgroundColor: '#0f172a',
      patternStyle: 'squares',
      cornerStyle: 'square',
    },
    preview: '/templates/tech-cyan.svg',
    category: 'Tech',
  },
];

export const KEYBOARD_SHORTCUTS = {
  generate: 'ctrl+enter',
  download: 'ctrl+d',
  copy: 'ctrl+c',
  newQR: 'ctrl+n',
  toggleTheme: 'ctrl+shift+t',
};
