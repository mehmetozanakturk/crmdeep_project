import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Briefcase, FolderKanban, CheckSquare, Users } from 'lucide-react';

export default function DashboardPage() {
  // TODO: Replace with real data from Supabase
  const stats = [
    {
      name: 'Total Brands',
      value: '12',
      change: '+2',
      trend: 'up',
      icon: Briefcase,
    },
    {
      name: 'Active Projects',
      value: '24',
      change: '+5',
      trend: 'up',
      icon: FolderKanban,
    },
    {
      name: 'Pending Tasks',
      value: '47',
      change: '-8',
      trend: 'down',
      icon: CheckSquare,
    },
    {
      name: 'Team Members',
      value: '8',
      change: '+1',
      trend: 'up',
      icon: Users,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>
        <p className="mt-1 text-neutral-600">
          Welcome back! Here&apos;s what&apos;s happening with your business today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isPositive = stat.trend === 'up';

          return (
            <Card key={stat.name}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-neutral-600">
                  {stat.name}
                </CardTitle>
                <Icon className="h-4 w-4 text-neutral-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-neutral-900">{stat.value}</div>
                <div className="mt-1 flex items-center gap-1 text-xs">
                  {isPositive ? (
                    <TrendingUp className="h-3 w-3 text-success-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-danger-600" />
                  )}
                  <span className={isPositive ? 'text-success-600' : 'text-danger-600'}>
                    {stat.change}
                  </span>
                  <span className="text-neutral-500">from last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-primary-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-900">
                      Task completed: &ldquo;Update landing page&rdquo;
                    </p>
                    <p className="text-xs text-neutral-500">2 hours ago by John Doe</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>Tasks due in the next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: 'Client presentation', due: 'Tomorrow', priority: 'high' },
                { title: 'Design review', due: 'In 2 days', priority: 'medium' },
                { title: 'Weekly report', due: 'In 3 days', priority: 'low' },
                { title: 'Team meeting', due: 'In 5 days', priority: 'medium' },
              ].map((task, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{task.title}</p>
                    <p className="text-xs text-neutral-500">{task.due}</p>
                  </div>
                  <Badge
                    variant={
                      task.priority === 'high'
                        ? 'destructive'
                        : task.priority === 'medium'
                        ? 'warning'
                        : 'secondary'
                    }
                  >
                    {task.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to get you started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-4">
            <button className="rounded-lg border-2 border-dashed border-neutral-300 p-4 text-center transition-colors hover:border-primary-500 hover:bg-primary-50">
              <Briefcase className="mx-auto h-6 w-6 text-neutral-500" />
              <p className="mt-2 text-sm font-medium text-neutral-700">Add Brand</p>
            </button>
            <button className="rounded-lg border-2 border-dashed border-neutral-300 p-4 text-center transition-colors hover:border-primary-500 hover:bg-primary-50">
              <FolderKanban className="mx-auto h-6 w-6 text-neutral-500" />
              <p className="mt-2 text-sm font-medium text-neutral-700">New Project</p>
            </button>
            <button className="rounded-lg border-2 border-dashed border-neutral-300 p-4 text-center transition-colors hover:border-primary-500 hover:bg-primary-50">
              <CheckSquare className="mx-auto h-6 w-6 text-neutral-500" />
              <p className="mt-2 text-sm font-medium text-neutral-700">Create Task</p>
            </button>
            <button className="rounded-lg border-2 border-dashed border-neutral-300 p-4 text-center transition-colors hover:border-primary-500 hover:bg-primary-50">
              <Users className="mx-auto h-6 w-6 text-neutral-500" />
              <p className="mt-2 text-sm font-medium text-neutral-700">Invite Member</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
