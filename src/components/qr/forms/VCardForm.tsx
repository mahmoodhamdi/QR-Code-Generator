'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useEffect } from 'react';
import { User, Building, Briefcase, Mail, Phone, Globe, MapPin } from 'lucide-react';
import { SECURITY_LIMITS } from '@/lib/constants';
import { sanitizeText } from '@/lib/validations';

const vcardFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(SECURITY_LIMITS.maxNameLength, 'First name is too long'),
  lastName: z.string().max(SECURITY_LIMITS.maxNameLength, 'Last name is too long').optional(),
  organization: z.string().max(100, 'Organization name is too long').optional(),
  title: z.string().max(100, 'Title is too long').optional(),
  email: z.string().email('Invalid email format').max(SECURITY_LIMITS.maxEmailLength, 'Email is too long').optional().or(z.literal('')),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  fax: z.string().optional(),
  website: z.string().max(SECURITY_LIMITS.maxUrlLength, 'Website URL is too long').optional(),
  street: z.string().max(200, 'Street address is too long').optional(),
  city: z.string().max(100, 'City name is too long').optional(),
  state: z.string().max(100, 'State name is too long').optional(),
  zip: z.string().max(20, 'ZIP code is too long').optional(),
  country: z.string().max(100, 'Country name is too long').optional(),
  note: z.string().max(500, 'Note is too long').optional(),
});

type VCardFormValues = z.infer<typeof vcardFormSchema>;

interface VCardFormProps {
  onDataChange: (data: VCardFormValues) => void;
  initialData?: Partial<VCardFormValues>;
}

export function VCardForm({ onDataChange, initialData }: VCardFormProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm<VCardFormValues>({
    resolver: zodResolver(vcardFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      organization: '',
      title: '',
      email: '',
      phone: '',
      mobile: '',
      fax: '',
      website: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      note: '',
      ...initialData,
    },
    mode: 'onChange',
  });

  const watchedData = watch();

  useEffect(() => {
    if (watchedData.firstName) {
      const sanitized: VCardFormValues = {
        firstName: sanitizeText(watchedData.firstName),
        lastName: watchedData.lastName ? sanitizeText(watchedData.lastName) : undefined,
        organization: watchedData.organization ? sanitizeText(watchedData.organization) : undefined,
        title: watchedData.title ? sanitizeText(watchedData.title) : undefined,
        email: watchedData.email || undefined,
        phone: watchedData.phone || undefined,
        mobile: watchedData.mobile || undefined,
        fax: watchedData.fax || undefined,
        website: watchedData.website || undefined,
        street: watchedData.street ? sanitizeText(watchedData.street) : undefined,
        city: watchedData.city ? sanitizeText(watchedData.city) : undefined,
        state: watchedData.state ? sanitizeText(watchedData.state) : undefined,
        zip: watchedData.zip ? sanitizeText(watchedData.zip) : undefined,
        country: watchedData.country ? sanitizeText(watchedData.country) : undefined,
        note: watchedData.note ? sanitizeText(watchedData.note) : undefined,
      };
      onDataChange(sanitized);
    }
  }, [watchedData, onDataChange]);

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-muted-foreground">Personal Information</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="firstName"
                placeholder="John"
                className="pl-10"
                {...register('firstName')}
              />
            </div>
            {errors.firstName && (
              <p className="text-sm text-destructive">{errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" placeholder="Doe" {...register('lastName')} />
            {errors.lastName && (
              <p className="text-sm text-destructive">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="organization">Organization</Label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="organization"
                placeholder="Company Inc."
                className="pl-10"
                {...register('organization')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Job Title</Label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="title"
                placeholder="Software Engineer"
                className="pl-10"
                {...register('title')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-muted-foreground">Contact Information</h4>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              className="pl-10"
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Work Phone</Label>
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile</Label>
            <Input
              id="mobile"
              type="tel"
              placeholder="+1234567890"
              {...register('mobile')}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="website"
              type="url"
              placeholder="https://example.com"
              className="pl-10"
              {...register('website')}
            />
          </div>
          {errors.website && (
            <p className="text-sm text-destructive">{errors.website.message}</p>
          )}
        </div>
      </div>

      {/* Address */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-muted-foreground">Address</h4>
        <div className="space-y-2">
          <Label htmlFor="street">Street Address</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="street"
              placeholder="123 Main Street"
              className="pl-10"
              {...register('street')}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" placeholder="New York" {...register('city')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State/Province</Label>
            <Input id="state" placeholder="NY" {...register('state')} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="zip">ZIP/Postal Code</Label>
            <Input id="zip" placeholder="10001" {...register('zip')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input id="country" placeholder="USA" {...register('country')} />
          </div>
        </div>
      </div>

      {/* Note */}
      <div className="space-y-2">
        <Label htmlFor="note">Note</Label>
        <Textarea
          id="note"
          placeholder="Additional information..."
          className="min-h-[60px] resize-none"
          {...register('note')}
        />
        {errors.note && (
          <p className="text-sm text-destructive">{errors.note.message}</p>
        )}
      </div>
    </div>
  );
}
