import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Briefcase } from 'lucide-react';

export default function BrandsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Brands</h1>
          <p className="mt-1 text-neutral-600">Manage all your brands in one place</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Brand
        </Button>
      </div>

      {/* Empty State / Brand Grid will go here */}
      <Card>
        <CardContent className="flex min-h-[400px] flex-col items-center justify-center">
          <Briefcase className="h-16 w-16 text-neutral-300" />
          <h3 className="mt-4 text-lg font-semibold text-neutral-900">No brands yet</h3>
          <p className="mt-2 max-w-sm text-center text-sm text-neutral-600">
            Get started by creating your first brand. You can add logos, colors, and connect
            analytics.
          </p>
          <Button className="mt-6">
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Brand
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
