'use client';

import { type CalendarEvent } from '@/components/calendar/AddEventModal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Video,
  Phone,
  CheckSquare,
  CalendarDays,
  Edit,
  Trash2,
} from 'lucide-react';

interface EventDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: CalendarEvent;
  onEdit: (event: CalendarEvent) => void;
  onDelete: (eventId: string) => void;
}

const getEventTypeConfig = (type: CalendarEvent['type']) => {
  switch (type) {
    case 'meeting':
      return {
        icon: <Video className="h-5 w-5" />,
        label: 'Toplantı',
        color: 'text-primary-600 dark:text-primary-400',
        bg: 'bg-primary-100 dark:bg-primary-900/30',
      };
    case 'call':
      return {
        icon: <Phone className="h-5 w-5" />,
        label: 'Arama',
        color: 'text-success-600 dark:text-success-400',
        bg: 'bg-success-100 dark:bg-success-900/30',
      };
    case 'deadline':
      return {
        icon: <CalendarDays className="h-5 w-5" />,
        label: 'Son Tarih',
        color: 'text-danger-600 dark:text-danger-400',
        bg: 'bg-danger-100 dark:bg-danger-900/30',
      };
    case 'task':
      return {
        icon: <CheckSquare className="h-5 w-5" />,
        label: 'Görev',
        color: 'text-warning-600 dark:text-warning-400',
        bg: 'bg-warning-100 dark:bg-warning-900/30',
      };
  }
};

export function EventDetailModal({
  open,
  onOpenChange,
  event,
  onEdit,
  onDelete,
}: EventDetailModalProps) {
  const typeConfig = getEventTypeConfig(event.type);
  const isTaskEvent = event.id.startsWith('task-');

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className={`rounded-lg ${typeConfig.bg} p-3`}>
              <div className={typeConfig.color}>{typeConfig.icon}</div>
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{event.title}</DialogTitle>
              <Badge variant="outline" className="text-xs">
                {typeConfig.icon}
                <span className="ml-1">{typeConfig.label}</span>
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Description */}
          {event.description && (
            <div>
              <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                Açıklama
              </h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {event.description}
              </p>
            </div>
          )}

          {/* Date and Time */}
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-start gap-3 rounded-lg border border-neutral-200 dark:border-neutral-700 p-3">
              <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 p-2">
                <Calendar className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Tarih</p>
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mt-0.5">
                  {formatDate(event.date)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-neutral-200 dark:border-neutral-700 p-3">
              <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 p-2">
                <Clock className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Saat</p>
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mt-0.5">
                  {event.startTime} - {event.endTime}
                </p>
              </div>
            </div>
          </div>

          {/* Location */}
          {event.location && (
            <div className="flex items-start gap-3 rounded-lg border border-neutral-200 dark:border-neutral-700 p-3">
              <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 p-2">
                <MapPin className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Konum</p>
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mt-0.5">
                  {event.location}
                </p>
              </div>
            </div>
          )}

          {/* Attendees */}
          {event.attendees && event.attendees.length > 0 && (
            <div className="flex items-start gap-3 rounded-lg border border-neutral-200 dark:border-neutral-700 p-3">
              <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 p-2">
                <Users className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2">
                  Katılımcılar
                </p>
                <div className="flex flex-wrap gap-2">
                  {event.attendees.map((attendee, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {attendee}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Created/Updated Info */}
          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <div className="grid grid-cols-2 gap-4 text-xs text-neutral-500 dark:text-neutral-400">
              <div>
                <span className="font-medium">Oluşturulma:</span>{' '}
                {new Date(event.created_at).toLocaleDateString('tr-TR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </div>
              <div>
                <span className="font-medium">Güncelleme:</span>{' '}
                {new Date(event.updated_at).toLocaleDateString('tr-TR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-4 border-t border-neutral-200 dark:border-neutral-700">
            {!isTaskEvent && (
              <Button
                onClick={() => {
                  onEdit(event);
                  onOpenChange(false);
                }}
                className="flex-1"
              >
                <Edit className="mr-2 h-4 w-4" />
                Düzenle
              </Button>
            )}
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(event.id);
                onOpenChange(false);
              }}
              className={isTaskEvent ? 'flex-1' : ''}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Sil
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
