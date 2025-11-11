'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  TrendingUp,
  TrendingDown,
  Briefcase,
  FolderKanban,
  CheckSquare,
  Users,
  DollarSign,
  Target,
  BarChart3,
  Calendar,
  Clock,
  AlertCircle,
  Star,
  ArrowUpRight,
  Activity,
} from 'lucide-react';
import { AddCompanyModal } from '@/components/companies/AddCompanyModal';
import { AddProjectModal } from '@/components/projects/AddProjectModal';
import { AddTaskModal } from '@/components/tasks/AddTaskModal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function DashboardPage() {
  const [isAddCompanyModalOpen, setIsAddCompanyModalOpen] = useState(false);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [timeRange, setTimeRange] = useState('30');
  // TODO: Replace with real data from Supabase
  const stats = [
    {
      name: 'Total Revenue',
      value: '$124,500',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      description: 'vs last month',
      color: 'text-success-600',
    },
    {
      name: 'Active Brands',
      value: '12',
      change: '+2',
      trend: 'up',
      icon: Briefcase,
      description: '2 new this month',
      color: 'text-primary-600',
    },
    {
      name: 'Active Projects',
      value: '24',
      change: '+5',
      trend: 'up',
      icon: FolderKanban,
      description: '18 in progress',
      color: 'text-warning-600',
    },
    {
      name: 'Completion Rate',
      value: '87%',
      change: '+3.2%',
      trend: 'up',
      icon: Target,
      description: 'task completion',
      color: 'text-success-600',
    },
  ];

  const salesPipeline = [
    { stage: 'Leads', count: 45, value: '$225,000', color: 'bg-neutral-500' },
    { stage: 'Qualified', count: 28, value: '$168,000', color: 'bg-primary-500' },
    { stage: 'Proposal', count: 15, value: '$112,500', color: 'bg-warning-500' },
    { stage: 'Negotiation', count: 8, value: '$64,000', color: 'bg-success-500' },
    { stage: 'Closed Won', count: 12, value: '$96,000', color: 'bg-success-600' },
  ];

  const brandPerformance = [
    { name: 'TechCorp Solutions', revenue: '$45,200', growth: '+18%', projects: 8, status: 'excellent' },
    { name: 'Digital Marketing Co', revenue: '$32,800', growth: '+12%', projects: 5, status: 'good' },
    { name: 'E-commerce Plus', revenue: '$28,400', growth: '+8%', projects: 6, status: 'good' },
    { name: 'StartUp Ventures', revenue: '$18,100', growth: '-5%', projects: 3, status: 'needs-attention' },
    { name: 'Creative Agency', revenue: '$24,600', growth: '+15%', projects: 4, status: 'excellent' },
  ];

  const recentActivity = [
    {
      user: 'Sarah Johnson',
      action: 'completed task',
      target: 'Q4 Marketing Campaign',
      time: '5 minutes ago',
      type: 'task',
      avatar: '',
    },
    {
      user: 'Michael Chen',
      action: 'created project',
      target: 'Website Redesign 2024',
      time: '1 hour ago',
      type: 'project',
      avatar: '',
    },
    {
      user: 'Emily Rodriguez',
      action: 'closed deal',
      target: '$15,000 - Enterprise Package',
      time: '2 hours ago',
      type: 'deal',
      avatar: '',
    },
    {
      user: 'David Kim',
      action: 'added brand',
      target: 'New Tech Startup Inc.',
      time: '3 hours ago',
      type: 'brand',
      avatar: '',
    },
    {
      user: 'Lisa Anderson',
      action: 'commented on',
      target: 'Mobile App Development',
      time: '5 hours ago',
      type: 'comment',
      avatar: '',
    },
  ];

  const upcomingTasks = [
    {
      title: 'Client presentation for TechCorp',
      brand: 'TechCorp Solutions',
      due: '2 hours',
      priority: 'high',
      assignee: 'Sarah J.',
      progress: 75,
    },
    {
      title: 'Review marketing analytics report',
      brand: 'Digital Marketing Co',
      due: 'Tomorrow, 10:00 AM',
      priority: 'high',
      assignee: 'Michael C.',
      progress: 45,
    },
    {
      title: 'Design review meeting',
      brand: 'Creative Agency',
      due: 'Tomorrow, 2:00 PM',
      priority: 'medium',
      assignee: 'Emily R.',
      progress: 60,
    },
    {
      title: 'Update project timeline',
      brand: 'E-commerce Plus',
      due: 'In 2 days',
      priority: 'medium',
      assignee: 'David K.',
      progress: 30,
    },
    {
      title: 'Prepare monthly report',
      brand: 'Multiple Brands',
      due: 'In 3 days',
      priority: 'low',
      assignee: 'Lisa A.',
      progress: 15,
    },
  ];

  const teamPerformance = [
    { name: 'Sarah Johnson', role: 'Project Manager', tasksCompleted: 47, efficiency: 94 },
    { name: 'Michael Chen', role: 'Developer', tasksCompleted: 52, efficiency: 89 },
    { name: 'Emily Rodriguez', role: 'Sales Lead', tasksCompleted: 38, efficiency: 92 },
    { name: 'David Kim', role: 'Designer', tasksCompleted: 41, efficiency: 87 },
  ];

  const projectStatus = [
    { status: 'On Track', count: 14, percentage: 58 },
    { status: 'At Risk', count: 6, percentage: 25 },
    { status: 'Delayed', count: 2, percentage: 8 },
    { status: 'Completed', count: 2, percentage: 8 },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Dashboard</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">
            Welcome back! Here&apos;s a comprehensive overview of your business.
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Bugün</SelectItem>
              <SelectItem value="7">Son 7 gün</SelectItem>
              <SelectItem value="30">Son 30 gün</SelectItem>
              <SelectItem value="90">Son 90 gün</SelectItem>
              <SelectItem value="180">Son 6 ay</SelectItem>
              <SelectItem value="365">Son 1 yıl</SelectItem>
              <SelectItem value="all">Tüm zamanlar</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isPositive = stat.trend === 'up';

          return (
            <Card key={stat.name}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  {stat.name}
                </CardTitle>
                <div className={`rounded-lg bg-neutral-100 dark:bg-neutral-700 p-2 ${stat.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">{stat.value}</div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs">
                    {isPositive ? (
                      <TrendingUp className="h-3 w-3 text-success-600" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-danger-600" />
                    )}
                    <span className={isPositive ? 'text-success-600' : 'text-danger-600'}>
                      {stat.change}
                    </span>
                  </div>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">{stat.description}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Sales Pipeline & Project Status */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Sales Pipeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary-600" />
              Sales Pipeline
            </CardTitle>
            <CardDescription>Current opportunities and their stages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {salesPipeline.map((stage, index) => (
                <div key={stage.stage}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${stage.color}`} />
                      <span className="font-medium text-neutral-900 dark:text-neutral-100">{stage.stage}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-neutral-600 dark:text-neutral-400">{stage.count} deals</span>
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">{stage.value}</span>
                    </div>
                  </div>
                  <Progress
                    value={(stage.count / salesPipeline[0].count) * 100}
                    className="h-3"
                    indicatorClassName={stage.color}
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-lg bg-primary-50 dark:bg-primary-900/20 p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-primary-900 dark:text-primary-100">Total Pipeline Value</span>
                <span className="text-lg font-bold text-primary-600 dark:text-primary-400">$665,500</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary-600" />
              Project Status Overview
            </CardTitle>
            <CardDescription>Current status of all active projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projectStatus.map((item) => (
                <div key={item.status}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-neutral-900 dark:text-neutral-100">{item.status}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-600 dark:text-neutral-400">{item.count} projects</span>
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">{item.percentage}%</span>
                    </div>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                </div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-emerald-50 dark:bg-emerald-500/10 p-3 text-center border border-emerald-200 dark:border-emerald-500/20">
                <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">On-time delivery</p>
                <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">92%</p>
              </div>
              <div className="rounded-lg bg-amber-50 dark:bg-amber-500/10 p-3 text-center border border-amber-200 dark:border-amber-500/20">
                <p className="text-xs font-medium text-amber-700 dark:text-amber-400">Avg. completion</p>
                <p className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">68%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Brand Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary-600" />
            Brand Performance
          </CardTitle>
          <CardDescription>Revenue and project metrics for each brand</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700">
                  <th className="pb-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400">BRAND NAME</th>
                  <th className="pb-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400">REVENUE</th>
                  <th className="pb-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400">GROWTH</th>
                  <th className="pb-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400">PROJECTS</th>
                  <th className="pb-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {brandPerformance.map((brand, index) => (
                  <tr key={brand.name} className="border-b border-neutral-100 dark:border-neutral-800">
                    <td className="py-3 text-sm font-medium text-neutral-900 dark:text-neutral-100">{brand.name}</td>
                    <td className="py-3 text-right text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      {brand.revenue}
                    </td>
                    <td className="py-3 text-right text-sm">
                      <span
                        className={
                          brand.growth.startsWith('+') ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'
                        }
                      >
                        {brand.growth}
                      </span>
                    </td>
                    <td className="py-3 text-right text-sm text-neutral-600 dark:text-neutral-400">{brand.projects}</td>
                    <td className="py-3 text-right">
                      <Badge
                        variant={
                          brand.status === 'excellent'
                            ? 'default'
                            : brand.status === 'good'
                            ? 'secondary'
                            : 'destructive'
                        }
                      >
                        {brand.status === 'excellent'
                          ? 'Excellent'
                          : brand.status === 'good'
                          ? 'Good'
                          : 'Needs Attention'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity & Upcoming Tasks */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary-600" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest updates from your team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={activity.avatar} />
                    <AvatarFallback className="bg-primary-100 text-xs text-primary-600">
                      {activity.user
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm text-neutral-900 dark:text-neutral-100">
                      <span className="font-medium">{activity.user}</span>{' '}
                      <span className="text-neutral-600 dark:text-neutral-400">{activity.action}</span>{' '}
                      <span className="font-medium">{activity.target}</span>
                    </p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-neutral-400 dark:text-neutral-500" />
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full rounded-lg border border-neutral-200 dark:border-neutral-700 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800">
              View all activity
            </button>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-primary-600" />
              Upcoming Tasks
            </CardTitle>
            <CardDescription>Tasks due in the next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.map((task, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{task.title}</p>
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
                      <div className="mt-1 flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                        <span>{task.brand}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {task.due}
                        </span>
                        <span>•</span>
                        <span>{task.assignee}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={task.progress} className="h-1.5" />
                    <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">{task.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full rounded-lg border border-neutral-200 dark:border-neutral-700 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800">
              View all tasks
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Team Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary-600" />
            Team Performance
          </CardTitle>
          <CardDescription>Individual performance metrics for this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {teamPerformance.map((member) => (
              <div key={member.name} className="rounded-lg border border-neutral-200 dark:border-neutral-700 p-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                      {member.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-neutral-100">{member.name}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">{member.role}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600 dark:text-neutral-400">Tasks completed</span>
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">{member.tasksCompleted}</span>
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-neutral-600 dark:text-neutral-400">Efficiency</span>
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">{member.efficiency}%</span>
                    </div>
                    <Progress value={member.efficiency} className="h-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used actions to boost productivity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <button
              onClick={() => setIsAddCompanyModalOpen(true)}
              className="group flex items-center gap-3 rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-700 p-4 transition-all hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20"
            >
              <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 p-2 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30">
                <Briefcase className="h-5 w-5 text-neutral-500 dark:text-neutral-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Add Brand</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Create new brand</p>
              </div>
            </button>
            <button
              onClick={() => setIsAddProjectModalOpen(true)}
              className="group flex items-center gap-3 rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-700 p-4 transition-all hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20"
            >
              <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 p-2 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30">
                <FolderKanban className="h-5 w-5 text-neutral-500 dark:text-neutral-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">New Project</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Start new project</p>
              </div>
            </button>
            <button
              onClick={() => setIsAddTaskModalOpen(true)}
              className="group flex items-center gap-3 rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-700 p-4 transition-all hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20"
            >
              <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 p-2 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30">
                <CheckSquare className="h-5 w-5 text-neutral-500 dark:text-neutral-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Create Task</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Add new task</p>
              </div>
            </button>
            <button className="group flex items-center gap-3 rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-700 p-4 transition-all hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 opacity-50 cursor-not-allowed">
              <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 p-2 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30">
                <Users className="h-5 w-5 text-neutral-500 dark:text-neutral-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Invite Member</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Coming soon</p>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <AddCompanyModal
        open={isAddCompanyModalOpen}
        onOpenChange={setIsAddCompanyModalOpen}
        onCompanyAdded={() => {
          // Refresh dashboard data
          window.location.reload();
        }}
        organizationId="demo-org"
      />

      <AddProjectModal
        open={isAddProjectModalOpen}
        onOpenChange={setIsAddProjectModalOpen}
        onProjectAdded={() => {
          // Refresh dashboard data
          window.location.reload();
        }}
      />

      <AddTaskModal
        open={isAddTaskModalOpen}
        onOpenChange={setIsAddTaskModalOpen}
        onTaskAdded={() => {
          // Refresh dashboard data
          window.location.reload();
        }}
        organizationId="demo-org"
      />
    </div>
  );
}
