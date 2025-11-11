'use client';

import { useState } from 'react';
import { type Brand } from '@/app/dashboard/brands/page';
import {
  Dialog,
  DialogContent,
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

interface AddBrandModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBrandAdded: (brand: Brand) => void;
}

const COLOR_OPTIONS = [
  { value: '#3B82F6', label: 'Mavi' },
  { value: '#10B981', label: 'Yeşil' },
  { value: '#0EA5E9', label: 'Açık Mavi' },
  { value: '#EC4899', label: 'Pembe' },
  { value: '#EF4444', label: 'Kırmızı' },
  { value: '#8B5CF6', label: 'Mor' },
  { value: '#F59E0B', label: 'Turuncu' },
  { value: '#14B8A6', label: 'Turkuaz' },
  { value: '#6366F1', label: 'İndigo' },
  { value: '#06B6D4', label: 'Cyan' },
];

export function AddBrandModal({
  open,
  onOpenChange,
  onBrandAdded,
}: AddBrandModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    status: 'active' as Brand['status'],
    primaryColor: '#3B82F6',
    projectCount: 0,
    campaignCount: 0,
    teamSize: 0,
    revenue: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newBrand: Brand = {
      id: Date.now().toString(),
      ...formData,
    };

    onBrandAdded(newBrand);
    onOpenChange(false);

    // Reset form
    setFormData({
      name: '',
      status: 'active',
      primaryColor: '#3B82F6',
      projectCount: 0,
      campaignCount: 0,
      teamSize: 0,
      revenue: '',
      description: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Yeni Marka Ekle
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Marka Adı <span className="text-danger-600">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Örn: TechCorp"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Açıklama</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Marka hakkında kısa açıklama..."
              rows={3}
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Durum</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({ ...formData, status: value as Brand['status'] })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="paused">Duraklatıldı</SelectItem>
                <SelectItem value="archived">Arşivlendi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Primary Color */}
          <div className="space-y-2">
            <Label htmlFor="primaryColor">Ana Renk</Label>
            <Select
              value={formData.primaryColor}
              onValueChange={(value) =>
                setFormData({ ...formData, primaryColor: value })
              }
            >
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <div
                    className="h-4 w-4 rounded-full border border-neutral-300 dark:border-neutral-600"
                    style={{ backgroundColor: formData.primaryColor }}
                  />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                {COLOR_OPTIONS.map((color) => (
                  <SelectItem key={color.value} value={color.value}>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-4 w-4 rounded-full border border-neutral-300"
                        style={{ backgroundColor: color.value }}
                      />
                      {color.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Project Count */}
            <div className="space-y-2">
              <Label htmlFor="projectCount">Proje Sayısı</Label>
              <Input
                id="projectCount"
                type="number"
                min="0"
                value={formData.projectCount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    projectCount: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>

            {/* Campaign Count */}
            <div className="space-y-2">
              <Label htmlFor="campaignCount">Kampanya Sayısı</Label>
              <Input
                id="campaignCount"
                type="number"
                min="0"
                value={formData.campaignCount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    campaignCount: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>

            {/* Team Size */}
            <div className="space-y-2">
              <Label htmlFor="teamSize">Ekip Sayısı</Label>
              <Input
                id="teamSize"
                type="number"
                min="0"
                value={formData.teamSize}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    teamSize: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>

            {/* Revenue */}
            <div className="space-y-2">
              <Label htmlFor="revenue">Gelir</Label>
              <Input
                id="revenue"
                value={formData.revenue}
                onChange={(e) =>
                  setFormData({ ...formData, revenue: e.target.value })
                }
                placeholder="Örn: ₺250K"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              İptal
            </Button>
            <Button type="submit" className="flex-1">
              Marka Ekle
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
