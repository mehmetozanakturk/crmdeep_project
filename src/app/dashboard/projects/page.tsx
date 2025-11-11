'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
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
  FolderKanban,
  Search,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreVertical,
  Edit,
  Trash2,
} from 'lucide-react';
import { AddProjectModal } from '@/components/projects/AddProjectModal';
import { EditProjectModal } from '@/components/projects/EditProjectModal';
import { ProjectDetailModal } from '@/components/projects/ProjectDetailModal';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold' | 'at-risk';
  progress: number;
  startDate: string;
  endDate: string;
  teamMembers: { name: string; initials: string; color: string }[];
  tasksTotal: number;
  tasksCompleted: number;
  brand: string;
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}

const STORAGE_KEY = 'crmdeep_projects';

const DEMO_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Web Sitesi Yenileme',
    description: 'TechCorp kurumsal web sitesinin yeniden tasarımı',
    status: 'active',
    progress: 65,
    startDate: '2024-01-15',
    endDate: '2024-03-30',
    teamMembers: [
      { name: 'Ahmet Y.', initials: 'AY', color: '#3B82F6' },
      { name: 'Zeynep K.', initials: 'ZK', color: '#10B981' },
      { name: 'Mehmet S.', initials: 'MS', color: '#8B5CF6' },
    ],
    tasksTotal: 24,
    tasksCompleted: 16,
    brand: 'TechCorp',
    priority: 'high',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Sosyal Medya Kampanyası',
    description: 'GreenLife bahar dönemi sosyal medya stratejisi',
    status: 'active',
    progress: 45,
    startDate: '2024-02-01',
    endDate: '2024-04-15',
    teamMembers: [
      { name: 'Ayşe D.', initials: 'AD', color: '#EC4899' },
      { name: 'Can T.', initials: 'CT', color: '#F59E0B' },
    ],
    tasksTotal: 18,
    tasksCompleted: 8,
    brand: 'GreenLife',
    priority: 'medium',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Mobil Uygulama Geliştirme',
    description: 'BlueSky Airlines iOS ve Android uygulaması',
    status: 'at-risk',
    progress: 30,
    startDate: '2024-01-01',
    endDate: '2024-02-28',
    teamMembers: [
      { name: 'Emre B.', initials: 'EB', color: '#0EA5E9' },
      { name: 'Selin A.', initials: 'SA', color: '#14B8A6' },
      { name: 'Burak M.', initials: 'BM', color: '#EF4444' },
      { name: 'Deniz K.', initials: 'DK', color: '#8B5CF6' },
    ],
    tasksTotal: 32,
    tasksCompleted: 10,
    brand: 'BlueSky Airlines',
    priority: 'high',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'E-Ticaret Entegrasyonu',
    description: 'StyleHub online satış platformu kurulumu',
    status: 'on-hold',
    progress: 20,
    startDate: '2024-02-10',
    endDate: '2024-05-20',
    teamMembers: [
      { name: 'Fatma Y.', initials: 'FY', color: '#EC4899' },
    ],
    tasksTotal: 15,
    tasksCompleted: 3,
    brand: 'StyleHub',
    priority: 'low',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Müşteri Portal Geliştirme',
    description: 'AutoMax müşteri self-servis portalı',
    status: 'active',
    progress: 80,
    startDate: '2023-12-01',
    endDate: '2024-02-15',
    teamMembers: [
      { name: 'Hakan G.', initials: 'HG', color: '#EF4444' },
      { name: 'İrem S.', initials: 'İS', color: '#10B981' },
    ],
    tasksTotal: 20,
    tasksCompleted: 16,
    brand: 'AutoMax',
    priority: 'high',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Online Eğitim Platformu',
    description: 'EduPro video streaming ve kurs yönetimi',
    status: 'completed',
    progress: 100,
    startDate: '2023-11-01',
    endDate: '2024-01-31',
    teamMembers: [
      { name: 'Kemal Ö.', initials: 'KÖ', color: '#8B5CF6' },
      { name: 'Lale P.', initials: 'LP', color: '#EC4899' },
      { name: 'Murat R.', initials: 'MR', color: '#F59E0B' },
    ],
    tasksTotal: 28,
    tasksCompleted: 28,
    brand: 'EduPro',
    priority: 'medium',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setProjects(JSON.parse(stored));
    } else {
      setProjects(DEMO_PROJECTS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_PROJECTS));
    }
  }, []);

  // Save to localStorage whenever projects change
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    }
  }, [projects]);

  const handleProjectAdded = (newProject: Project) => {
    setProjects([newProject, ...projects]);
  };

  const handleProjectUpdated = (updatedProject: Project) => {
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  const handleDeleteProject = (projectId: string) => {
    if (confirm('Bu projeyi silmek istediğinizden emin misiniz?')) {
      setProjects(projects.filter(p => p.id !== projectId));
    }
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setEditModalOpen(true);
  };

  const handleViewProject = (project: Project) => {
    setSelectedProject(project);
    setDetailModalOpen(true);
  };

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeProjects = projects.filter((p) => p.status === 'active').length;
  const completedProjects = projects.filter((p) => p.status === 'completed').length;
  const atRiskProjects = projects.filter((p) => p.status === 'at-risk').length;

  const getStatusBadge = (status: Project['status']) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
            <Clock className="mr-1 h-3 w-3" />
            Devam Ediyor
          </Badge>
        );
      case 'completed':
        return (
          <Badge className="bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Tamamlandı
          </Badge>
        );
      case 'on-hold':
        return (
          <Badge className="bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400">
            <AlertCircle className="mr-1 h-3 w-3" />
            Beklemede
          </Badge>
        );
      case 'at-risk':
        return (
          <Badge className="bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400">
            <AlertCircle className="mr-1 h-3 w-3" />
            Risk Altında
          </Badge>
        );
    }
  };

  const getPriorityBadge = (priority: Project['priority']) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">Yüksek</Badge>;
      case 'medium':
        return <Badge variant="secondary">Orta</Badge>;
      case 'low':
        return <Badge variant="outline">Düşük</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Projeler</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">
            Tüm projelerinizi tek yerden takip edin
          </p>
        </div>
        <Button onClick={() => setAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Proje
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Toplam Proje</p>
                <p className="mt-1 text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                  {projects.length}
                </p>
              </div>
              <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 p-3">
                <FolderKanban className="h-6 w-6 text-neutral-600 dark:text-neutral-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Aktif</p>
                <p className="mt-1 text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {activeProjects}
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
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Tamamlanan</p>
                <p className="mt-1 text-3xl font-bold text-success-600 dark:text-success-400">
                  {completedProjects}
                </p>
              </div>
              <div className="rounded-lg bg-success-100 dark:bg-success-900/30 p-3">
                <CheckCircle2 className="h-6 w-6 text-success-600 dark:text-success-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Risk Altında</p>
                <p className="mt-1 text-3xl font-bold text-danger-600 dark:text-danger-400">
                  {atRiskProjects}
                </p>
              </div>
              <div className="rounded-lg bg-danger-100 dark:bg-danger-900/30 p-3">
                <AlertCircle className="h-6 w-6 text-danger-600 dark:text-danger-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500 dark:text-neutral-400" />
          <Input
            type="text"
            placeholder="Proje ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredProjects.map((project) => (
          <Card
            key={project.id}
            className="border-neutral-200 dark:border-neutral-700 transition-all hover:shadow-md dark:hover:border-neutral-600"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg text-neutral-900 dark:text-neutral-100">
                      {project.name}
                    </CardTitle>
                  </div>
                  <CardDescription className="mt-1 text-neutral-600 dark:text-neutral-400">
                    {project.description}
                  </CardDescription>
                  <div className="mt-2 flex items-center gap-2">
                    {getStatusBadge(project.status)}
                    {getPriorityBadge(project.priority)}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleEditProject(project)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Düzenle
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteProject(project.id)}
                      className="text-danger-600 dark:text-danger-400"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Sil
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600 dark:text-neutral-400">İlerleme</span>
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                    {project.progress}%
                  </span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success-600 dark:text-success-400" />
                  <div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">Görevler</p>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      {project.tasksCompleted}/{project.tasksTotal}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                  <div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">Bitiş</p>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      {new Date(project.endDate).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Brand */}
              <div className="rounded-md bg-neutral-50 dark:bg-neutral-800/50 px-3 py-2">
                <p className="text-xs text-neutral-600 dark:text-neutral-400">Marka</p>
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {project.brand}
                </p>
              </div>

              {/* Team */}
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Ekip ({project.teamMembers.length})
                  </p>
                </div>
                <div className="flex -space-x-2">
                  {project.teamMembers.map((member, idx) => (
                    <Avatar key={idx} className="h-8 w-8 border-2 border-white dark:border-neutral-800">
                      <AvatarFallback
                        style={{
                          backgroundColor: member.color + '20',
                          color: member.color,
                        }}
                        className="text-xs font-semibold"
                      >
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </div>

              <Button variant="outline" className="w-full" onClick={() => handleViewProject(project)}>
                Projeyi Görüntüle
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="flex min-h-[200px] flex-col items-center justify-center">
            <Search className="h-12 w-12 text-neutral-300 dark:text-neutral-600" />
            <h3 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Proje bulunamadı
            </h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              &quot;{searchQuery}&quot; için sonuç bulunamadı
            </p>
          </CardContent>
        </Card>
      )}

      {/* Add Project Modal */}
      <AddProjectModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onProjectAdded={handleProjectAdded}
      />

      {/* Detail Project Modal */}
      {selectedProject && (
        <ProjectDetailModal
          open={detailModalOpen}
          onOpenChange={setDetailModalOpen}
          project={selectedProject}
          onEdit={handleEditProject}
          onDelete={handleDeleteProject}
        />
      )}

      {/* Edit Project Modal */}
      {selectedProject && (
        <EditProjectModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          project={selectedProject}
          onProjectUpdated={handleProjectUpdated}
        />
      )}
    </div>
  );
}
