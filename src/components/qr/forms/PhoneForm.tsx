'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect } from 'react';
import { Phone } from 'lucide-react';

const phoneRegex = /^\+?[1-9]\d{1,14}$/;

const phoneFormSchema = z.object({
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(phoneRegex, 'Invalid phone number format. Use international format (e.g., +1234567890)'),
});

type PhoneFormValues = z.infer<typeof phoneFormSchema>;

interface PhoneFormProps {
  onDataChange: (data: { phone: string }) => void;
  initialData?: { phone: string };
}

export function PhoneForm({ onDataChange, initialData }: PhoneFormProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneFormSchema),
    defaultValues: initialData || { phone: '' },
    mode: 'onChange',
  });

  const watchedData = watch();

  useEffect(() => {
    if (watchedData.phone && !errors.phone) {
      onDataChange({ phone: watchedData.phone });
    }
  }, [watchedData.phone, errors.phone, onDataChange]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
          Use international format with country code (e.g., +1 for US)
        </p>
      </div>
    </div>
  );
}
