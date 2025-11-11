'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  Video,
  MapPin,
  MoreVertical,
  Edit,
  Trash2,
} from 'lucide-react';
import { AddEventModal, type CalendarEvent } from '@/components/calendar/AddEventModal';
import { EditEventModal } from '@/components/calendar/EditEventModal';
import { type Task } from '../tasks/page';

const EVENTS_STORAGE_KEY = 'crmdeep_calendar_events';
const TASKS_STORAGE_KEY = 'crmdeep_tasks';

const getDefaultEvents = (): CalendarEvent[] => {
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  return [
    {
      id: '1',
      title: 'TechCorp Stratejik Toplantı',
      description: 'Yıllık stratejik planlama toplantısı',
      date: new Date(thisYear, thisMonth, 15),
      startTime: '10:00',
      endTime: '11:30',
      type: 'meeting',
      attendees: ['Ahmet Y.', 'Zeynep K.', 'Mehmet S.'],
      location: 'Zoom',
      color: 'bg-primary-500',
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    },
    {
      id: '2',
      title: 'Web Sitesi Tasarım Son Teslim',
      description: 'Web sitesi tasarımının final teslimi',
      date: new Date(thisYear, thisMonth, 18),
      startTime: '23:59',
      endTime: '23:59',
      type: 'deadline',
      color: 'bg-danger-500',
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    },
    {
      id: '3',
      title: 'GreenLife Kampanya Görüşmesi',
      description: 'Yeni kampanya stratejisi',
      date: new Date(thisYear, thisMonth, 20),
      startTime: '14:00',
      endTime: '15:00',
      type: 'call',
      attendees: ['Ayşe D.'],
      color: 'bg-success-500',
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    },
    {
      id: '4',
      title: 'Ekip Retrospektifi',
      description: 'Sprint retrospektif toplantısı',
      date: new Date(thisYear, thisMonth, 23),
      startTime: '15:00',
      endTime: '16:30',
      type: 'meeting',
      attendees: ['Tüm Ekip'],
      location: 'Toplantı Odası 2',
      color: 'bg-primary-500',
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    },
  ];
};

const DEMO_EVENTS = getDefaultEvents();

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [calendarTasks, setCalendarTasks] = useState<Task[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const today = new Date();

  // Load events from localStorage
  useEffect(() => {
    const storedEvents = localStorage.getItem(EVENTS_STORAGE_KEY);
    if (storedEvents) {
      const parsed = JSON.parse(storedEvents);
      // Convert date strings back to Date objects
      const eventsWithDates = parsed.map((e: any) => ({
        ...e,
        date: new Date(e.date),
      }));
      setEvents(eventsWithDates);
    } else {
      setEvents(DEMO_EVENTS);
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(DEMO_EVENTS));
    }
  }, []);

  // Load tasks that are marked for calendar
  useEffect(() => {
    const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
    if (storedTasks) {
      const parsed: Task[] = JSON.parse(storedTasks);
      const tasksForCalendar = parsed.filter((t) => t.inCalendar);
      setCalendarTasks(tasksForCalendar);
    }
  }, []);

  // Save events to localStorage whenever they change
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
    }
  }, [events]);

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

  const handleEventAdded = (newEvent: CalendarEvent) => {
    setEvents([newEvent, ...events]);
  };

  const handleEventUpdated = (updatedEvent: CalendarEvent) => {
    setEvents(events.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)));
  };

  const handleDeleteEvent = (eventId: string) => {
    if (confirm('Bu etkinliği silmek istediğinizden emin misiniz?')) {
      setEvents(events.filter((e) => e.id !== eventId));
    }
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setEditModalOpen(true);
  };

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddEventForDate = () => {
    setAddModalOpen(true);
  };

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
    // Get regular events
    const regularEvents = events.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );

    // Get tasks marked for calendar
    const taskEvents: CalendarEvent[] = calendarTasks
      .filter((task) => {
        const taskDate = new Date(task.dueDate);
        return (
          taskDate.getDate() === date.getDate() &&
          taskDate.getMonth() === date.getMonth() &&
          taskDate.getFullYear() === date.getFullYear()
        );
      })
      .map((task) => ({
        id: `task-${task.id}`,
        title: task.title,
        description: task.description,
        date: new Date(task.dueDate),
        startTime: '09:00',
        endTime: '17:00',
        type: 'task' as const,
        color: 'bg-warning-500',
        created_at: task.created_at,
        updated_at: task.updated_at,
      }));

    return [...regularEvents, ...taskEvents];
  };

  // Combine events and tasks for upcoming events list
  const allEventsAndTasks = [
    ...events,
    ...calendarTasks.map((task) => ({
      id: `task-${task.id}`,
      title: task.title,
      description: task.description,
      date: new Date(task.dueDate),
      startTime: '09:00',
      endTime: '17:00',
      type: 'task' as const,
      color: 'bg-warning-500',
      created_at: task.created_at,
      updated_at: task.updated_at,
    })),
  ];

  const upcomingEvents = allEventsAndTasks
    .filter((event) => event.date >= today)
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
        <Button onClick={() => setAddModalOpen(true)}>
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
                  {allEventsAndTasks.filter(e =>
                    e.date.getMonth() === currentDate.getMonth() &&
                    e.date.getFullYear() === currentDate.getFullYear()
                  ).length}
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
                  {allEventsAndTasks.filter((e) => e.type === 'meeting').length}
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
                  {allEventsAndTasks.filter((e) => e.type === 'deadline').length}
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
                  {allEventsAndTasks.filter((e) => e.type === 'task').length}
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
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={handlePreviousMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleToday}>
                  Bugün
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleNextMonth}>
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
                const isSelected =
                  selectedDate &&
                  date.getDate() === selectedDate.getDate() &&
                  date.getMonth() === selectedDate.getMonth() &&
                  date.getFullYear() === selectedDate.getFullYear();

                return (
                  <div
                    key={day}
                    onClick={() => handleDateClick(date)}
                    className={`aspect-square border-2 rounded-lg p-1 transition-all hover:border-primary-500 dark:hover:border-primary-600 cursor-pointer ${
                      isSelected
                        ? 'border-primary-600 dark:border-primary-500 bg-primary-100 dark:bg-primary-900/30 ring-2 ring-primary-300 dark:ring-primary-700'
                        : isToday
                        ? 'border-primary-400 dark:border-primary-500 bg-primary-50 dark:bg-primary-900/20'
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

        {/* Selected Day Details */}
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardHeader>
            <CardTitle className="text-neutral-900 dark:text-neutral-100">
              {selectedDate
                ? new Date(selectedDate).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : 'Gün Seçin'}
            </CardTitle>
            <CardDescription className="text-neutral-600 dark:text-neutral-400">
              {selectedDate
                ? `${getEventsForDate(selectedDate).length} etkinlik`
                : 'Takvimden bir gün seçin'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedDate ? (
              <div className="space-y-4">
                {/* Add Event Button */}
                <Button
                  onClick={handleAddEventForDate}
                  className="w-full"
                  variant="outline"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Bu Güne Etkinlik Ekle
                </Button>

                {/* Events for selected date */}
                {getEventsForDate(selectedDate).length > 0 ? (
                  getEventsForDate(selectedDate).map((event) => (
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
                    <div className="flex items-center gap-1">
                      <Badge
                        variant="outline"
                        className="shrink-0 text-xs flex items-center gap-1"
                      >
                        {getEventIcon(event.type)}
                        {getEventTypeName(event.type)}
                      </Badge>
                      {!event.id.startsWith('task-') && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleEditEvent(event)}>
                              <Edit className="mr-2 h-3 w-3" />
                              Düzenle
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteEvent(event.id)}
                              className="text-danger-600 dark:text-danger-400"
                            >
                              <Trash2 className="mr-2 h-3 w-3" />
                              Sil
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-400">
                    <Clock className="h-3 w-3" />
                    <span>
                      {event.startTime} - {event.endTime}
                    </span>
                  </div>

                  {'location' in event && event.location && (
                    <div className="flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-400">
                      <MapPin className="h-3 w-3" />
                      <span>{event.location}</span>
                    </div>
                  )}

                  {'attendees' in event && event.attendees && event.attendees.length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-400">
                      <Users className="h-3 w-3" />
                      <span>{event.attendees.join(', ')}</span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
                <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Bu günde etkinlik yok</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
            <CalendarIcon className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="text-sm mb-2">Takvimden bir gün seçin</p>
            <p className="text-xs">O günün etkinliklerini görmek için herhangi bir tarihe tıklayın</p>
          </div>
        )}
          </CardContent>
        </Card>
      </div>

      {/* Add Event Modal */}
      <AddEventModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onEventAdded={handleEventAdded}
        preselectedDate={selectedDate}
      />

      {/* Edit Event Modal */}
      {selectedEvent && (
        <EditEventModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          event={selectedEvent}
          onEventUpdated={handleEventUpdated}
        />
      )}
    </div>
  );
}
