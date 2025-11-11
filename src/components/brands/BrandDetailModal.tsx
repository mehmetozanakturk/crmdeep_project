'use client';

import { type Brand } from '@/app/dashboard/brands/page';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Briefcase,
  Edit,
  Trash2,
  TrendingUp,
  Users,
  Target,
  Palette,
  BarChart3,
} from 'lucide-react';

interface BrandDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  brand: Brand;
  onEdit: (brand: Brand) => void;
  onDelete: (brandId: string) => void;
}

export function BrandDetailModal({
  open,
  onOpenChange,
  brand,
  onEdit,
  onDelete,
}: BrandDetailModalProps) {
  const getStatusBadge = (status: Brand['status']) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400">
            Aktif
          </Badge>
        );
      case 'paused':
        return (
          <Badge className="bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400">
            Duraklatıldı
          </Badge>
        );
      case 'archived':
        return (
          <Badge className="bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
            Arşivlendi
          </Badge>
        );
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleDelete = () => {
    if (confirm('Bu markayı silmek istediğinizden emin misiniz?')) {
      onDelete(brand.id);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-14 w-14">
                <AvatarFallback
                  style={{
                    backgroundColor: brand.primaryColor + '20',
                    color: brand.primaryColor,
                  }}
                  className="text-lg font-bold"
                >
                  {getInitials(brand.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {brand.name}
                </DialogTitle>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  {brand.description}
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Color */}
          <div className="flex items-center gap-3 flex-wrap">
            {getStatusBadge(brand.status)}
            <Badge variant="outline" className="bg-neutral-50 dark:bg-neutral-800">
              <Palette className="mr-1 h-3 w-3" />
              Marka Rengi
              <div
                className="ml-2 h-3 w-3 rounded-full border border-neutral-300 dark:border-neutral-600"
                style={{ backgroundColor: brand.primaryColor }}
              />
            </Badge>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              Açıklama
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
              {brand.description || 'Açıklama eklenmemiş'}
            </p>
          </div>

          {/* Stats Grid */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">
              İstatistikler
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-lg bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
                <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 mb-1">
                  <Briefcase className="h-4 w-4" />
                  <span className="text-xs font-medium">Projeler</span>
                </div>
                <p className="text-2xl font-bold text-primary-700 dark:text-primary-300">
                  {brand.projectCount}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800">
                <div className="flex items-center gap-2 text-success-600 dark:text-success-400 mb-1">
                  <Target className="h-4 w-4" />
                  <span className="text-xs font-medium">Kampanyalar</span>
                </div>
                <p className="text-2xl font-bold text-success-700 dark:text-success-300">
                  {brand.campaignCount}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800">
                <div className="flex items-center gap-2 text-warning-600 dark:text-warning-400 mb-1">
                  <Users className="h-4 w-4" />
                  <span className="text-xs font-medium">Ekip</span>
                </div>
                <p className="text-2xl font-bold text-warning-700 dark:text-warning-300">
                  {brand.teamSize} kişi
                </p>
              </div>

              <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-1">
                  <BarChart3 className="h-4 w-4" />
                  <span className="text-xs font-medium">Gelir</span>
                </div>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {brand.revenue}
                </p>
              </div>
            </div>
          </div>

          {/* Performance Summary */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              Performans Özeti
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  Toplam Proje
                </span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {brand.projectCount}
                </span>
              </div>
              <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  Aktif Kampanyalar
                </span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {brand.campaignCount}
                </span>
              </div>
              <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  Ekip Büyüklüğü
                </span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {brand.teamSize} kişi
                </span>
              </div>
              <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800">
                <span className="text-sm text-success-600 dark:text-success-400 font-medium">
                  Toplam Gelir
                </span>
                <span className="font-bold text-success-700 dark:text-success-300">
                  {brand.revenue}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <Button
              onClick={() => {
                onEdit(brand);
                onOpenChange(false);
              }}
              className="flex-1"
              variant="outline"
            >
              <Edit className="mr-2 h-4 w-4" />
              Düzenle
            </Button>
            <Button onClick={handleDelete} variant="destructive" className="flex-1">
              <Trash2 className="mr-2 h-4 w-4" />
              Sil
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
