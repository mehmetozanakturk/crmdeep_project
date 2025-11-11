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
import { TagSelector } from '@/components/ui/tag-selector';

const companySchema = z.object({
  name: z.string().min(2, 'Firma adı en az 2 karakter olmalı'),
  industry: z.string().min(2, 'Sektör gerekli'),
  size: z.string().min(1, 'Firma büyüklüğü gerekli'),
  revenue: z.string().optional(),
  location: z.string().min(2, 'Lokasyon gerekli'),
  website: z.string().optional(),
  email: z.string().email('Geçersiz email adresi').optional().or(z.literal('')),
  phone: z.string().optional(),
  status: z.string(),
});

type CompanyFormData = z.infer<typeof companySchema>;

interface Project {
  id: string;
  title: string;
  description: string;
  status: 'planned' | 'in_progress' | 'completed' | 'on_hold';
  start_date: string;
  end_date?: string;
  budget?: string;
  progress: number;
}

interface Company {
  id: string;
  name: string;
  logo?: string;
  industry: string;
  size: string;
  revenue: string;
  location: string;
  website: string;
  email: string;
  phone: string;
  contacts: number;
  deals: number;
  status: 'active' | 'prospect' | 'inactive';
  tags: string[];
  created_at: string;
  updated_at: string;
  projects: Project[];
  agreement_date?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  relatedTasks: string[];
  relatedNotes: string[];
  relatedEvents: string[];
  last_activity_date?: string;
  total_revenue?: string;
  description?: string;
}

interface EditCompanyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company: Company;
  onCompanyUpdated: (company: Company) => void;
}

export function EditCompanyModal({ open, onOpenChange, company, onCompanyUpdated }: EditCompanyModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>(company.tags || []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: company.name,
      industry: company.industry,
      size: company.size,
      revenue: company.revenue,
      location: company.location,
      website: company.website,
      email: company.email,
      phone: company.phone,
      status: company.status,
    },
  });

  const statusValue = watch('status');

  useEffect(() => {
    if (open) {
      reset({
        name: company.name,
        industry: company.industry,
        size: company.size,
        revenue: company.revenue,
        location: company.location,
        website: company.website,
        email: company.email,
        phone: company.phone,
        status: company.status,
      });
      setSelectedTags(company.tags || []);
    }
  }, [open, company, reset]);

  const onSubmit = async (data: CompanyFormData) => {
    setIsSubmitting(true);

    try {
      const updatedCompany: Company = {
        ...company,
        name: data.name,
        industry: data.industry,
        size: data.size,
        revenue: data.revenue || '',
        location: data.location,
        website: data.website || '',
        email: data.email || '',
        phone: data.phone || '',
        status: data.status as Company['status'],
        tags: selectedTags,
        updated_at: new Date().toISOString(),
      };

      onCompanyUpdated(updatedCompany);
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating company:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Firmayı Düzenle</DialogTitle>
          <DialogDescription>
            Firma bilgilerini güncelleyin
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Name */}
            <div className="md:col-span-2">
              <Label htmlFor="name">Firma Adı *</Label>
              <Input
                id="name"
                placeholder="TechCorp Solutions"
                {...register('name')}
                className="mt-1"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-danger-600">{errors.name.message}</p>
              )}
            </div>

            {/* Industry */}
            <div>
              <Label htmlFor="industry">Sektör *</Label>
              <Input
                id="industry"
                placeholder="Teknoloji"
                {...register('industry')}
                className="mt-1"
              />
              {errors.industry && (
                <p className="mt-1 text-xs text-danger-600">{errors.industry.message}</p>
              )}
            </div>

            {/* Size */}
            <div>
              <Label htmlFor="size">Çalışan Sayısı *</Label>
              <Input
                id="size"
                placeholder="100-500"
                {...register('size')}
                className="mt-1"
              />
              {errors.size && (
                <p className="mt-1 text-xs text-danger-600">{errors.size.message}</p>
              )}
            </div>

            {/* Revenue */}
            <div>
              <Label htmlFor="revenue">Gelir</Label>
              <Input
                id="revenue"
                placeholder="₺5M - ₺10M"
                {...register('revenue')}
                className="mt-1"
              />
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location">Lokasyon *</Label>
              <Input
                id="location"
                placeholder="İstanbul, Türkiye"
                {...register('location')}
                className="mt-1"
              />
              {errors.location && (
                <p className="mt-1 text-xs text-danger-600">{errors.location.message}</p>
              )}
            </div>

            {/* Website */}
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                placeholder="techcorp.com"
                {...register('website')}
                className="mt-1"
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="hello@techcorp.com"
                {...register('email')}
                className="mt-1"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-danger-600">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                placeholder="+90 212 100 0000"
                {...register('phone')}
                className="mt-1"
              />
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
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="prospect">Potansiyel</SelectItem>
                  <SelectItem value="inactive">Pasif</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tags */}
            <div className="md:col-span-2">
              <Label>Etiketler</Label>
              <div className="mt-1">
                <TagSelector
                  selectedTags={selectedTags}
                  onChange={setSelectedTags}
                  category="company"
                  placeholder="Etiket seçin veya yeni oluşturun..."
                />
              </div>
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
