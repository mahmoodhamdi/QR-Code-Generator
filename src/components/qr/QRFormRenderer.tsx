'use client';

import { QRCodeType } from '@/types/qr';
import {
  TextForm,
  URLForm,
  EmailForm,
  PhoneForm,
  SMSForm,
  WhatsAppForm,
  WiFiForm,
  VCardForm,
  CalendarForm,
  LocationForm,
  CryptoForm,
  AppStoreForm,
} from './forms';

interface QRFormRendererProps {
  type: QRCodeType;
  onDataChange: (data: Record<string, unknown>) => void;
}

export function QRFormRenderer({ type, onDataChange }: QRFormRendererProps) {
  switch (type) {
    case 'text':
      return <TextForm onDataChange={onDataChange} />;
    case 'url':
      return <URLForm onDataChange={onDataChange} />;
    case 'email':
      return <EmailForm onDataChange={onDataChange} />;
    case 'phone':
      return <PhoneForm onDataChange={onDataChange} />;
    case 'sms':
      return <SMSForm onDataChange={onDataChange} />;
    case 'whatsapp':
      return <WhatsAppForm onDataChange={onDataChange} />;
    case 'wifi':
      return <WiFiForm onDataChange={onDataChange} />;
    case 'vcard':
      return <VCardForm onDataChange={onDataChange} />;
    case 'calendar':
      return <CalendarForm onDataChange={onDataChange} />;
    case 'location':
      return <LocationForm onDataChange={onDataChange} />;
    case 'crypto':
      return <CryptoForm onDataChange={onDataChange} />;
    case 'appstore':
      return <AppStoreForm onDataChange={onDataChange} />;
    default:
      return null;
  }
}
