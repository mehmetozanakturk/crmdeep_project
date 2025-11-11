'use client';

import { type Project } from '@/app/dashboard/projects/page';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Calendar,
  Clock,
  Users,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Target,
  TrendingUp,
} from 'lucide-react';

interface ProjectDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
}

export function ProjectDetailModal({
  open,
  onOpenChange,
  project,
  onEdit,
  onDelete,
}: ProjectDetailModalProps) {
  const getStatusBadge = (status: Project['status']) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100">
            <Clock className="mr-1 h-3 w-3" />
            Devam Ediyor
          </Badge>
        );
      case 'completed':
        return (
          <Badge className="bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-100">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Tamamlandı
          </Badge>
        );
      case 'on-hold':
        return (
          <Badge className="bg-warning-100 text-warning-700 dark:bg-warning-900 dark:text-warning-100">
            <AlertCircle className="mr-1 h-3 w-3" />
            Beklemede
          </Badge>
        );
      case 'at-risk':
        return (
          <Badge className="bg-danger-100 text-danger-700 dark:bg-danger-900 dark:text-danger-100">
            <AlertCircle className="mr-1 h-3 w-3" />
            Risk Altında
          </Badge>
        );
    }
  };

  const getPriorityBadge = (priority: Project['priority']) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">Yüksek Öncelik</Badge>;
      case 'medium':
        return <Badge variant="warning">Orta Öncelik</Badge>;
      case 'low':
        return <Badge variant="secondary">Düşük Öncelik</Badge>;
    }
  };

  const handleDelete = () => {
    if (confirm('Bu projeyi silmek istediğinizden emin misiniz?')) {
      onDelete(project.id);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 pr-8">
              {project.name}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Priority */}
          <div className="flex items-center gap-3 flex-wrap">
            {getStatusBadge(project.status)}
            {getPriorityBadge(project.priority)}
          </div>

          {/* Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                İlerleme Durumu
              </h3>
              <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                %{project.progress}
              </span>
            </div>
            <Progress value={project.progress} className="h-3" />
            <div className="mt-2 flex items-center justify-between text-sm text-neutral-600 dark:text-neutral-400">
              <span>{project.tasksCompleted} / {project.tasksTotal} görev tamamlandı</span>
              <span>{project.tasksTotal - project.tasksCompleted} görev kaldı</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              Açıklama
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Brand */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              Marka
            </h3>
            <div className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
              <Briefcase className="h-4 w-4 text-primary-600" />
              <span className="font-medium">{project.brand}</span>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                Başlangıç Tarihi
              </h3>
              <div className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
                <Calendar className="h-4 w-4 text-primary-600" />
                <span className="text-sm">
                  {new Date(project.startDate).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                Bitiş Tarihi
              </h3>
              <div className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
                <Calendar className="h-4 w-4 text-danger-600" />
                <span className="text-sm">
                  {new Date(project.endDate).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">
              Takım Üyeleri ({project.teamMembers.length})
            </h3>
            <div className="flex flex-wrap gap-3">
              {project.teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback
                      className="text-xs font-semibold"
                      style={{
                        backgroundColor: member.color + '20',
                        color: member.color,
                      }}
                    >
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {member.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-lg bg-primary-50 dark:bg-neutral-800 border border-primary-200 dark:border-primary-600">
              <div className="flex items-center gap-2 text-primary-700 dark:text-primary-400 mb-1">
                <Target className="h-4 w-4" />
                <span className="text-xs font-medium">Tamamlanma</span>
              </div>
              <p className="text-2xl font-bold text-primary-800 dark:text-primary-300">
                %{Math.round((project.tasksCompleted / project.tasksTotal) * 100)}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-success-50 dark:bg-neutral-800 border border-success-200 dark:border-success-600">
              <div className="flex items-center gap-2 text-success-700 dark:text-success-400 mb-1">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-xs font-medium">Tamamlanan</span>
              </div>
              <p className="text-2xl font-bold text-success-800 dark:text-success-300">
                {project.tasksCompleted}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-600">
              <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-400 mb-1">
                <Users className="h-4 w-4" />
                <span className="text-xs font-medium">Ekip</span>
              </div>
              <p className="text-2xl font-bold text-neutral-800 dark:text-neutral-300">
                {project.teamMembers.length}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <Button
              onClick={() => {
                onEdit(project);
                onOpenChange(false);
              }}
              className="flex-1"
              variant="outline"
            >
              <Edit className="mr-2 h-4 w-4" />
              Düzenle
            </Button>
            <Button onClick={handleDelete} variant="destructive" className="flex-1">
              <Trash2 className="mr-2 h-4 w-4" />
              Sil
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
