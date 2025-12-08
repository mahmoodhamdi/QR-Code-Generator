'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useEffect } from 'react';
import { Mail } from 'lucide-react';
import { SECURITY_LIMITS } from '@/lib/constants';
import { sanitizeText } from '@/lib/validations';

const emailFormSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .max(SECURITY_LIMITS.maxEmailLength, 'Email is too long')
    .email('Invalid email format'),
  subject: z.string().max(200, 'Subject must be less than 200 characters').optional(),
  body: z.string().max(1000, 'Body must be less than 1000 characters').optional(),
});

type EmailFormValues = z.infer<typeof emailFormSchema>;

interface EmailFormProps {
  onDataChange: (data: { email: string; subject?: string; body?: string }) => void;
  initialData?: { email: string; subject?: string; body?: string };
}

export function EmailForm({ onDataChange, initialData }: EmailFormProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: initialData || { email: '', subject: '', body: '' },
    mode: 'onChange',
  });

  const watchedData = watch();

  useEffect(() => {
    if (watchedData.email) {
      onDataChange({
        email: watchedData.email,
        subject: watchedData.subject ? sanitizeText(watchedData.subject) : undefined,
        body: watchedData.body ? sanitizeText(watchedData.body) : undefined,
      });
    }
  }, [watchedData.email, watchedData.subject, watchedData.body, onDataChange]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address *</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="recipient@example.com"
            className="pl-10"
            {...register('email')}
          />
        </div>
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Subject (Optional)</Label>
        <Input
          id="subject"
          placeholder="Email subject"
          {...register('subject')}
        />
        {errors.subject && (
          <p className="text-sm text-destructive">{errors.subject.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="body">Message (Optional)</Label>
        <Textarea
          id="body"
          placeholder="Pre-filled email message..."
          className="min-h-[80px] resize-none"
          {...register('body')}
        />
        {errors.body && (
          <p className="text-sm text-destructive">{errors.body.message}</p>
        )}
      </div>
    </div>
  );
}
