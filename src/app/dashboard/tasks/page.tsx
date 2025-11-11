'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Plus,
  CheckSquare,
  Circle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  User,
  Paperclip,
  MessageSquare,
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee: { name: string; initials: string; color: string };
  dueDate: string;
  project: string;
  tags: string[];
  attachments: number;
  comments: number;
}

const DEMO_TASKS: Task[] = [
  {
    id: '1',
    title: 'Landing page tasarımı',
    description: 'Ana sayfa için modern ve responsive tasarım',
    status: 'in-progress',
    priority: 'high',
    assignee: { name: 'Ahmet Y.', initials: 'AY', color: '#3B82F6' },
    dueDate: '2024-02-20',
    project: 'Web Sitesi Yenileme',
    tags: ['Design', 'Frontend'],
    attachments: 3,
    comments: 5,
  },
  {
    id: '2',
    title: 'API dokümantasyonu',
    description: 'REST API endpoints için detaylı döküman hazırla',
    status: 'todo',
    priority: 'medium',
    assignee: { name: 'Zeynep K.', initials: 'ZK', color: '#10B981' },
    dueDate: '2024-02-25',
    project: 'Web Sitesi Yenileme',
    tags: ['Documentation'],
    attachments: 0,
    comments: 2,
  },
  {
    id: '3',
    title: 'Instagram görselleri',
    description: 'Bahar koleksiyonu için 10 adet sosyal medya görseli',
    status: 'review',
    priority: 'high',
    assignee: { name: 'Ayşe D.', initials: 'AD', color: '#EC4899' },
    dueDate: '2024-02-18',
    project: 'Sosyal Medya Kampanyası',
    tags: ['Design', 'Social Media'],
    attachments: 10,
    comments: 8,
  },
  {
    id: '4',
    title: 'Database migrasyonu',
    description: 'PostgreSQL 15 versiyonuna geçiş',
    status: 'todo',
    priority: 'high',
    assignee: { name: 'Emre B.', initials: 'EB', color: '#0EA5E9' },
    dueDate: '2024-02-22',
    project: 'Mobil Uygulama Geliştirme',
    tags: ['Backend', 'Database'],
    attachments: 1,
    comments: 3,
  },
  {
    id: '5',
    title: 'Push notification sistemi',
    description: 'FCM entegrasyonu ve bildirim yönetimi',
    status: 'in-progress',
    priority: 'medium',
    assignee: { name: 'Selin A.', initials: 'SA', color: '#14B8A6' },
    dueDate: '2024-03-01',
    project: 'Mobil Uygulama Geliştirme',
    tags: ['Mobile', 'Backend'],
    attachments: 2,
    comments: 4,
  },
  {
    id: '6',
    title: 'SEO optimizasyonu',
    description: 'Meta tags, sitemap ve robots.txt düzenlemesi',
    status: 'done',
    priority: 'medium',
    assignee: { name: 'Mehmet S.', initials: 'MS', color: '#8B5CF6' },
    dueDate: '2024-02-10',
    project: 'Web Sitesi Yenileme',
    tags: ['SEO', 'Marketing'],
    attachments: 0,
    comments: 6,
  },
  {
    id: '7',
    title: 'Kullanıcı testleri',
    description: '20 kullanıcı ile usability testing',
    status: 'todo',
    priority: 'low',
    assignee: { name: 'Can T.', initials: 'CT', color: '#F59E0B' },
    dueDate: '2024-03-05',
    project: 'Sosyal Medya Kampanyası',
    tags: ['Research', 'UX'],
    attachments: 0,
    comments: 1,
  },
  {
    id: '8',
    title: 'Payment gateway entegrasyonu',
    description: 'Stripe ve iyzico ödeme sistemleri',
    status: 'in-progress',
    priority: 'high',
    assignee: { name: 'Burak M.', initials: 'BM', color: '#EF4444' },
    dueDate: '2024-02-28',
    project: 'E-Ticaret Entegrasyonu',
    tags: ['Backend', 'Payment'],
    attachments: 4,
    comments: 12,
  },
  {
    id: '9',
    title: 'Hata raporları analizi',
    description: 'Sentry loglarını incele ve önceliklendir',
    status: 'review',
    priority: 'medium',
    assignee: { name: 'Deniz K.', initials: 'DK', color: '#8B5CF6' },
    dueDate: '2024-02-19',
    project: 'Mobil Uygulama Geliştirme',
    tags: ['Bug', 'Testing'],
    attachments: 5,
    comments: 7,
  },
  {
    id: '10',
    title: 'Email template tasarımı',
    description: 'Transactional email şablonları',
    status: 'done',
    priority: 'low',
    assignee: { name: 'Fatma Y.', initials: 'FY', color: '#EC4899' },
    dueDate: '2024-02-05',
    project: 'E-Ticaret Entegrasyonu',
    tags: ['Design', 'Email'],
    attachments: 8,
    comments: 4,
  },
  {
    id: '11',
    title: 'Performance optimization',
    description: 'Bundle size azaltma ve lazy loading',
    status: 'review',
    priority: 'high',
    assignee: { name: 'Hakan G.', initials: 'HG', color: '#EF4444' },
    dueDate: '2024-02-21',
    project: 'Web Sitesi Yenileme',
    tags: ['Performance', 'Frontend'],
    attachments: 2,
    comments: 9,
  },
  {
    id: '12',
    title: 'Dark mode implementasyonu',
    description: 'Tüm sayfalarda dark theme desteği',
    status: 'done',
    priority: 'medium',
    assignee: { name: 'İrem S.', initials: 'İS', color: '#10B981' },
    dueDate: '2024-02-08',
    project: 'Web Sitesi Yenileme',
    tags: ['Frontend', 'UI'],
    attachments: 1,
    comments: 3,
  },
];

const COLUMNS = [
  {
    key: 'todo',
    label: 'Yapılacak',
    icon: Circle,
    color: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
  },
  {
    key: 'in-progress',
    label: 'Devam Ediyor',
    icon: Clock,
    color: 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300',
  },
  {
    key: 'review',
    label: 'İncelemede',
    icon: AlertCircle,
    color: 'bg-warning-100 text-warning-700 dark:bg-warning-900/40 dark:text-warning-300',
  },
  {
    key: 'done',
    label: 'Tamamlandı',
    icon: CheckCircle2,
    color: 'bg-success-100 text-success-700 dark:bg-success-900/40 dark:text-success-300',
  },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(DEMO_TASKS);

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter((task) => task.status === status);
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-danger-600 dark:text-danger-400 border-danger-200 dark:border-danger-800';
      case 'medium':
        return 'text-warning-600 dark:text-warning-400 border-warning-200 dark:border-warning-800';
      case 'low':
        return 'text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700';
    }
  };

  const getPriorityLabel = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'Yüksek';
      case 'medium':
        return 'Orta';
      case 'low':
        return 'Düşük';
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Görevler</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">
            Tüm görevlerinizi kanban board ile yönetin
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Görev
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Toplam</p>
                <p className="mt-1 text-3xl font-bold text-neutral-900 dark:text-neutral-100">{tasks.length}</p>
              </div>
              <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 p-3">
                <CheckSquare className="h-6 w-6 text-neutral-600 dark:text-neutral-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Devam Eden</p>
                <p className="mt-1 text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {getTasksByStatus('in-progress').length}
                </p>
              </div>
              <div className="rounded-lg bg-primary-100 dark:bg-primary-900/30 p-3">
                <Clock className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">İncelemede</p>
                <p className="mt-1 text-3xl font-bold text-warning-600 dark:text-warning-400">
                  {getTasksByStatus('review').length}
                </p>
              </div>
              <div className="rounded-lg bg-warning-100 dark:bg-warning-900/30 p-3">
                <AlertCircle className="h-6 w-6 text-warning-600 dark:text-warning-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Tamamlanan</p>
                <p className="mt-1 text-3xl font-bold text-success-600 dark:text-success-400">
                  {getTasksByStatus('done').length}
                </p>
              </div>
              <div className="rounded-lg bg-success-100 dark:bg-success-900/30 p-3">
                <CheckCircle2 className="h-6 w-6 text-success-600 dark:text-success-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Kanban Board */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {COLUMNS.map((column) => {
          const Icon = column.icon;
          const columnTasks = getTasksByStatus(column.key as Task['status']);

          return (
            <div key={column.key} className="flex flex-col gap-3">
              {/* Column Header */}
              <div className={`flex items-center justify-between rounded-lg p-3 ${column.color}`}>
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5" />
                  <h3 className="font-semibold">{column.label}</h3>
                </div>
                <Badge variant="secondary" className="bg-white/50 dark:bg-black/20">
                  {columnTasks.length}
                </Badge>
              </div>

              {/* Tasks */}
              <div className="space-y-3">
                {columnTasks.map((task) => (
                  <Card
                    key={task.id}
                    className={`border-2 cursor-pointer transition-all hover:shadow-md dark:hover:border-neutral-600 ${getPriorityColor(
                      task.priority
                    )}`}
                  >
                    <CardHeader className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-2">
                            {task.title}
                          </CardTitle>
                          <Badge
                            variant="outline"
                            className="shrink-0 text-xs"
                          >
                            {getPriorityLabel(task.priority)}
                          </Badge>
                        </div>
                        <CardDescription className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">
                          {task.description}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-3">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {task.tags.map((tag, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-xs bg-neutral-100 dark:bg-neutral-800"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Project */}
                      <div className="text-xs text-neutral-600 dark:text-neutral-400">
                        📁 {task.project}
                      </div>

                      {/* Due Date */}
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-neutral-500 dark:text-neutral-400" />
                        <span
                          className={`text-xs ${
                            isOverdue(task.dueDate) && task.status !== 'done'
                              ? 'text-danger-600 dark:text-danger-400 font-semibold'
                              : 'text-neutral-600 dark:text-neutral-400'
                          }`}
                        >
                          {new Date(task.dueDate).toLocaleDateString('tr-TR', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-700">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback
                            style={{
                              backgroundColor: task.assignee.color + '20',
                              color: task.assignee.color,
                            }}
                            className="text-xs font-semibold"
                          >
                            {task.assignee.initials}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex items-center gap-3 text-neutral-500 dark:text-neutral-400">
                          {task.attachments > 0 && (
                            <div className="flex items-center gap-1">
                              <Paperclip className="h-3 w-3" />
                              <span className="text-xs">{task.attachments}</span>
                            </div>
                          )}
                          {task.comments > 0 && (
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              <span className="text-xs">{task.comments}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Add Task Button */}
                <Button
                  variant="outline"
                  className="w-full border-dashed border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400 dark:hover:border-neutral-600"
                  size="sm"
                >
                  <Plus className="mr-2 h-3 w-3" />
                  Görev Ekle
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
