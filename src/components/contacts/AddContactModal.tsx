'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createContact, type Contact } from '@/lib/api/contacts';
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

const contactSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalı'),
  email: z.string().email('Geçersiz email adresi'),
  phone: z.string().min(10, 'Telefon en az 10 karakter olmalı'),
  company: z.string().min(2, 'Firma adı gerekli'),
  position: z.string().optional(),
  tags: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface AddContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContactAdded: (contact: Contact) => void;
  organizationId: string;
}

export function AddContactModal({ open, onOpenChange, onContactAdded, organizationId }: AddContactModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      // Create new contact with localStorage (no Supabase for now)
      const newContact: Contact = {
        id: Date.now().toString(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        company_id: null,
        company_name: data.company,
        position: data.position || null,
        status: 'active',
        tags: data.tags ? data.tags.split(',').map(t => t.trim()) : [],
        avatar_url: null,
        linkedin_url: null,
        twitter_url: null,
        address: null,
        city: null,
        state: null,
        country: null,
        notes: null,
        last_contact_date: null,
        organization_id: organizationId,
        created_by: 'demo',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        relatedTasks: [],
        relatedNotes: [],
        relatedEvents: [],
        priority: 'medium',
        birthday: null,
        department: null,
        is_key_contact: false,
      };

      onContactAdded(newContact);
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding contact:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Yeni Kişi Ekle</DialogTitle>
          <DialogDescription>
            CRM&apos;inize yeni kişi ekleyin. Aşağıdaki bilgileri doldurun.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <Label htmlFor="name">Ad Soyad *</Label>
            <Input
              id="name"
              placeholder="Ahmet Yılmaz"
              {...register('name')}
              className="mt-1"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-danger-600">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="ahmet@example.com"
              {...register('email')}
              className="mt-1"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-danger-600">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone">Telefon *</Label>
            <Input
              id="phone"
              placeholder="+90 532 123 4567"
              {...register('phone')}
              className="mt-1"
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-danger-600">{errors.phone.message}</p>
            )}
          </div>

          {/* Company */}
          <div>
            <Label htmlFor="company">Firma *</Label>
            <Input
              id="company"
              placeholder="TechCorp"
              {...register('company')}
              className="mt-1"
            />
            {errors.company && (
              <p className="mt-1 text-xs text-danger-600">{errors.company.message}</p>
            )}
          </div>

          {/* Position */}
          <div>
            <Label htmlFor="position">Pozisyon</Label>
            <Input
              id="position"
              placeholder="CEO"
              {...register('position')}
              className="mt-1"
            />
          </div>

          {/* Tags */}
          <div>
            <Label htmlFor="tags">Etiketler (virgülle ayırın)</Label>
            <Input
              id="tags"
              placeholder="VIP, Lead, Karar Verici"
              {...register('tags')}
              className="mt-1"
            />
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Etiketleri virgülle ayırın
            </p>
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
              Kişi Ekle
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
