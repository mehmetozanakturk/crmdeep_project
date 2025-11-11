'use client';

import { type Note } from '@/app/dashboard/notes/page';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  StickyNote,
  Edit,
  Trash2,
  Pin,
  Calendar,
  Clock,
  Briefcase,
  User,
  FolderKanban,
  Lightbulb,
  Users,
  MoreHorizontal,
  Tag,
} from 'lucide-react';

interface NoteDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
  onTogglePin: (noteId: string) => void;
}

const getCategoryInfo = (category: Note['category']) => {
  switch (category) {
    case 'work':
      return {
        icon: <Briefcase className="h-5 w-5" />,
        label: 'İş',
        color: 'text-blue-600 dark:text-blue-400',
        bg: 'bg-blue-100 dark:bg-blue-900/30',
      };
    case 'personal':
      return {
        icon: <User className="h-5 w-5" />,
        label: 'Kişisel',
        color: 'text-green-600 dark:text-green-400',
        bg: 'bg-green-100 dark:bg-green-900/30',
      };
    case 'project':
      return {
        icon: <FolderKanban className="h-5 w-5" />,
        label: 'Proje',
        color: 'text-purple-600 dark:text-purple-400',
        bg: 'bg-purple-100 dark:bg-purple-900/30',
      };
    case 'idea':
      return {
        icon: <Lightbulb className="h-5 w-5" />,
        label: 'Fikir',
        color: 'text-yellow-600 dark:text-yellow-400',
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
      };
    case 'meeting':
      return {
        icon: <Users className="h-5 w-5" />,
        label: 'Toplantı',
        color: 'text-orange-600 dark:text-orange-400',
        bg: 'bg-orange-100 dark:bg-orange-900/30',
      };
    case 'other':
      return {
        icon: <MoreHorizontal className="h-5 w-5" />,
        label: 'Diğer',
        color: 'text-neutral-600 dark:text-neutral-400',
        bg: 'bg-neutral-100 dark:bg-neutral-900/30',
      };
  }
};

export function NoteDetailModal({
  open,
  onOpenChange,
  note,
  onEdit,
  onDelete,
  onTogglePin,
}: NoteDetailModalProps) {
  const categoryConfig = getCategoryInfo(note.category);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className={`rounded-lg ${categoryConfig.bg} p-3`}>
              <div className={categoryConfig.color}>{categoryConfig.icon}</div>
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{note.title}</DialogTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {categoryConfig.icon}
                  <span className="ml-1">{categoryConfig.label}</span>
                </Badge>
                {note.pinned && (
                  <Badge variant="secondary" className="text-xs">
                    <Pin className="h-3 w-3 mr-1" />
                    Sabitlenmiş
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Content */}
          <div>
            <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              İçerik
            </h4>
            <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 p-4">
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed whitespace-pre-wrap">
                {note.content}
              </p>
            </div>
          </div>

          {/* Tags */}
          {note.tags && note.tags.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Etiketler
              </h4>
              <div className="flex flex-wrap gap-2">
                {note.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 rounded-lg border border-neutral-200 dark:border-neutral-700 p-3">
              <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 p-2">
                <Calendar className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Oluşturulma</p>
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mt-0.5">
                  {formatDate(note.created_at)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-neutral-200 dark:border-neutral-700 p-3">
              <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 p-2">
                <Clock className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Son Güncelleme</p>
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mt-0.5">
                  {formatDate(note.updated_at)}
                </p>
              </div>
            </div>
          </div>

          {/* Task Link Info (if exists) */}
          {note.taskId && (
            <div className="rounded-lg bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 p-3">
              <div className="flex items-center gap-2 text-sm">
                <StickyNote className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                <span className="font-medium text-primary-900 dark:text-primary-100">
                  Bu not bir göreve bağlı
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <Button
              onClick={() => {
                onTogglePin(note.id);
                onOpenChange(false);
              }}
              variant="outline"
              className="flex-1"
            >
              <Pin className={`mr-2 h-4 w-4 ${note.pinned ? 'fill-current' : ''}`} />
              {note.pinned ? 'Sabitlemeyi Kaldır' : 'Sabitle'}
            </Button>
            <Button
              onClick={() => {
                onEdit(note);
                onOpenChange(false);
              }}
              className="flex-1"
            >
              <Edit className="mr-2 h-4 w-4" />
              Düzenle
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(note.id);
                onOpenChange(false);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Sil
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
