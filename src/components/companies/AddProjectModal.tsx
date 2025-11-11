'use client';

import { useState } from 'react';
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

export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'planned' | 'in_progress' | 'completed' | 'on_hold';
  start_date: string;
  end_date?: string;
  budget?: string;
  progress: number; // 0-100
}

const projectSchema = z.object({
  title: z.string().min(2, 'Başlık en az 2 karakter olmalı'),
  description: z.string().min(5, 'Açıklama en az 5 karakter olmalı'),
  status: z.enum(['planned', 'in_progress', 'completed', 'on_hold']),
  start_date: z.string().min(1, 'Başlangıç tarihi gerekli'),
  end_date: z.string().optional(),
  budget: z.string().optional(),
  progress: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface AddProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectAdded: (project: Project) => void;
  companyName: string;
}

export function AddProjectModal({
  open,
  onOpenChange,
  onProjectAdded,
  companyName,
}: AddProjectModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      status: 'planned',
      progress: '0',
    },
  });

  const statusValue = watch('status');

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);
    try {
      const newProject: Project = {
        id: `project-${Date.now()}`,
        title: data.title,
        description: data.description,
        status: data.status,
        start_date: data.start_date,
        end_date: data.end_date || undefined,
        budget: data.budget || undefined,
        progress: data.progress ? parseInt(data.progress) : 0,
      };

      onProjectAdded(newProject);
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Yeni Proje Ekle</DialogTitle>
          <DialogDescription>
            <span className="font-semibold">{companyName}</span> için yeni proje ekleyin
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4">
            {/* Title */}
            <div>
              <Label htmlFor="title">Proje Başlığı *</Label>
              <Input
                id="title"
                placeholder="CRM Sistemi Geliştirme"
                {...register('title')}
                className="mt-1"
              />
              {errors.title && (
                <p className="mt-1 text-xs text-danger-600">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Açıklama *</Label>
              <Textarea
                id="description"
                placeholder="Proje detaylarını buraya yazın..."
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
                onValueChange={(value: any) => setValue('status', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Durum seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">Planlandı</SelectItem>
                  <SelectItem value="in_progress">Devam Ediyor</SelectItem>
                  <SelectItem value="completed">Tamamlandı</SelectItem>
                  <SelectItem value="on_hold">Beklemede</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="mt-1 text-xs text-danger-600">{errors.status.message}</p>
              )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date">Başlangıç Tarihi *</Label>
                <Input
                  id="start_date"
                  type="date"
                  {...register('start_date')}
                  className="mt-1"
                />
                {errors.start_date && (
                  <p className="mt-1 text-xs text-danger-600">{errors.start_date.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="end_date">Bitiş Tarihi</Label>
                <Input
                  id="end_date"
                  type="date"
                  {...register('end_date')}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Budget and Progress */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="budget">Bütçe</Label>
                <Input
                  id="budget"
                  placeholder="₺500,000"
                  {...register('budget')}
                  className="mt-1"
                />
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                  Örn: ₺500,000
                </p>
              </div>
              <div>
                <Label htmlFor="progress">İlerleme (%)</Label>
                <Input
                  id="progress"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0"
                  {...register('progress')}
                  className="mt-1"
                />
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                  0-100 arası
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
              disabled={isSubmitting}
            >
              İptal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Proje Ekle
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
