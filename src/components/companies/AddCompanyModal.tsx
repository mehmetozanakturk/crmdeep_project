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
import { Loader2 } from 'lucide-react';
import { TagSelector } from '@/components/ui/tag-selector';
import { getActiveWorkspaceId } from '@/lib/workspace-storage';
import * as CompaniesAPI from '@/lib/api/companies';

const companySchema = z.object({
  name: z.string().min(2, 'Firma adı en az 2 karakter olmalı'),
  industry: z.string().min(2, 'Sektör gerekli'),
  size: z.string().min(1, 'Firma büyüklüğü gerekli'),
  revenue: z.string().optional(),
  location: z.string().min(2, 'Lokasyon gerekli'),
  website: z.string().optional(),
  email: z.string().email('Geçersiz email adresi').optional().or(z.literal('')),
  phone: z.string().optional(),
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

interface AddCompanyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCompanyAdded: (company: Company) => void;
}

export function AddCompanyModal({ open, onOpenChange, onCompanyAdded }: AddCompanyModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
  });

  const onSubmit = async (data: CompanyFormData) => {
    setIsSubmitting(true);

    try {
      const workspaceId = getActiveWorkspaceId();
      if (!workspaceId) {
        alert('Lütfen bir workspace seçin');
        return;
      }

      const companyData: CompaniesAPI.CreateCompanyInput = {
        name: data.name,
        industry: data.industry,
        size: data.size,
        revenue: data.revenue || '',
        location: data.location,
        website: data.website || '',
        email: data.email || '',
        phone: data.phone || '',
        contacts: 0,
        deals: 0,
        status: 'active',
        priority: 'medium',
        tags: selectedTags,
      };

      const newCompany = await CompaniesAPI.createCompany(workspaceId, companyData);

      if (newCompany) {
        // Add temporary frontend fields for compatibility
        const enrichedCompany: Company = {
          ...newCompany,
          projects: [],
          agreement_date: undefined,
          relatedTasks: [],
          relatedNotes: [],
          relatedEvents: [],
          last_activity_date: newCompany.updated_at,
          total_revenue: undefined,
        };
        onCompanyAdded(enrichedCompany);
        reset();
        setSelectedTags([]);
        onOpenChange(false);
      } else {
        alert('Firma eklenirken bir hata oluştu');
      }
    } catch (error) {
      console.error('Error adding company:', error);
      alert('Firma eklenirken bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Yeni Firma Ekle</DialogTitle>
          <DialogDescription>
            Yeni firma bilgilerini girin
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
              Firma Ekle
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
