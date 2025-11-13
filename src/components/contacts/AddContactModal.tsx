'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { type Contact } from '@/app/dashboard/contacts/page';
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

const contactSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalı'),
  email: z.string().email('Geçersiz email adresi'),
  phone: z.string().min(10, 'Telefon en az 10 karakter olmalı'),
  company: z.string().min(2, 'Firma adı gerekli'),
  position: z.string().optional(),
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
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

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
      const newContact = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        company_name: data.company,
        position: data.position || null,
        status: 'active',
        tags: selectedTags,
        avatar_url: null,
      };

      await onContactAdded(newContact as any);
      reset();
      setSelectedTags([]);
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
            <Label>Etiketler</Label>
            <TagSelector
              selectedTags={selectedTags}
              onChange={setSelectedTags}
              category="contacts"
              placeholder="Etiket seç veya ekle..."
            />
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
