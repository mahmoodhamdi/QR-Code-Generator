'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { sanitizeText } from '@/lib/validations';

const phoneRegex = /^\+?[1-9]\d{1,14}$/;

const smsFormSchema = z.object({
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(phoneRegex, 'Invalid phone number format'),
  message: z.string().max(160, 'Message must be less than 160 characters').optional(),
});

type SMSFormValues = z.infer<typeof smsFormSchema>;

interface SMSFormProps {
  onDataChange: (data: { phone: string; message?: string }) => void;
  initialData?: { phone: string; message?: string };
}

export function SMSForm({ onDataChange, initialData }: SMSFormProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm<SMSFormValues>({
    resolver: zodResolver(smsFormSchema),
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

  const charCount = watchedData.message?.length || 0;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number *</Label>
        <div className="relative">
          <MessageSquare className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Pre-filled Message (Optional)</Label>
        <Textarea
          id="message"
          placeholder="Enter your SMS message..."
          className="min-h-[80px] resize-none"
          {...register('message')}
        />
        <div className="flex justify-between text-sm">
          <span className="text-destructive">{errors.message?.message}</span>
          <span className="text-muted-foreground">{charCount} / 160</span>
        </div>
      </div>
    </div>
  );
}
