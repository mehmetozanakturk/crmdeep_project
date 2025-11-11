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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import type { Deal } from '@/app/dashboard/deals/page';

const dealSchema = z.object({
  title: z.string().min(2, 'Başlık en az 2 karakter olmalı'),
  company: z.string().min(2, 'Firma adı gerekli'),
  value: z.string().min(1, 'Değer gerekli'),
  stage: z.string(),
  probability: z.string().min(1, 'Olasılık gerekli'),
  assignee: z.string().min(2, 'Sorumlu gerekli'),
  contactPerson: z.string().min(2, 'İletişim kişisi gerekli'),
  tags: z.string().optional(),
});

type DealFormData = z.infer<typeof dealSchema>;

interface EditDealModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deal: Deal;
  onDealUpdated: (deal: Deal) => void;
}

export function EditDealModal({ open, onOpenChange, deal, onDealUpdated }: EditDealModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<DealFormData>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      title: deal.title,
      company: deal.company,
      value: deal.value.toString(),
      stage: deal.stage,
      probability: deal.probability.toString(),
      assignee: deal.assignee,
      contactPerson: deal.contactPerson,
      tags: deal.tags?.join(', ') || '',
    },
  });

  const stageValue = watch('stage');

  useEffect(() => {
    if (open) {
      reset({
        title: deal.title,
        company: deal.company,
        value: deal.value.toString(),
        stage: deal.stage,
        probability: deal.probability.toString(),
        assignee: deal.assignee,
        contactPerson: deal.contactPerson,
        tags: deal.tags?.join(', ') || '',
      });
    }
  }, [open, deal, reset]);

  const onSubmit = async (data: DealFormData) => {
    setIsSubmitting(true);

    try {
      const updatedDeal: Deal = {
        ...deal,
        title: data.title,
        company: data.company,
        value: parseInt(data.value),
        stage: data.stage as Deal['stage'],
        probability: parseInt(data.probability),
        assignee: data.assignee,
        contactPerson: data.contactPerson,
        tags: data.tags ? data.tags.split(',').map(t => t.trim()) : [],
        updated_at: new Date().toISOString(),
      };

      onDealUpdated(updatedDeal);
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating deal:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Fırsatı Düzenle</DialogTitle>
          <DialogDescription>
            Fırsat bilgilerini güncelleyin
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Title */}
            <div className="md:col-span-2">
              <Label htmlFor="title">Başlık *</Label>
              <Input
                id="title"
                placeholder="Kurumsal CRM Uygulaması"
                {...register('title')}
                className="mt-1"
              />
              {errors.title && (
                <p className="mt-1 text-xs text-danger-600">{errors.title.message}</p>
              )}
            </div>

            {/* Company */}
            <div>
              <Label htmlFor="company">Firma *</Label>
              <Input
                id="company"
                placeholder="TechCorp Solutions"
                {...register('company')}
                className="mt-1"
              />
              {errors.company && (
                <p className="mt-1 text-xs text-danger-600">{errors.company.message}</p>
              )}
            </div>

            {/* Contact Person */}
            <div>
              <Label htmlFor="contactPerson">İletişim Kişisi *</Label>
              <Input
                id="contactPerson"
                placeholder="Ahmet Yılmaz"
                {...register('contactPerson')}
                className="mt-1"
              />
              {errors.contactPerson && (
                <p className="mt-1 text-xs text-danger-600">{errors.contactPerson.message}</p>
              )}
            </div>

            {/* Value */}
            <div>
              <Label htmlFor="value">Değer (TRY) *</Label>
              <Input
                id="value"
                type="number"
                placeholder="850000"
                {...register('value')}
                className="mt-1"
              />
              {errors.value && (
                <p className="mt-1 text-xs text-danger-600">{errors.value.message}</p>
              )}
            </div>

            {/* Probability */}
            <div>
              <Label htmlFor="probability">Olasılık (%) *</Label>
              <Input
                id="probability"
                type="number"
                min="0"
                max="100"
                placeholder="70"
                {...register('probability')}
                className="mt-1"
              />
              {errors.probability && (
                <p className="mt-1 text-xs text-danger-600">{errors.probability.message}</p>
              )}
            </div>

            {/* Stage */}
            <div>
              <Label htmlFor="stage">Aşama *</Label>
              <Select
                value={stageValue}
                onValueChange={(value) => setValue('stage', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Aşama seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lead">Lead</SelectItem>
                  <SelectItem value="qualified">Nitelikli</SelectItem>
                  <SelectItem value="proposal">Teklif</SelectItem>
                  <SelectItem value="negotiation">Görüşme</SelectItem>
                  <SelectItem value="closed_won">Kazanıldı</SelectItem>
                  <SelectItem value="closed_lost">Kaybedildi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Assignee */}
            <div>
              <Label htmlFor="assignee">Sorumlu *</Label>
              <Input
                id="assignee"
                placeholder="Ayşe Y."
                {...register('assignee')}
                className="mt-1"
              />
              {errors.assignee && (
                <p className="mt-1 text-xs text-danger-600">{errors.assignee.message}</p>
              )}
            </div>

            {/* Tags */}
            <div className="md:col-span-2">
              <Label htmlFor="tags">Etiketler (virgülle ayırın)</Label>
              <Input
                id="tags"
                placeholder="Kurumsal, Yüksek Öncelik"
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
