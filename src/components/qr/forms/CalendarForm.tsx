'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { sanitizeText } from '@/lib/validations';
import { useEffect } from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';

// Define local schema without refine for form compatibility
const calendarFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Event title is required')
    .max(200, 'Title must be less than 200 characters'),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  location: z
    .string()
    .max(200, 'Location must be less than 200 characters')
    .optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  allDay: z.boolean().optional(),
});

type CalendarFormValues = z.infer<typeof calendarFormSchema>;

interface CalendarFormProps {
  onDataChange: (data: {
    title: string;
    description?: string;
    location?: string;
    startDate: string;
    endDate: string;
    allDay?: boolean;
  }) => void;
  initialData?: Partial<CalendarFormValues>;
}

export function CalendarForm({ onDataChange, initialData }: CalendarFormProps) {
  const {
    register,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<CalendarFormValues>({
    resolver: zodResolver(calendarFormSchema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      startDate: '',
      endDate: '',
      allDay: false,
      ...initialData,
    },
    mode: 'onChange',
  });

  const watchedData = watch();

  useEffect(() => {
    if (watchedData.title && watchedData.startDate && watchedData.endDate) {
      // Validate end date is after start date
      const start = new Date(watchedData.startDate);
      const end = new Date(watchedData.endDate);

      if (end < start) {
        setError('endDate', {
          type: 'manual',
          message: 'End date must be after or equal to start date',
        });
        return;
      }

      onDataChange({
        title: sanitizeText(watchedData.title),
        description: watchedData.description ? sanitizeText(watchedData.description) : undefined,
        location: watchedData.location ? sanitizeText(watchedData.location) : undefined,
        startDate: watchedData.startDate,
        endDate: watchedData.endDate,
        allDay: watchedData.allDay,
      });
    }
  }, [watchedData, onDataChange, setError]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Event Title *</Label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="title"
            placeholder="Team Meeting"
            className="pl-10"
            {...register('title')}
          />
        </div>
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Event details..."
          className="min-h-[60px] resize-none"
          {...register('description')}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="location"
            placeholder="Conference Room A"
            className="pl-10"
            {...register('location')}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="allDay"
          checked={watchedData.allDay}
          onCheckedChange={(checked) => setValue('allDay', !!checked)}
        />
        <Label htmlFor="allDay" className="font-normal cursor-pointer">
          All day event
        </Label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start *</Label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="startDate"
              type={watchedData.allDay ? 'date' : 'datetime-local'}
              className="pl-10"
              {...register('startDate')}
            />
          </div>
          {errors.startDate && (
            <p className="text-sm text-destructive">{errors.startDate.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End *</Label>
          <Input
            id="endDate"
            type={watchedData.allDay ? 'date' : 'datetime-local'}
            {...register('endDate')}
          />
          {errors.endDate && (
            <p className="text-sm text-destructive">{errors.endDate.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
