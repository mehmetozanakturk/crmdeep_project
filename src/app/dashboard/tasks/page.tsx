import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, CheckSquare } from 'lucide-react';

export default function TasksPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Tasks</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">Manage your tasks and to-dos</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      {/* View Toggle (List / Kanban) - Placeholder */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          List View
        </Button>
        <Button variant="outline" size="sm">
          Kanban Board
        </Button>
      </div>

      {/* Empty State */}
      <Card className="border-neutral-200 dark:border-neutral-700">
        <CardContent className="flex min-h-[400px] flex-col items-center justify-center">
          <CheckSquare className="h-16 w-16 text-neutral-300 dark:text-neutral-600" />
          <h3 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">No tasks yet</h3>
          <p className="mt-2 max-w-sm text-center text-sm text-neutral-600 dark:text-neutral-400">
            Stay organized by creating tasks. You can assign them to team members, set due dates,
            and track progress.
          </p>
          <Button className="mt-6">
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Task
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
