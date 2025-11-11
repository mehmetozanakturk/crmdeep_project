'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  Video,
  MapPin,
} from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: 'meeting' | 'deadline' | 'task' | 'call';
  attendees?: string[];
  location?: string;
  color: string;
}

const DEMO_EVENTS: CalendarEvent[] = [
  {
    id: '1',
    title: 'TechCorp Stratejik Toplantı',
    date: new Date(2024, 1, 15),
    startTime: '10:00',
    endTime: '11:30',
    type: 'meeting',
    attendees: ['Ahmet Y.', 'Zeynep K.', 'Mehmet S.'],
    location: 'Zoom',
    color: 'bg-primary-500',
  },
  {
    id: '2',
    title: 'Web Sitesi Tasarım Son Teslim',
    date: new Date(2024, 1, 18),
    startTime: '23:59',
    endTime: '23:59',
    type: 'deadline',
    color: 'bg-danger-500',
  },
  {
    id: '3',
    title: 'GreenLife Kampanya Görüşmesi',
    date: new Date(2024, 1, 20),
    startTime: '14:00',
    endTime: '15:00',
    type: 'call',
    attendees: ['Ayşe D.'],
    color: 'bg-success-500',
  },
  {
    id: '4',
    title: 'API Dokümantasyonu Tamamla',
    date: new Date(2024, 1, 22),
    startTime: '17:00',
    endTime: '18:00',
    type: 'task',
    color: 'bg-warning-500',
  },
  {
    id: '5',
    title: 'Ekip Retrospektifi',
    date: new Date(2024, 1, 23),
    startTime: '15:00',
    endTime: '16:30',
    type: 'meeting',
    attendees: ['Tüm Ekip'],
    location: 'Toplantı Odası 2',
    color: 'bg-primary-500',
  },
  {
    id: '6',
    title: 'BlueSky Mobil App Demo',
    date: new Date(2024, 1, 25),
    startTime: '11:00',
    endTime: '12:00',
    type: 'meeting',
    attendees: ['Emre B.', 'Selin A.'],
    location: 'Teams',
    color: 'bg-primary-500',
  },
  {
    id: '7',
    title: 'SEO Raporu Hazırla',
    date: new Date(2024, 1, 26),
    startTime: '09:00',
    endTime: '10:00',
    type: 'task',
    color: 'bg-warning-500',
  },
  {
    id: '8',
    title: 'Müşteri Portal Launch',
    date: new Date(2024, 1, 28),
    startTime: '00:00',
    endTime: '23:59',
    type: 'deadline',
    color: 'bg-danger-500',
  },
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 1, 1)); // February 2024
  const today = new Date();

  const monthNames = [
    'Ocak',
    'Şubat',
    'Mart',
    'Nisan',
    'Mayıs',
    'Haziran',
    'Temmuz',
    'Ağustos',
    'Eylül',
    'Ekim',
    'Kasım',
    'Aralık',
  ];

  const daysOfWeek = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Adjust for Monday start

    return { daysInMonth, startingDayOfWeek };
  };

  const getEventsForDate = (date: Date) => {
    return DEMO_EVENTS.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );
  };

  const upcomingEvents = DEMO_EVENTS.filter((event) => event.date >= today)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const calendarDays = [];

  // Add empty cells for days before the month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // Add the days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const getEventIcon = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'meeting':
        return <Users className="h-3 w-3" />;
      case 'call':
        return <Video className="h-3 w-3" />;
      case 'deadline':
        return <Clock className="h-3 w-3" />;
      case 'task':
        return <CalendarIcon className="h-3 w-3" />;
    }
  };

  const getEventTypeName = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'meeting':
        return 'Toplantı';
      case 'call':
        return 'Arama';
      case 'deadline':
        return 'Son Tarih';
      case 'task':
        return 'Görev';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Takvim</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">
            Tüm etkinliklerinizi tek yerden görüntüleyin
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Etkinlik
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Bu Ay</p>
                <p className="mt-1 text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                  {DEMO_EVENTS.length}
                </p>
              </div>
              <div className="rounded-lg bg-primary-100 dark:bg-primary-900/30 p-3">
                <CalendarIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Toplantılar</p>
                <p className="mt-1 text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {DEMO_EVENTS.filter((e) => e.type === 'meeting').length}
                </p>
              </div>
              <div className="rounded-lg bg-primary-100 dark:bg-primary-900/30 p-3">
                <Users className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Son Tarihler</p>
                <p className="mt-1 text-3xl font-bold text-danger-600 dark:text-danger-400">
                  {DEMO_EVENTS.filter((e) => e.type === 'deadline').length}
                </p>
              </div>
              <div className="rounded-lg bg-danger-100 dark:bg-danger-900/30 p-3">
                <Clock className="h-6 w-6 text-danger-600 dark:text-danger-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Görevler</p>
                <p className="mt-1 text-3xl font-bold text-warning-600 dark:text-warning-400">
                  {DEMO_EVENTS.filter((e) => e.type === 'task').length}
                </p>
              </div>
              <div className="rounded-lg bg-warning-100 dark:bg-warning-900/30 p-3">
                <CalendarIcon className="h-6 w-6 text-warning-600 dark:text-warning-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar View */}
        <Card className="border-neutral-200 dark:border-neutral-700 lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-neutral-900 dark:text-neutral-100">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  Bugün
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Days of Week */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {daysOfWeek.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-semibold text-neutral-600 dark:text-neutral-400 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day, index) => {
                if (!day) {
                  return <div key={`empty-${index}`} className="aspect-square" />;
                }

                const date = new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  day
                );
                const events = getEventsForDate(date);
                const isToday =
                  date.getDate() === today.getDate() &&
                  date.getMonth() === today.getMonth() &&
                  date.getFullYear() === today.getFullYear();

                return (
                  <div
                    key={day}
                    className={`aspect-square border rounded-lg p-1 transition-all hover:border-primary-500 dark:hover:border-primary-600 cursor-pointer ${
                      isToday
                        ? 'border-primary-500 dark:border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-neutral-200 dark:border-neutral-700'
                    }`}
                  >
                    <div
                      className={`text-xs font-semibold mb-1 ${
                        isToday
                          ? 'text-primary-600 dark:text-primary-400'
                          : 'text-neutral-900 dark:text-neutral-100'
                      }`}
                    >
                      {day}
                    </div>
                    <div className="space-y-0.5">
                      {events.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          className={`${event.color} dark:opacity-80 h-1.5 rounded-full`}
                          title={event.title}
                        />
                      ))}
                      {events.length > 2 && (
                        <div className="text-[10px] text-neutral-600 dark:text-neutral-400">
                          +{events.length - 2}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardHeader>
            <CardTitle className="text-neutral-900 dark:text-neutral-100">Yaklaşan Etkinlikler</CardTitle>
            <CardDescription className="text-neutral-600 dark:text-neutral-400">
              Önümüzdeki günler
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-lg border border-neutral-200 dark:border-neutral-700 p-3 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-2">
                        {event.title}
                      </h4>
                      <div className="mt-1 flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-400">
                        <CalendarIcon className="h-3 w-3" />
                        <span>
                          {event.date.toLocaleDateString('tr-TR', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="shrink-0 text-xs flex items-center gap-1"
                    >
                      {getEventIcon(event.type)}
                      {getEventTypeName(event.type)}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-400">
                    <Clock className="h-3 w-3" />
                    <span>
                      {event.startTime} - {event.endTime}
                    </span>
                  </div>

                  {event.location && (
                    <div className="flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-400">
                      <MapPin className="h-3 w-3" />
                      <span>{event.location}</span>
                    </div>
                  )}

                  {event.attendees && event.attendees.length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-400">
                      <Users className="h-3 w-3" />
                      <span>{event.attendees.join(', ')}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
