'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect } from 'react';
import { Apple, Play } from 'lucide-react';
import { SECURITY_LIMITS } from '@/lib/constants';

const appStoreFormSchema = z.object({
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

type AppStoreFormValues = z.infer<typeof appStoreFormSchema>;

interface AppStoreFormProps {
  onDataChange: (data: { appStoreUrl?: string; playStoreUrl?: string }) => void;
  initialData?: Partial<AppStoreFormValues>;
}

export function AppStoreForm({ onDataChange, initialData }: AppStoreFormProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm<AppStoreFormValues>({
    resolver: zodResolver(appStoreFormSchema),
    defaultValues: {
      appStoreUrl: '',
      playStoreUrl: '',
      ...initialData,
    },
    mode: 'onChange',
  });

  const watchedData = watch();

  useEffect(() => {
    if (watchedData.appStoreUrl || watchedData.playStoreUrl) {
      onDataChange({
        appStoreUrl: watchedData.appStoreUrl || undefined,
        playStoreUrl: watchedData.playStoreUrl || undefined,
      });
    }
  }, [watchedData.appStoreUrl, watchedData.playStoreUrl, onDataChange]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Enter at least one app store URL. The QR code will link to the provided store(s).
      </p>

      <div className="space-y-2">
        <Label htmlFor="appStoreUrl">Apple App Store URL</Label>
        <div className="relative">
          <Apple className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="appStoreUrl"
            type="url"
            placeholder="https://apps.apple.com/app/..."
            className="pl-10"
            {...register('appStoreUrl')}
          />
        </div>
        {errors.appStoreUrl && (
          <p className="text-sm text-destructive">{errors.appStoreUrl.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="playStoreUrl">Google Play Store URL</Label>
        <div className="relative">
          <Play className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="playStoreUrl"
            type="url"
            placeholder="https://play.google.com/store/apps/..."
            className="pl-10"
            {...register('playStoreUrl')}
          />
        </div>
        {errors.playStoreUrl && (
          <p className="text-sm text-destructive">{errors.playStoreUrl.message}</p>
        )}
      </div>

      {watchedData.appStoreUrl && watchedData.playStoreUrl && (
        <div className="p-3 bg-muted rounded-lg text-sm">
          <p className="font-medium">Note:</p>
          <p className="text-muted-foreground">
            When both URLs are provided, the QR code will link to the App Store URL.
            Consider creating separate QR codes for each platform for better user experience.
          </p>
        </div>
      )}
    </div>
  );
}
