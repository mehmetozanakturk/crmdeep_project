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
import { createProject, type CreateProjectInput } from '@/lib/api/projects';
import { getCurrentOrganizationId } from '@/lib/api/organization';

const projectSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalı'),
  description: z.string().optional(),
  status: z.string(),
  client: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  progress: z.string().optional(),
  budget: z.string().optional(),
  teamMembers: z.string().optional(),
  tags: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface AddProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectAdded: () => void;
}

export function AddProjectModal({ open, onOpenChange, onProjectAdded }: AddProjectModalProps) {
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
      progress: '0',
    },
  });

  const statusValue = watch('status');

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);
    try {
      const organizationId = await getCurrentOrganizationId();
      if (!organizationId) {
        console.error('No organization found');
        return;
      }

      // Parse team members and tags from comma-separated strings
      const team_members = data.teamMembers
        ? data.teamMembers.split(',').map((m) => m.trim()).filter(Boolean)
        : [];
      const tags = data.tags
        ? data.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [];

      const input: CreateProjectInput = {
        name: data.name,
        description: data.description || '',
        status: data.status as 'active' | 'completed' | 'on-hold' | 'at-risk',
        progress: data.progress ? parseInt(data.progress) : 0,
        start_date: data.startDate || undefined,
        end_date: data.endDate || undefined,
        budget: data.budget ? parseFloat(data.budget) : undefined,
        client: data.client || undefined,
        team_members,
        tags,
      };

      const result = await createProject(organizationId, input);
      if (result) {
        onProjectAdded();
        reset();
        onOpenChange(false);
      }
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
              <Label htmlFor="description">Açıklama</Label>
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

            {/* Client */}
            <div>
              <Label htmlFor="client">Müşteri</Label>
              <Input
                id="client"
                placeholder="TechCorp"
                {...register('client')}
                className="mt-1"
              />
              {errors.client && (
                <p className="mt-1 text-xs text-danger-600">{errors.client.message}</p>
              )}
            </div>

            {/* Budget */}
            <div>
              <Label htmlFor="budget">Bütçe ($)</Label>
              <Input
                id="budget"
                type="number"
                min="0"
                step="0.01"
                placeholder="50000"
                {...register('budget')}
                className="mt-1"
              />
              {errors.budget && (
                <p className="mt-1 text-xs text-danger-600">{errors.budget.message}</p>
              )}
            </div>

            {/* Progress */}
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
              {errors.progress && (
                <p className="mt-1 text-xs text-danger-600">{errors.progress.message}</p>
              )}
            </div>

            {/* Status */}
            <div className="md:col-span-2">
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

            {/* Start Date */}
            <div>
              <Label htmlFor="startDate">Başlangıç Tarihi</Label>
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
              <Label htmlFor="endDate">Bitiş Tarihi</Label>
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

            {/* Team Members */}
            <div className="md:col-span-2">
              <Label htmlFor="teamMembers">Ekip Üyeleri (virgülle ayırın)</Label>
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

            {/* Tags */}
            <div className="md:col-span-2">
              <Label htmlFor="tags">Etiketler (virgülle ayırın)</Label>
              <Input
                id="tags"
                placeholder="web, frontend, tasarım"
                {...register('tags')}
                className="mt-1"
              />
              {errors.tags && (
                <p className="mt-1 text-xs text-danger-600">{errors.tags.message}</p>
              )}
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
              Proje Ekle
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
