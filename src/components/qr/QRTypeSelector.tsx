'use client';

import { useTranslations } from 'next-intl';
import { QRCodeType } from '@/types/qr';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Type,
  Link,
  Mail,
  Phone,
  MessageSquare,
  MessageCircle,
  Wifi,
  Contact,
  Calendar,
  MapPin,
  Bitcoin,
  Store,
} from 'lucide-react';

const QR_TYPE_ICON_MAP: Record<QRCodeType, React.ReactNode> = {
  text: <Type className="h-4 w-4" />,
  url: <Link className="h-4 w-4" />,
  email: <Mail className="h-4 w-4" />,
  phone: <Phone className="h-4 w-4" />,
  sms: <MessageSquare className="h-4 w-4" />,
  whatsapp: <MessageCircle className="h-4 w-4" />,
  wifi: <Wifi className="h-4 w-4" />,
  vcard: <Contact className="h-4 w-4" />,
  calendar: <Calendar className="h-4 w-4" />,
  location: <MapPin className="h-4 w-4" />,
  crypto: <Bitcoin className="h-4 w-4" />,
  appstore: <Store className="h-4 w-4" />,
};

const QR_TYPES: QRCodeType[] = [
  'text',
  'url',
  'email',
  'phone',
  'sms',
  'whatsapp',
  'wifi',
  'vcard',
  'calendar',
  'location',
  'crypto',
  'appstore',
];

interface QRTypeSelectorProps {
  value: QRCodeType;
  onChange: (type: QRCodeType) => void;
}

export function QRTypeSelector({ value, onChange }: QRTypeSelectorProps) {
  const t = useTranslations('qrTypes');

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-2 pb-3">
        {QR_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => onChange(type)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all',
              'hover:border-primary/50 hover:bg-primary/5',
              value === type
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-background text-muted-foreground'
            )}
          >
            {QR_TYPE_ICON_MAP[type]}
            <span>{t(type)}</span>
          </button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
