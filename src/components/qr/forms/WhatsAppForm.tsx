'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { sanitizeText } from '@/lib/validations';

const phoneRegex = /^\+?[1-9]\d{1,14}$/;

const whatsappFormSchema = z.object({
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(phoneRegex, 'Invalid phone number format'),
  message: z.string().max(1000, 'Message must be less than 1000 characters').optional(),
});

type WhatsAppFormValues = z.infer<typeof whatsappFormSchema>;

interface WhatsAppFormProps {
  onDataChange: (data: { phone: string; message?: string }) => void;
  initialData?: { phone: string; message?: string };
}

export function WhatsAppForm({ onDataChange, initialData }: WhatsAppFormProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm<WhatsAppFormValues>({
    resolver: zodResolver(whatsappFormSchema),
    defaultValues: initialData || { phone: '', message: '' },
    mode: 'onChange',
  });

  const watchedData = watch();

  useEffect(() => {
    if (watchedData.phone) {
      onDataChange({
        phone: watchedData.phone,
        message: watchedData.message ? sanitizeText(watchedData.message) : undefined,
      });
    }
  }, [watchedData.phone, watchedData.message, onDataChange]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phone">WhatsApp Number *</Label>
        <div className="relative">
          <MessageCircle className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="phone"
            type="tel"
            placeholder="+1234567890"
            className="pl-10"
            {...register('phone')}
          />
        </div>
        {errors.phone && (
          <p className="text-sm text-destructive">{errors.phone.message}</p>
        )}
        <p className="text-sm text-muted-foreground">
          Include country code without + (e.g., 1 for US, 44 for UK)
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Pre-filled Message (Optional)</Label>
        <Textarea
          id="message"
          placeholder="Hey! I found this interesting..."
          className="min-h-[80px] resize-none"
          {...register('message')}
        />
        {errors.message && (
          <p className="text-sm text-destructive">{errors.message.message}</p>
        )}
      </div>
    </div>
  );
}
