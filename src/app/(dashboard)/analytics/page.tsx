import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Analytics</h1>
        <p className="mt-1 text-neutral-600">Deep insights into your business performance</p>
      </div>

      {/* Analytics Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Email Analytics</CardTitle>
          </CardHeader>
          <CardContent className="flex h-64 items-center justify-center">
            <div className="text-center">
              <BarChart3 className="mx-auto h-12 w-12 text-neutral-300" />
              <p className="mt-2 text-sm text-neutral-500">Connect your email to see analytics</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Website Analytics</CardTitle>
          </CardHeader>
          <CardContent className="flex h-64 items-center justify-center">
            <div className="text-center">
              <BarChart3 className="mx-auto h-12 w-12 text-neutral-300" />
              <p className="mt-2 text-sm text-neutral-500">
                Connect Google Analytics to see data
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales Pipeline</CardTitle>
          </CardHeader>
          <CardContent className="flex h-64 items-center justify-center">
            <div className="text-center">
              <BarChart3 className="mx-auto h-12 w-12 text-neutral-300" />
              <p className="mt-2 text-sm text-neutral-500">Create deals to track sales</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Performance</CardTitle>
          </CardHeader>
          <CardContent className="flex h-64 items-center justify-center">
            <div className="text-center">
              <BarChart3 className="mx-auto h-12 w-12 text-neutral-300" />
              <p className="mt-2 text-sm text-neutral-500">Invite team members to see metrics</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
