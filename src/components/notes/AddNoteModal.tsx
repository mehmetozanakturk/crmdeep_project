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
import type { Note } from '@/app/dashboard/notes/page';

const noteSchema = z.object({
  title: z.string().min(2, 'Başlık en az 2 karakter olmalı'),
  content: z.string().min(5, 'İçerik en az 5 karakter olmalı'),
  color: z.string(),
  tags: z.string().optional(),
});

type NoteFormData = z.infer<typeof noteSchema>;

interface AddNoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNoteAdded: (note: Note) => void;
}

export function AddNoteModal({ open, onOpenChange, onNoteAdded }: AddNoteModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      color: 'bg-yellow-100 dark:bg-yellow-900/30',
    },
  });

  const colorValue = watch('color');

  const onSubmit = async (data: NoteFormData) => {
    setIsSubmitting(true);
    try {
      const newNote: Note = {
        id: Date.now().toString(),
        title: data.title,
        content: data.content,
        color: data.color,
        pinned: false,
        createdAt: new Date().toLocaleDateString('tr-TR'),
        tags: data.tags ? data.tags.split(',').map(t => t.trim()) : [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      onNoteAdded(newNote);
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding note:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Yeni Not Ekle</DialogTitle>
          <DialogDescription>
            Yeni not bilgilerini girin
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            {/* Title */}
            <div>
              <Label htmlFor="title">Başlık *</Label>
              <Input
                id="title"
                placeholder="Not başlığı"
                {...register('title')}
                className="mt-1"
              />
              {errors.title && (
                <p className="mt-1 text-xs text-danger-600">{errors.title.message}</p>
              )}
            </div>

            {/* Content */}
            <div>
              <Label htmlFor="content">İçerik *</Label>
              <Textarea
                id="content"
                placeholder="Not içeriği..."
                {...register('content')}
                className="mt-1"
                rows={5}
              />
              {errors.content && (
                <p className="mt-1 text-xs text-danger-600">{errors.content.message}</p>
              )}
            </div>

            {/* Color */}
            <div>
              <Label htmlFor="color">Renk *</Label>
              <Select
                value={colorValue}
                onValueChange={(value) => setValue('color', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Renk seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bg-yellow-100 dark:bg-yellow-900/30">Sarı</SelectItem>
                  <SelectItem value="bg-blue-100 dark:bg-blue-900/30">Mavi</SelectItem>
                  <SelectItem value="bg-green-100 dark:bg-green-900/30">Yeşil</SelectItem>
                  <SelectItem value="bg-purple-100 dark:bg-purple-900/30">Mor</SelectItem>
                  <SelectItem value="bg-pink-100 dark:bg-pink-900/30">Pembe</SelectItem>
                  <SelectItem value="bg-orange-100 dark:bg-orange-900/30">Turuncu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tags */}
            <div>
              <Label htmlFor="tags">Etiketler (virgülle ayırın)</Label>
              <Input
                id="tags"
                placeholder="Toplantı, Önemli, Todo"
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
              Not Ekle
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
