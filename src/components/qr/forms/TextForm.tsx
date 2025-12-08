'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SECURITY_LIMITS } from '@/lib/constants';
import { useEffect } from 'react';
import { sanitizeText } from '@/lib/validations';

interface TextFormProps {
  onDataChange: (data: { text: string }) => void;
  initialData?: { text: string };
}

export function TextForm({ onDataChange, initialData }: TextFormProps) {
  const t = useTranslations('forms.text');

  const textFormSchema = z.object({
    text: z
      .string()
      .min(1, t('required'))
      .max(SECURITY_LIMITS.maxTextLength, t('tooLong', { max: SECURITY_LIMITS.maxTextLength })),
  });

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<{ text: string }>({
    resolver: zodResolver(textFormSchema),
    defaultValues: initialData || { text: '' },
    mode: 'onChange',
  });

  const watchedData = watch();

  useEffect(() => {
    if (watchedData.text) {
      onDataChange({ text: sanitizeText(watchedData.text) });
    }
  }, [watchedData.text, onDataChange]);

  const charCount = watchedData.text?.length || 0;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="text">{t('label')}</Label>
        <Textarea
          id="text"
          placeholder={t('placeholder')}
          className="min-h-[120px] resize-none"
          {...register('text')}
        />
        <div className="flex justify-between text-sm">
          <span className="text-destructive">{errors.text?.message}</span>
          <span className="text-muted-foreground">
            {charCount} / {SECURITY_LIMITS.maxTextLength}
          </span>
        </div>
      </div>
    </div>
  );
}
