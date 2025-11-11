'use client';

import { type Task } from '@/app/dashboard/tasks/page';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Clock,
  User,
  Paperclip,
  MessageSquare,
  Edit,
  Trash2,
  CalendarPlus,
  CheckCircle2,
  Circle,
  AlertCircle,
} from 'lucide-react';

interface TaskDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleCalendar: (taskId: string) => void;
}

export function TaskDetailModal({
  open,
  onOpenChange,
  task,
  onEdit,
  onDelete,
  onToggleCalendar,
}: TaskDetailModalProps) {
  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return <Circle className="h-5 w-5 text-neutral-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-primary-500" />;
      case 'review':
        return <AlertCircle className="h-5 w-5 text-warning-500" />;
      case 'done':
        return <CheckCircle2 className="h-5 w-5 text-success-500" />;
    }
  };

  const getStatusLabel = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return 'Yapılacak';
      case 'in-progress':
        return 'Devam Ediyor';
      case 'review':
        return 'İncelemede';
      case 'done':
        return 'Tamamlandı';
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

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-300';
      case 'medium':
        return 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300';
      case 'low':
        return 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300';
    }
  };

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 pr-8">
              {task.title}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Priority */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800">
              {getStatusIcon(task.status)}
              <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                {getStatusLabel(task.status)}
              </span>
            </div>
            <Badge className={getPriorityColor(task.priority)}>
              {getPriorityLabel(task.priority)}
            </Badge>
            {task.inCalendar && (
              <Badge variant="secondary" className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                📅 Takvimde
              </Badge>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              Açıklama
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
              {task.description}
            </p>
          </div>

          {/* Project */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              Proje
            </h3>
            <div className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
              <span className="text-2xl">📁</span>
              <span className="font-medium">{task.project}</span>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              Bitiş Tarihi
            </h3>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-neutral-500" />
              <span
                className={`font-medium ${
                  isOverdue
                    ? 'text-danger-600 dark:text-danger-400'
                    : 'text-neutral-900 dark:text-neutral-100'
                }`}
              >
                {new Date(task.dueDate).toLocaleDateString('tr-TR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
              {isOverdue && (
                <Badge variant="destructive" className="ml-2">
                  Gecikmiş
                </Badge>
              )}
            </div>
          </div>

          {/* Assignee */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              Atanan Kişi
            </h3>
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback
                  style={{
                    backgroundColor: task.assignee.color + '20',
                    color: task.assignee.color,
                  }}
                  className="text-sm font-semibold"
                >
                  {task.assignee.initials}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-neutral-900 dark:text-neutral-100">
                {task.assignee.name}
              </span>
            </div>
          </div>

          {/* Tags */}
          {task.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                Etiketler
              </h3>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="bg-neutral-100 dark:bg-neutral-800"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
            <div className="flex items-center gap-2">
              <Paperclip className="h-4 w-4 text-neutral-500" />
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                {task.attachments} Ek Dosya
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-neutral-500" />
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                {task.comments} Yorum
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <Button onClick={() => onEdit(task)} className="flex-1">
              <Edit className="mr-2 h-4 w-4" />
              Düzenle
            </Button>
            <Button
              variant="outline"
              onClick={() => onToggleCalendar(task.id)}
              className="flex-1"
            >
              <CalendarPlus className="mr-2 h-4 w-4" />
              {task.inCalendar ? 'Takvimden Kaldır' : 'Takvime Ekle'}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(task.id);
                onOpenChange(false);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
