'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  BarChart3,
  DollarSign,
} from 'lucide-react';
import { AddProjectModal } from '@/components/projects/AddProjectModal';
import { EditProjectModal } from '@/components/projects/EditProjectModal';
import {
  loadProjects,
  deleteProject,
  getProjectTasks,
  type Project,
} from '@/lib/api/projects';
import { getCurrentOrganization } from '@/lib/api/organization';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [taskCounts, setTaskCounts] = useState<Record<string, { total: number; completed: number }>>({});

  // Load projects on mount
  useEffect(() => {
    loadProjectsData();
  }, []);

  const loadProjectsData = async () => {
    setLoading(true);
    try {
      const currentOrganization = await getCurrentOrganization();
      if (!currentOrganization) {
        console.error('No organization found');
        return;
      }

      const data = await loadProjects(currentOrganization.id);
      setProjects(data);

      // Load task counts for each project
      const counts: Record<string, { total: number; completed: number }> = {};
      for (const project of data) {
        if (project.name) {
          const tasks = await getProjectTasks(currentOrganization.id, project.name);
          counts[project.id] = {
            total: tasks.length,
            completed: tasks.filter((t) => t.status === 'done' || t.status === 'completed').length,
          };
        }
      }
      setTaskCounts(counts);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectAdded = async () => {
    await loadProjectsData();
  };

  const handleProjectUpdated = async () => {
    await loadProjectsData();
  };

  const handleDeleteProject = async (projectId: string) => {
    if (confirm('Bu projeyi silmek istediğinizden emin misiniz?')) {
      const success = await deleteProject(projectId);
      if (success) {
        await loadProjectsData();
      }
    }
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setEditModalOpen(true);
  };

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.client?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeProjects = projects.filter((p) => p.status === 'active').length;
  const completedProjects = projects.filter((p) => p.status === 'completed').length;
  const atRiskProjects = projects.filter((p) => p.status === 'at-risk').length;
  const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);

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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getColorForMember = (index: number) => {
    const colors = ['#3B82F6', '#10B981', '#EC4899', '#0EA5E9', '#14B8A6', '#8B5CF6', '#EF4444', '#F59E0B'];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">Projeler yükleniyor...</p>
        </div>
      </div>
    );
  }

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
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Toplam Bütçe</p>
                <p className="mt-1 text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                  ${totalBudget.toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 p-3">
                <DollarSign className="h-6 w-6 text-neutral-600 dark:text-neutral-400" />
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
        {filteredProjects.map((project) => {
          const taskCount = taskCounts[project.id] || { total: 0, completed: 0 };

          return (
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
                      {project.description || 'Açıklama yok'}
                    </CardDescription>
                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                      {getStatusBadge(project.status)}
                      {project.tags && project.tags.length > 0 && (
                        project.tags.slice(0, 2).map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))
                      )}
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
                        {taskCount.completed}/{taskCount.total}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                    <div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">Bitiş</p>
                      <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                        {project.end_date
                          ? new Date(project.end_date).toLocaleDateString('tr-TR', {
                              day: 'numeric',
                              month: 'short',
                            })
                          : 'Belirtilmemiş'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Client & Budget */}
                {(project.client || project.budget) && (
                  <div className="grid grid-cols-2 gap-2">
                    {project.client && (
                      <div className="rounded-md bg-neutral-50 dark:bg-neutral-800/50 px-3 py-2">
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">Müşteri</p>
                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          {project.client}
                        </p>
                      </div>
                    )}
                    {project.budget && (
                      <div className="rounded-md bg-neutral-50 dark:bg-neutral-800/50 px-3 py-2">
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">Bütçe</p>
                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          ${project.budget.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Team */}
                {project.team_members && project.team_members.length > 0 && (
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Ekip ({project.team_members.length})
                      </p>
                    </div>
                    <div className="flex -space-x-2">
                      {project.team_members.slice(0, 5).map((member, idx) => {
                        const color = getColorForMember(idx);
                        return (
                          <Avatar key={idx} className="h-8 w-8 border-2 border-white dark:border-neutral-800">
                            <AvatarFallback
                              style={{
                                backgroundColor: color + '20',
                                color: color,
                              }}
                              className="text-xs font-semibold"
                              title={member}
                            >
                              {getInitials(member)}
                            </AvatarFallback>
                          </Avatar>
                        );
                      })}
                      {project.team_members.length > 5 && (
                        <Avatar className="h-8 w-8 border-2 border-white dark:border-neutral-800">
                          <AvatarFallback className="text-xs font-semibold bg-neutral-100 dark:bg-neutral-700">
                            +{project.team_members.length - 5}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="flex min-h-[200px] flex-col items-center justify-center">
            <Search className="h-12 w-12 text-neutral-300 dark:text-neutral-600" />
            <h3 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Proje bulunamadı
            </h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              {searchQuery ? `"${searchQuery}" için sonuç bulunamadı` : 'Henüz proje eklenmemiş'}
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
