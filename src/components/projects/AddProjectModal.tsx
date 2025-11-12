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
import type { Project } from '@/app/dashboard/projects/page';

const projectSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalı'),
  description: z.string().min(5, 'Açıklama en az 5 karakter olmalı'),
  status: z.string(),
  priority: z.string(),
  brand: z.string().min(2, 'Marka adı gerekli'),
  startDate: z.string().min(1, 'Başlangıç tarihi gerekli'),
  endDate: z.string().min(1, 'Bitiş tarihi gerekli'),
  tasksTotal: z.string().min(1, 'Toplam görev sayısı gerekli'),
  tasksCompleted: z.string().min(0),
  teamMembers: z.string().min(2, 'Ekip üyeleri gerekli'),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface AddProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectAdded: (project: Project) => void;
  defaultBrand?: string;
}

export function AddProjectModal({ open, onOpenChange, onProjectAdded, defaultBrand }: AddProjectModalProps) {
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
      status: 'active',
      priority: 'medium',
      tasksCompleted: '0',
      brand: defaultBrand || '',
    },
  });

  const statusValue = watch('status');
  const priorityValue = watch('priority');

  // Set brand value when modal opens with defaultBrand
  useEffect(() => {
    if (open && defaultBrand) {
      setValue('brand', defaultBrand);
    }
  }, [open, defaultBrand, setValue]);

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);
    try {
      const colors = ['#3B82F6', '#10B981', '#EC4899', '#0EA5E9', '#14B8A6', '#8B5CF6', '#EF4444', '#F59E0B'];

      // Parse team members (comma separated names)
      const memberNames = data.teamMembers.split(',').map(n => n.trim());
      const teamMembers = memberNames.map(name => ({
        name,
        initials: name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2),
        color: colors[Math.floor(Math.random() * colors.length)],
      }));

      const tasksTotal = parseInt(data.tasksTotal);
      const tasksCompleted = parseInt(data.tasksCompleted);
      const progress = tasksTotal > 0 ? Math.round((tasksCompleted / tasksTotal) * 100) : 0;

      const newProject: Project = {
        id: Date.now().toString(),
        name: data.name,
        description: data.description,
        status: data.status as Project['status'],
        priority: data.priority as Project['priority'],
        brand: data.brand,
        startDate: data.startDate,
        endDate: data.endDate,
        progress,
        tasksTotal,
        tasksCompleted,
        teamMembers,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Save to localStorage
      const stored = localStorage.getItem('crmdeep_projects');
      const projects = stored ? JSON.parse(stored) : [];
      projects.unshift(newProject);
      localStorage.setItem('crmdeep_projects', JSON.stringify(projects));

      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event('projectsUpdated'));

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
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Yeni Proje Ekle</DialogTitle>
          <DialogDescription>
            Yeni proje bilgilerini girin
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Name */}
            <div className="md:col-span-2">
              <Label htmlFor="name">Proje Adı *</Label>
              <Input
                id="name"
                placeholder="Web Sitesi Yenileme"
                {...register('name')}
                className="mt-1"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-danger-600">{errors.name.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
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

            {/* Brand */}
            <div>
              <Label htmlFor="brand">Marka *</Label>
              <Input
                id="brand"
                placeholder="TechCorp"
                {...register('brand')}
                className="mt-1"
              />
              {errors.brand && (
                <p className="mt-1 text-xs text-danger-600">{errors.brand.message}</p>
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
                  <SelectItem value="active">Devam Ediyor</SelectItem>
                  <SelectItem value="completed">Tamamlandı</SelectItem>
                  <SelectItem value="on-hold">Beklemede</SelectItem>
                  <SelectItem value="at-risk">Risk Altında</SelectItem>
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

            {/* Start Date */}
            <div>
              <Label htmlFor="startDate">Başlangıç Tarihi *</Label>
              <Input
                id="startDate"
                type="date"
                {...register('startDate')}
                className="mt-1"
              />
              {errors.startDate && (
                <p className="mt-1 text-xs text-danger-600">{errors.startDate.message}</p>
              )}
            </div>

            {/* End Date */}
            <div>
              <Label htmlFor="endDate">Bitiş Tarihi *</Label>
              <Input
                id="endDate"
                type="date"
                {...register('endDate')}
                className="mt-1"
              />
              {errors.endDate && (
                <p className="mt-1 text-xs text-danger-600">{errors.endDate.message}</p>
              )}
            </div>

            {/* Tasks Total */}
            <div>
              <Label htmlFor="tasksTotal">Toplam Görev Sayısı *</Label>
              <Input
                id="tasksTotal"
                type="number"
                min="0"
                placeholder="20"
                {...register('tasksTotal')}
                className="mt-1"
              />
              {errors.tasksTotal && (
                <p className="mt-1 text-xs text-danger-600">{errors.tasksTotal.message}</p>
              )}
            </div>

            {/* Tasks Completed */}
            <div>
              <Label htmlFor="tasksCompleted">Tamamlanan Görev *</Label>
              <Input
                id="tasksCompleted"
                type="number"
                min="0"
                placeholder="10"
                {...register('tasksCompleted')}
                className="mt-1"
              />
              {errors.tasksCompleted && (
                <p className="mt-1 text-xs text-danger-600">{errors.tasksCompleted.message}</p>
              )}
            </div>

            {/* Team Members */}
            <div className="md:col-span-2">
              <Label htmlFor="teamMembers">Ekip Üyeleri (virgülle ayırın) *</Label>
              <Input
                id="teamMembers"
                placeholder="Ahmet Y., Zeynep K., Mehmet S."
                {...register('teamMembers')}
                className="mt-1"
              />
              {errors.teamMembers && (
                <p className="mt-1 text-xs text-danger-600">{errors.teamMembers.message}</p>
              )}
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                Ekip üyelerini virgülle ayırın
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
              Proje Ekle
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
