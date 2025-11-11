import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, FolderKanban } from 'lucide-react';

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Projects</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">Organize your work with projects</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Empty State */}
      <Card className="border-neutral-200 dark:border-neutral-700">
        <CardContent className="flex min-h-[400px] flex-col items-center justify-center">
          <FolderKanban className="h-16 w-16 text-neutral-300 dark:text-neutral-600" />
          <h3 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">No projects yet</h3>
          <p className="mt-2 max-w-sm text-center text-sm text-neutral-600 dark:text-neutral-400">
            Projects help you organize tasks and collaborate with your team. Create your first
            project to get started.
          </p>
          <Button className="mt-6">
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Project
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
