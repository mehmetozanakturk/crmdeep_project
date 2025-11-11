'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: 'meeting' | 'deadline' | 'task' | 'call';
  attendees?: string[];
  location?: string;
  color: string;
  created_at: string;
  updated_at: string;
}

const eventSchema = z.object({
  title: z.string().min(2, 'Başlık en az 2 karakter olmalı'),
  description: z.string().optional(),
  date: z.string().min(1, 'Tarih gerekli'),
  startTime: z.string().min(1, 'Başlangıç saati gerekli'),
  endTime: z.string().min(1, 'Bitiş saati gerekli'),
  type: z.enum(['meeting', 'deadline', 'task', 'call']),
  location: z.string().optional(),
  attendees: z.string().optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

interface AddEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEventAdded: (event: CalendarEvent) => void;
  preselectedDate?: Date;
}

const EVENT_COLORS = {
  meeting: 'bg-primary-500',
  deadline: 'bg-danger-500',
  task: 'bg-warning-500',
  call: 'bg-success-500',
};

export function AddEventModal({
  open,
  onOpenChange,
  onEventAdded,
  preselectedDate,
}: AddEventModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      date: preselectedDate
        ? preselectedDate.toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '10:00',
      type: 'meeting',
      location: '',
      attendees: '',
    },
  });

  const eventType = watch('type');

  const onSubmit = async (data: EventFormData) => {
    setIsSubmitting(true);

    try {
      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        title: data.title,
        description: data.description,
        date: new Date(data.date),
        startTime: data.startTime,
        endTime: data.endTime,
        type: data.type,
        location: data.location || undefined,
        attendees: data.attendees ? data.attendees.split(',').map((a) => a.trim()) : undefined,
        color: EVENT_COLORS[data.type],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      onEventAdded(newEvent);
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Yeni Etkinlik Ekle</DialogTitle>
          <DialogDescription>
            Takviminize yeni etkinlik ekleyin. Tüm alanları doldurun.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="title">Başlık *</Label>
            <Input
              id="title"
              placeholder="Örn: Müşteri Toplantısı"
              {...register('title')}
              className="mt-1"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-danger-600">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Açıklama</Label>
            <Textarea
              id="description"
              placeholder="Etkinlik detayları..."
              {...register('description')}
              className="mt-1"
              rows={3}
            />
          </div>

          {/* Type */}
          <div>
            <Label htmlFor="type">Etkinlik Tipi *</Label>
            <Select
              value={eventType}
              onValueChange={(value) => setValue('type', value as CalendarEvent['type'])}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Tip seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="meeting">Toplantı</SelectItem>
                <SelectItem value="call">Arama</SelectItem>
                <SelectItem value="task">Görev</SelectItem>
                <SelectItem value="deadline">Son Tarih</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div>
            <Label htmlFor="date">Tarih *</Label>
            <Input
              id="date"
              type="date"
              {...register('date')}
              className="mt-1"
            />
            {errors.date && (
              <p className="mt-1 text-xs text-danger-600">{errors.date.message}</p>
            )}
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startTime">Başlangıç *</Label>
              <Input
                id="startTime"
                type="time"
                {...register('startTime')}
                className="mt-1"
              />
              {errors.startTime && (
                <p className="mt-1 text-xs text-danger-600">{errors.startTime.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="endTime">Bitiş *</Label>
              <Input
                id="endTime"
                type="time"
                {...register('endTime')}
                className="mt-1"
              />
              {errors.endTime && (
                <p className="mt-1 text-xs text-danger-600">{errors.endTime.message}</p>
              )}
            </div>
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="location">Konum</Label>
            <Input
              id="location"
              placeholder="Örn: Zoom, Toplantı Odası 2"
              {...register('location')}
              className="mt-1"
            />
          </div>

          {/* Attendees */}
          <div>
            <Label htmlFor="attendees">Katılımcılar (virgülle ayırın)</Label>
            <Input
              id="attendees"
              placeholder="Örn: Ahmet Y., Zeynep K."
              {...register('attendees')}
              className="mt-1"
            />
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Katılımcıları virgülle ayırın
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              İptal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Etkinlik Ekle
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
