'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect } from 'react';
import { Link } from 'lucide-react';
import { SECURITY_LIMITS } from '@/lib/constants';

const blockedProtocols = ['javascript:', 'data:', 'vbscript:', 'file:', 'blob:'];

const hasBlockedProtocol = (url: string): boolean => {
  const lowerUrl = url.toLowerCase().trim();
  return blockedProtocols.some((protocol) => lowerUrl.startsWith(protocol));
};

interface URLFormProps {
  onDataChange: (data: { url: string }) => void;
  initialData?: { url: string };
}

export function URLForm({ onDataChange, initialData }: URLFormProps) {
  const t = useTranslations('forms.url');

  const urlFormSchema = z.object({
    url: z
      .string()
      .min(1, t('required'))
      .max(SECURITY_LIMITS.maxUrlLength, t('tooLong', { max: SECURITY_LIMITS.maxUrlLength }))
      .refine((url) => !hasBlockedProtocol(url), t('invalidProtocol'))
      .refine((url) => {
        try {
          const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
          return ['http:', 'https:'].includes(parsed.protocol);
        } catch {
          return false;
        }
      }, t('invalid')),
  });

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<{ url: string }>({
    resolver: zodResolver(urlFormSchema),
    defaultValues: initialData || { url: '' },
    mode: 'onChange',
  });

  const watchedData = watch();

  useEffect(() => {
    if (watchedData.url && !errors.url) {
      onDataChange({ url: watchedData.url });
    }
  }, [watchedData.url, errors.url, onDataChange]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="url">{t('label')}</Label>
        <div className="relative">
          <Link className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="url"
            type="url"
            placeholder={t('placeholder')}
            className="ps-10"
            {...register('url')}
          />
        </div>
        {errors.url && (
          <p className="text-sm text-destructive">{errors.url.message}</p>
        )}
        <p className="text-sm text-muted-foreground">
          {t('help')}
        </p>
      </div>
    </div>
  );
}
