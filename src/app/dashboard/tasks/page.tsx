'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  CheckSquare,
  Circle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  CalendarPlus,
  User,
  Paperclip,
  MessageSquare,
  MoreVertical,
  Edit,
  Trash2,
  ArrowRight,
  LayoutGrid,
  List,
  CalendarDays,
  Filter,
  SortAsc,
  SortDesc,
  Search,
  Loader2,
} from 'lucide-react';
import { AddTaskModal } from '@/components/tasks/AddTaskModal';
import { EditTaskModal } from '@/components/tasks/EditTaskModal';
import { TaskDetailModal } from '@/components/tasks/TaskDetailModal';
import { getActiveWorkspaceId } from '@/lib/workspace-storage';
import * as TasksAPI from '@/lib/api/tasks';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee: { name: string; initials: string; color: string };
  dueDate: string;
  project: string;
  projectId?: string; // Link to project
  tags: string[];
  attachments: number;
  comments: number;
  inCalendar?: boolean;
  created_at: string;
  updated_at: string;
}

type ViewMode = 'board' | 'list' | 'timeline';
type DateFilter = 'all' | 'today' | 'week' | 'month' | 'overdue';
type SortBy = 'dueDate' | 'priority' | 'created' | 'title';

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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortBy>('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [groupBy, setGroupBy] = useState<string>('none');
  const [availableProjects, setAvailableProjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Load from Supabase
  useEffect(() => {
    loadTasksData();

    const handleWorkspaceChange = () => {
      loadTasksData();
    };

    window.addEventListener('workspaceChanged', handleWorkspaceChange);

    return () => {
      window.removeEventListener('workspaceChanged', handleWorkspaceChange);
    };
  }, []);

  const loadTasksData = async () => {
    try {
      setLoading(true);
      const workspaceId = getActiveWorkspaceId();
      if (!workspaceId) {
        console.warn('No active workspace');
        setLoading(false);
        return;
      }

      const data = await TasksAPI.loadTasks(workspaceId);
      setTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskAdded = async (newTask: Task) => {
    await loadTasksData();
  };

  const handleTaskUpdated = async (updatedTask: Task) => {
    await loadTasksData();
  };

  const handleDeleteTask = async (taskId: string) => {
    if (confirm('Bu görevi silmek istediğinizden emin misiniz?')) {
      const success = await TasksAPI.deleteTask(taskId);
      if (success) {
        await loadTasksData();
      }
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
    const result = await TasksAPI.updateTask({
      id: taskId,
      status: newStatus,
    });
    if (result) {
      await loadTasksData();
    }
  };

  const _handleStatusChange_OLD = (taskId: string, newStatus: Task['status']) => {
    setTasks(tasks.map(t =>
      t.id === taskId
        ? { ...t, status: newStatus, updated_at: new Date().toISOString() }
        : t
    ));
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setDetailModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setDetailModalOpen(false);
    setEditModalOpen(true);
  };

  const handleToggleCalendar = (taskId: string) => {
    setTasks(tasks.map(t =>
      t.id === taskId
        ? { ...t, inCalendar: !t.inCalendar, updated_at: new Date().toISOString() }
        : t
    ));
  };

  // Filter tasks by date range
  const filterByDate = (tasks: Task[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const monthFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    switch (dateFilter) {
      case 'today':
        return tasks.filter(t => {
          const dueDate = new Date(t.dueDate);
          return dueDate.toDateString() === today.toDateString();
        });
      case 'week':
        return tasks.filter(t => {
          const dueDate = new Date(t.dueDate);
          return dueDate >= today && dueDate <= weekFromNow;
        });
      case 'month':
        return tasks.filter(t => {
          const dueDate = new Date(t.dueDate);
          return dueDate >= today && dueDate <= monthFromNow;
        });
      case 'overdue':
        return tasks.filter(t => {
          const dueDate = new Date(t.dueDate);
          return dueDate < today && t.status !== 'done';
        });
      default:
        return tasks;
    }
  };

  // Sort tasks
  const sortTasks = (tasks: Task[]) => {
    const sorted = [...tasks].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'dueDate':
          comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
          break;
        case 'created':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title, 'tr');
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return sorted;
  };

  // Get filtered and sorted tasks
  const getFilteredTasks = () => {
    let filtered = tasks;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.project.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply date filter
    filtered = filterByDate(filtered);

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => t.status === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(t => t.priority === priorityFilter);
    }

    // Apply project filter (if a specific project is selected in groupBy)
    if (groupBy !== 'none' && groupBy !== 'all-projects' && groupBy !== 'priority' && groupBy !== 'assignee') {
      // If groupBy is a specific project name, filter by that project
      if (availableProjects.includes(groupBy)) {
        filtered = filtered.filter(t => t.project === groupBy);
      }
    }

    // Apply sorting
    filtered = sortTasks(filtered);

    return filtered;
  };

  // Group tasks
  const getGroupedTasks = () => {
    const filtered = getFilteredTasks();

    if (groupBy === 'none') {
      return { 'Tüm Görevler': filtered };
    }

    // If groupBy is a specific project name, filter by that project
    if (availableProjects.includes(groupBy)) {
      const projectTasks = filtered.filter(task => task.project === groupBy);
      return { [groupBy]: projectTasks };
    }

    const grouped: Record<string, Task[]> = {};

    filtered.forEach((task) => {
      let groupKey = '';

      switch (groupBy) {
        case 'all-projects':
          groupKey = task.project || 'Projesiz';
          break;
        case 'priority':
          groupKey = task.priority === 'high' ? 'Yüksek Öncelik' :
                     task.priority === 'medium' ? 'Orta Öncelik' : 'Düşük Öncelik';
          break;
        case 'assignee':
          groupKey = task.assignee.name;
          break;
        default:
          groupKey = 'Tüm Görevler';
      }

      if (!grouped[groupKey]) {
        grouped[groupKey] = [];
      }
      grouped[groupKey].push(task);
    });

    return grouped;
  };

  const getTasksByStatus = (status: Task['status']) => {
    const filtered = getFilteredTasks();
    return filtered.filter((task) => task.status === status);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary-600 dark:text-primary-400" />
          <h3 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Görevler yükleniyor...
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Görevler</h1>
            <p className="mt-1 text-neutral-600 dark:text-neutral-400">
              {tasks.length} görev Supabase'den yüklendi
            </p>
          </div>
          <Button onClick={() => setAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Görev
          </Button>
        </div>

        {/* Filters and View Options */}
        <div className="flex flex-wrap items-center gap-3 p-4 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700">
          {/* View Mode */}
          <div className="flex items-center gap-2 border-r border-neutral-200 dark:border-neutral-700 pr-3">
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Görünüm:</span>
            <div className="flex rounded-md border border-neutral-200 dark:border-neutral-700">
              <Button
                variant={viewMode === 'board' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('board')}
                className="rounded-r-none"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-none border-x border-neutral-200 dark:border-neutral-700"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'timeline' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('timeline')}
                className="rounded-l-none"
              >
                <CalendarDays className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Date Filter */}
          <Select value={dateFilter} onValueChange={(v) => setDateFilter(v as DateFilter)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Tarih filtrele" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Görevler</SelectItem>
              <SelectItem value="today">Bugün</SelectItem>
              <SelectItem value="week">Bu Hafta</SelectItem>
              <SelectItem value="month">Bu Ay</SelectItem>
              <SelectItem value="overdue">Gecikmiş</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Durum" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Durumlar</SelectItem>
              <SelectItem value="todo">Yapılacak</SelectItem>
              <SelectItem value="in-progress">Devam Ediyor</SelectItem>
              <SelectItem value="review">İncelemede</SelectItem>
              <SelectItem value="done">Tamamlandı</SelectItem>
            </SelectContent>
          </Select>

          {/* Priority Filter */}
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Öncelik" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Öncelikler</SelectItem>
              <SelectItem value="high">Yüksek</SelectItem>
              <SelectItem value="medium">Orta</SelectItem>
              <SelectItem value="low">Düşük</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort Options */}
          <div className="flex items-center gap-2 border-l border-neutral-200 dark:border-neutral-700 pl-3">
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortBy)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sırala" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dueDate">Bitiş Tarihi</SelectItem>
                <SelectItem value="priority">Öncelik</SelectItem>
                <SelectItem value="created">Oluşturma</SelectItem>
                <SelectItem value="title">İsim</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            </Button>
          </div>

          {/* Group By */}
          <Select value={groupBy} onValueChange={setGroupBy}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Gruplama" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Gruplama Yok</SelectItem>
              <SelectItem value="all-projects">Tüm Projelere Göre</SelectItem>
              {availableProjects.length > 0 && (
                <>
                  <div className="px-2 py-1.5 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                    Projeler
                  </div>
                  {availableProjects.map((projectName) => (
                    <SelectItem key={projectName} value={projectName}>
                      📁 {projectName}
                    </SelectItem>
                  ))}
                  <div className="my-1 h-px bg-neutral-200 dark:bg-neutral-700" />
                </>
              )}
              <SelectItem value="priority">Önceliğe Göre</SelectItem>
              <SelectItem value="assignee">Kişiye Göre</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input
            placeholder="Görevlerde ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
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
                    className={`border-2 transition-all hover:shadow-md dark:hover:border-neutral-600 cursor-pointer ${getPriorityColor(
                      task.priority
                    )}`}
                  >
                    <CardHeader
                      className="p-4"
                      onClick={() => handleTaskClick(task)}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-2">
                            {task.title}
                          </CardTitle>
                          <div className="flex items-center gap-1 shrink-0">
                            <Badge
                              variant="outline"
                              className="text-xs"
                            >
                              {getPriorityLabel(task.priority)}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleEditTask(task)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Düzenle
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleToggleCalendar(task.id)}>
                                  <CalendarPlus className="mr-2 h-4 w-4" />
                                  {task.inCalendar ? 'Takvimden Kaldır' : 'Takvime Ekle'}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel>Durumu Değiştir</DropdownMenuLabel>
                                {COLUMNS.filter(col => col.key !== task.status).map(col => (
                                  <DropdownMenuItem
                                    key={col.key}
                                    onClick={() => handleStatusChange(task.id, col.key as Task['status'])}
                                  >
                                    <ArrowRight className="mr-2 h-4 w-4" />
                                    {col.label}
                                  </DropdownMenuItem>
                                ))}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDeleteTask(task.id)}
                                  className="text-danger-600 dark:text-danger-400"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Sil
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        <CardDescription className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">
                          {task.description}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-3">
                      {/* Project Badge */}
                      <div>
                        <Badge variant="outline" className="bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-primary-700">
                          📁 {task.project}
                        </Badge>
                      </div>

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

                      {/* Due Date and Calendar Badge */}
                      <div className="flex items-center justify-between">
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
                        {task.inCalendar && (
                          <Badge variant="secondary" className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                            📅 Takvimde
                          </Badge>
                        )}
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

      {/* Add Task Modal */}
      <AddTaskModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onTaskAdded={handleTaskAdded}
      />

      {/* Edit Task Modal */}
      {selectedTask && (
        <EditTaskModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          task={selectedTask}
          onTaskUpdated={handleTaskUpdated}
        />
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          open={detailModalOpen}
          onOpenChange={setDetailModalOpen}
          task={selectedTask}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onToggleCalendar={handleToggleCalendar}
        />
      )}
    </div>
  );
}
