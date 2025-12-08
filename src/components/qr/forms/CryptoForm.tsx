'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CRYPTO_OPTIONS } from '@/lib/constants';
import { useEffect } from 'react';
import { Wallet, DollarSign } from 'lucide-react';
import { CryptoType } from '@/types/qr';
import { sanitizeText } from '@/lib/validations';

// Local schema without refine for form compatibility
const cryptoFormSchema = z.object({
  type: z.enum(['bitcoin', 'ethereum']),
  address: z.string().min(1, 'Wallet address is required'),
  amount: z.number().positive('Amount must be positive').optional(),
  label: z.string().max(100, 'Label must be less than 100 characters').optional(),
  message: z.string().max(200, 'Message must be less than 200 characters').optional(),
});

type CryptoFormValues = z.infer<typeof cryptoFormSchema>;

const bitcoinAddressRegex = /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}$/;
const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/;

interface CryptoFormProps {
  onDataChange: (data: {
    type: CryptoType;
    address: string;
    amount?: number;
    label?: string;
    message?: string;
  }) => void;
  initialData?: Partial<CryptoFormValues>;
}

export function CryptoForm({ onDataChange, initialData }: CryptoFormProps) {
  const {
    register,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<CryptoFormValues>({
    resolver: zodResolver(cryptoFormSchema),
    defaultValues: {
      type: 'bitcoin',
      address: '',
      amount: undefined,
      label: '',
      message: '',
      ...initialData,
    },
    mode: 'onChange',
  });

  const watchedData = watch();

  useEffect(() => {
    if (watchedData.address) {
      // Validate address format
      const isValidAddress =
        (watchedData.type === 'bitcoin' && bitcoinAddressRegex.test(watchedData.address)) ||
        (watchedData.type === 'ethereum' && ethereumAddressRegex.test(watchedData.address));

      if (!isValidAddress) {
        setError('address', {
          type: 'manual',
          message: 'Invalid wallet address format',
        });
        return;
      }

      clearErrors('address');

      onDataChange({
        type: watchedData.type,
        address: watchedData.address,
        amount: watchedData.amount,
        label: watchedData.label ? sanitizeText(watchedData.label) : undefined,
        message: watchedData.message ? sanitizeText(watchedData.message) : undefined,
      });
    }
  }, [watchedData, onDataChange, setError, clearErrors]);

  const addressPlaceholder =
    watchedData.type === 'bitcoin'
      ? 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
      : '0x742d35Cc6634C0532925a3b844Bc9e7595f...';

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Cryptocurrency</Label>
        <Select
          value={watchedData.type}
          onValueChange={(value) => setValue('type', value as CryptoType)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select cryptocurrency" />
          </SelectTrigger>
          <SelectContent>
            {CRYPTO_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Wallet Address *</Label>
        <div className="relative">
          <Wallet className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="address"
            placeholder={addressPlaceholder}
            className="pl-10 font-mono text-sm"
            {...register('address')}
          />
        </div>
        {errors.address && (
          <p className="text-sm text-destructive">{errors.address.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount (Optional)</Label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="amount"
            type="number"
            step="any"
            min="0"
            placeholder="0.001"
            className="pl-10"
            {...register('amount', { valueAsNumber: true })}
          />
        </div>
        {errors.amount && (
          <p className="text-sm text-destructive">{errors.amount.message}</p>
        )}
        <p className="text-sm text-muted-foreground">
          Amount in {watchedData.type === 'bitcoin' ? 'BTC' : 'ETH'}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="label">Label (Optional)</Label>
        <Input id="label" placeholder="Payment for services" {...register('label')} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message (Optional)</Label>
        <Input id="message" placeholder="Thank you!" {...register('message')} />
      </div>
    </div>
  );
}
