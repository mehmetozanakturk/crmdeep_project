'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { type Contact } from '@/lib/api/contacts';
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

const contactSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalı'),
  email: z.string().email('Geçersiz email adresi'),
  phone: z.string().min(10, 'Telefon en az 10 karakter olmalı'),
  company: z.string().min(2, 'Firma adı gerekli'),
  position: z.string().optional(),
  status: z.string(),
  tags: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface EditContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: Contact;
  onContactUpdated: (contact: Contact) => void;
}

export function EditContactModal({ open, onOpenChange, contact, onContactUpdated }: EditContactModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: contact.name,
      email: contact.email || '',
      phone: contact.phone || '',
      company: contact.company_name || '',
      position: contact.position || '',
      status: contact.status || 'active',
      tags: contact.tags?.join(', ') || '',
    },
  });

  const statusValue = watch('status');

  useEffect(() => {
    if (open) {
      reset({
        name: contact.name,
        email: contact.email || '',
        phone: contact.phone || '',
        company: contact.company_name || '',
        position: contact.position || '',
        status: contact.status || 'active',
        tags: contact.tags?.join(', ') || '',
      });
    }
  }, [open, contact, reset]);

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      const updatedContact: Contact = {
        ...contact,
        name: data.name,
        email: data.email,
        phone: data.phone,
        company_name: data.company,
        position: data.position || null,
        status: data.status as Contact['status'],
        tags: data.tags ? data.tags.split(',').map(t => t.trim()) : [],
        updated_at: new Date().toISOString(),
      };

      onContactUpdated(updatedContact);
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating contact:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Kişiyi Düzenle</DialogTitle>
          <DialogDescription>
            Kişi bilgilerini güncelleyin
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
                <SelectItem value="client">Müşteri</SelectItem>
                <SelectItem value="lead">Lead</SelectItem>
                <SelectItem value="prospect">Potansiyel</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="mt-1 text-xs text-danger-600">{errors.status.message}</p>
            )}
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
              Güncelle
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
