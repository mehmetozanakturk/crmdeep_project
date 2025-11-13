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
import { Loader2 } from 'lucide-react';
import { TagSelector } from '@/components/ui/tag-selector';
import { type Company } from '@/app/dashboard/companies/page';
import { useOrganization } from '@/lib/hooks/useOrganization';
import { useBrands } from '@/lib/hooks/useBrands';
import { createClient } from '@/lib/supabase/client';

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

interface AddCompanyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCompanyAdded: (company?: Company) => void; // Parameter is optional - parent should reload companies from DB
}

export function AddCompanyModal({ open, onOpenChange, onCompanyAdded }: AddCompanyModalProps) {
  const { currentOrganization } = useOrganization();
  const { currentBrand } = useBrands();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
  });

  // Reset error state when modal closes
  useEffect(() => {
    if (!open) {
      setError(null);
    }
  }, [open]);

  const onSubmit = async (data: CompanyFormData) => {
    // Check if organization is loaded
    if (!currentOrganization) {
      setError('Organizasyon bilgisi yüklenemedi. Lütfen sayfayı yenileyin.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();

      // Insert the new company into the database
      const { data: insertedCompany, error: insertError } = await supabase
        .from('companies')
        .insert({
          organization_id: currentOrganization.id,
          brand_id: currentBrand?.id || null,
          name: data.name,
          industry: data.industry,
          size: data.size,
          revenue: data.revenue || null,
          location: data.location,
          website: data.website || null,
          email: data.email || null,
          phone: data.phone || null,
          contacts: 0,
          deals: 0,
          status: 'active',
          tags: selectedTags,
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating company:', insertError);
        setError('Firma oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
        return;
      }

      // Success! Reset form and close modal
      reset();
      setSelectedTags([]);
      onOpenChange(false);

      // Notify parent to reload companies from database
      onCompanyAdded();
    } catch (error) {
      console.error('Error adding company:', error);
      setError('Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.');
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

        {error && (
          <div className="rounded-md bg-danger-50 dark:bg-danger-900/20 p-3 border border-danger-200 dark:border-danger-800">
            <p className="text-sm text-danger-600 dark:text-danger-400">{error}</p>
          </div>
        )}

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
              <TagSelector
                selectedTags={selectedTags}
                onChange={setSelectedTags}
                category="companies"
                placeholder="Etiket seç veya ekle..."
              />
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
