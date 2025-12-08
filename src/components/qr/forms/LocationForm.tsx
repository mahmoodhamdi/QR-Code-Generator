'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
import { sanitizeText } from '@/lib/validations';

const locationFormSchema = z.object({
  latitude: z.number().min(-90, 'Latitude must be between -90 and 90').max(90, 'Latitude must be between -90 and 90'),
  longitude: z.number().min(-180, 'Longitude must be between -180 and 180').max(180, 'Longitude must be between -180 and 180'),
  label: z.string().max(100, 'Label must be less than 100 characters').optional(),
});

type LocationFormValues = z.infer<typeof locationFormSchema>;

interface LocationFormProps {
  onDataChange: (data: LocationFormValues) => void;
  initialData?: Partial<LocationFormValues>;
}

export function LocationForm({ onDataChange, initialData }: LocationFormProps) {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LocationFormValues>({
    resolver: zodResolver(locationFormSchema),
    defaultValues: {
      latitude: initialData?.latitude ?? 0,
      longitude: initialData?.longitude ?? 0,
      label: initialData?.label ?? '',
    },
    mode: 'onChange',
  });

  const watchedData = watch();

  useEffect(() => {
    if (watchedData.latitude !== 0 || watchedData.longitude !== 0) {
      onDataChange({
        latitude: watchedData.latitude,
        longitude: watchedData.longitude,
        label: watchedData.label ? sanitizeText(watchedData.label) : undefined,
      });
    }
  }, [watchedData, onDataChange]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setIsGettingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setValue('latitude', position.coords.latitude);
        setValue('longitude', position.coords.longitude);
        setIsGettingLocation(false);
      },
      (error) => {
        setIsGettingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location permission denied');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information unavailable');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out');
            break;
          default:
            setLocationError('An error occurred getting your location');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={getCurrentLocation}
          disabled={isGettingLocation}
          className="w-full"
        >
          {isGettingLocation ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Getting location...
            </>
          ) : (
            <>
              <Navigation className="mr-2 h-4 w-4" />
              Use Current Location
            </>
          )}
        </Button>
      </div>

      {locationError && (
        <p className="text-sm text-destructive">{locationError}</p>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="latitude">Latitude *</Label>
          <Input
            id="latitude"
            type="number"
            step="any"
            placeholder="40.7128"
            {...register('latitude', { valueAsNumber: true })}
          />
          {errors.latitude && (
            <p className="text-sm text-destructive">{errors.latitude.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="longitude">Longitude *</Label>
          <Input
            id="longitude"
            type="number"
            step="any"
            placeholder="-74.0060"
            {...register('longitude', { valueAsNumber: true })}
          />
          {errors.longitude && (
            <p className="text-sm text-destructive">{errors.longitude.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="label">Location Label</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="label"
            placeholder="e.g., Central Park, New York"
            className="pl-10"
            {...register('label')}
          />
        </div>
        {errors.label && (
          <p className="text-sm text-destructive">{errors.label.message}</p>
        )}
      </div>

      {watchedData.latitude !== 0 && watchedData.longitude !== 0 && (
        <div className="p-3 bg-muted rounded-lg text-sm">
          <p className="font-medium">Preview:</p>
          <p className="text-muted-foreground">
            {watchedData.latitude.toFixed(6)}, {watchedData.longitude.toFixed(6)}
            {watchedData.label && ` (${watchedData.label})`}
          </p>
        </div>
      )}
    </div>
  );
}
