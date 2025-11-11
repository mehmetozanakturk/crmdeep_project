'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import type { Task } from '@/app/dashboard/tasks/page';

const taskSchema = z.object({
  title: z.string().min(2, 'Başlık en az 2 karakter olmalı'),
  description: z.string().min(5, 'Açıklama en az 5 karakter olmalı'),
  status: z.string(),
  priority: z.string(),
  assignee: z.string().min(2, 'Sorumlu gerekli'),
  dueDate: z.string().min(1, 'Bitiş tarihi gerekli'),
  project: z.string().min(2, 'Proje adı gerekli'),
  tags: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface EditTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task;
  onTaskUpdated: (task: Task) => void;
}

export function EditTaskModal({ open, onOpenChange, task, onTaskUpdated }: EditTaskModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      assignee: task.assignee.name,
      dueDate: task.dueDate,
      project: task.project,
      tags: task.tags?.join(', ') || '',
    },
  });

  const statusValue = watch('status');
  const priorityValue = watch('priority');

  useEffect(() => {
    if (open) {
      reset({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assignee: task.assignee.name,
        dueDate: task.dueDate,
        project: task.project,
        tags: task.tags?.join(', ') || '',
      });
    }
  }, [open, task, reset]);

  const onSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true);
    try {
      const updatedTask: Task = {
        ...task,
        title: data.title,
        description: data.description,
        status: data.status as Task['status'],
        priority: data.priority as Task['priority'],
        assignee: {
          ...task.assignee,
          name: data.assignee,
          initials: data.assignee.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2),
        },
        dueDate: data.dueDate,
        project: data.project,
        tags: data.tags ? data.tags.split(',').map(t => t.trim()) : [],
        updated_at: new Date().toISOString(),
      };
      onTaskUpdated(updatedTask);
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Görevi Düzenle</DialogTitle>
          <DialogDescription>
            Görev bilgilerini güncelleyin
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Title */}
            <div className="md:col-span-2">
              <Label htmlFor="title">Başlık *</Label>
              <Input
                id="title"
                placeholder="Landing page tasarımı"
                {...register('title')}
                className="mt-1"
              />
              {errors.title && (
                <p className="mt-1 text-xs text-danger-600">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <Label htmlFor="description">Açıklama *</Label>
              <Textarea
                id="description"
                placeholder="Görev detaylarını buraya yazın..."
                {...register('description')}
                className="mt-1"
                rows={3}
              />
              {errors.description && (
                <p className="mt-1 text-xs text-danger-600">{errors.description.message}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <Label htmlFor="status">Durum *</Label>
              <Select
                value={statusValue}
                onValueChange={(value) => setValue('status', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Durum seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">Yapılacak</SelectItem>
                  <SelectItem value="in-progress">Devam Ediyor</SelectItem>
                  <SelectItem value="review">İncelemede</SelectItem>
                  <SelectItem value="done">Tamamlandı</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Priority */}
            <div>
              <Label htmlFor="priority">Öncelik *</Label>
              <Select
                value={priorityValue}
                onValueChange={(value) => setValue('priority', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Öncelik seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Düşük</SelectItem>
                  <SelectItem value="medium">Orta</SelectItem>
                  <SelectItem value="high">Yüksek</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Assignee */}
            <div>
              <Label htmlFor="assignee">Sorumlu *</Label>
              <Input
                id="assignee"
                placeholder="Ahmet Y."
                {...register('assignee')}
                className="mt-1"
              />
              {errors.assignee && (
                <p className="mt-1 text-xs text-danger-600">{errors.assignee.message}</p>
              )}
            </div>

            {/* Due Date */}
            <div>
              <Label htmlFor="dueDate">Bitiş Tarihi *</Label>
              <Input
                id="dueDate"
                type="date"
                {...register('dueDate')}
                className="mt-1"
              />
              {errors.dueDate && (
                <p className="mt-1 text-xs text-danger-600">{errors.dueDate.message}</p>
              )}
            </div>

            {/* Project */}
            <div className="md:col-span-2">
              <Label htmlFor="project">Proje *</Label>
              <Input
                id="project"
                placeholder="Web Sitesi Yenileme"
                {...register('project')}
                className="mt-1"
              />
              {errors.project && (
                <p className="mt-1 text-xs text-danger-600">{errors.project.message}</p>
              )}
            </div>

            {/* Tags */}
            <div className="md:col-span-2">
              <Label htmlFor="tags">Etiketler (virgülle ayırın)</Label>
              <Input
                id="tags"
                placeholder="Design, Frontend, Urgent"
                {...register('tags')}
                className="mt-1"
              />
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                Etiketleri virgülle ayırın
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              İptal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Güncelle
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
