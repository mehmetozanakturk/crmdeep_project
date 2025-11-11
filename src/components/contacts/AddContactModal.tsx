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
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 characters'),
  company: z.string().min(2, 'Company name is required'),
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
      const newContact = await createContact(organizationId, {
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        position: data.position,
        tags: data.tags ? data.tags.split(',').map(t => t.trim()) : [],
      });

      if (newContact) {
        onContactAdded(newContact);
        reset();
        onOpenChange(false);
      } else {
        console.error('Failed to create contact');
      }
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
          <DialogTitle>Add New Contact</DialogTitle>
          <DialogDescription>
            Add a new contact to your CRM. Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              placeholder="John Doe"
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
              placeholder="john.doe@example.com"
              {...register('email')}
              className="mt-1"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-danger-600">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              placeholder="+1 (555) 123-4567"
              {...register('phone')}
              className="mt-1"
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-danger-600">{errors.phone.message}</p>
            )}
          </div>

          {/* Company */}
          <div>
            <Label htmlFor="company">Company *</Label>
            <Input
              id="company"
              placeholder="Acme Inc."
              {...register('company')}
              className="mt-1"
            />
            {errors.company && (
              <p className="mt-1 text-xs text-danger-600">{errors.company.message}</p>
            )}
          </div>

          {/* Position */}
          <div>
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              placeholder="CEO"
              {...register('position')}
              className="mt-1"
            />
          </div>

          {/* Tags */}
          <div>
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              placeholder="VIP, Lead, Decision Maker"
              {...register('tags')}
              className="mt-1"
            />
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Separate tags with commas
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Contact
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
