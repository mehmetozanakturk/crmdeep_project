import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Calendar</h1>
          <p className="mt-1 text-neutral-600">View all your tasks and events in one place</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Event
        </Button>
      </div>

      {/* Calendar Placeholder */}
      <Card>
        <CardContent className="flex min-h-[600px] flex-col items-center justify-center">
          <CalendarIcon className="h-16 w-16 text-neutral-300" />
          <h3 className="mt-4 text-lg font-semibold text-neutral-900">
            Calendar integration coming soon
          </h3>
          <p className="mt-2 max-w-sm text-center text-sm text-neutral-600">
            We&apos;re working on bringing you a unified calendar view. Soon you&apos;ll be able to see all
            your task deadlines and events here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
