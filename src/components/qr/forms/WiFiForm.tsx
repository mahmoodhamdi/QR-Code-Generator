'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { Wifi, Eye, EyeOff, Lock } from 'lucide-react';
import { WifiEncryption } from '@/types/qr';
import { sanitizeText } from '@/lib/validations';

const wifiFormSchema = z.object({
  ssid: z.string().min(1, 'Network name (SSID) is required').max(32, 'SSID must be less than 32 characters'),
  password: z.string().max(63, 'Password must be less than 63 characters').optional(),
  encryption: z.enum(['WPA', 'WEP', 'nopass']),
  hidden: z.boolean().optional(),
});

type WiFiFormValues = z.infer<typeof wifiFormSchema>;

interface WiFiFormProps {
  onDataChange: (data: {
    ssid: string;
    password?: string;
    encryption: WifiEncryption;
    hidden?: boolean;
  }) => void;
  initialData?: {
    ssid: string;
    password?: string;
    encryption: WifiEncryption;
    hidden?: boolean;
  };
}

export function WiFiForm({ onDataChange, initialData }: WiFiFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const t = useTranslations('forms.wifi');
  const tEnc = useTranslations('wifiEncryption');

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<WiFiFormValues>({
    resolver: zodResolver(wifiFormSchema),
    defaultValues: initialData || {
      ssid: '',
      password: '',
      encryption: 'WPA',
      hidden: false,
    },
    mode: 'onChange',
  });

  const watchedData = watch();

  useEffect(() => {
    if (watchedData.ssid) {
      onDataChange({
        ssid: sanitizeText(watchedData.ssid),
        password: watchedData.password,
        encryption: watchedData.encryption,
        hidden: watchedData.hidden,
      });
    }
  }, [
    watchedData.ssid,
    watchedData.password,
    watchedData.encryption,
    watchedData.hidden,
    onDataChange,
  ]);

  const showPasswordField = watchedData.encryption !== 'nopass';

  const WIFI_ENCRYPTION_OPTIONS = [
    { value: 'WPA', label: tEnc('wpa') },
    { value: 'WEP', label: tEnc('wep') },
    { value: 'nopass', label: tEnc('none') },
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="ssid">{t('ssidLabel')} *</Label>
        <div className="relative">
          <Wifi className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="ssid"
            placeholder={t('ssidPlaceholder')}
            className="ps-10"
            {...register('ssid')}
          />
        </div>
        {errors.ssid && (
          <p className="text-sm text-destructive">{errors.ssid.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="encryption">{t('encryptionLabel')}</Label>
        <Select
          value={watchedData.encryption}
          onValueChange={(value) => setValue('encryption', value as WifiEncryption)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('encryptionPlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            {WIFI_ENCRYPTION_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {showPasswordField && (
        <div className="space-y-2">
          <Label htmlFor="password">{t('passwordLabel')}</Label>
          <div className="relative">
            <Lock className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder={t('passwordPlaceholder')}
              className="ps-10 pe-10"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Checkbox
          id="hidden"
          checked={watchedData.hidden}
          onCheckedChange={(checked) => setValue('hidden', !!checked)}
        />
        <Label htmlFor="hidden" className="font-normal cursor-pointer">
          {t('hiddenLabel')}
        </Label>
      </div>
    </div>
  );
}
