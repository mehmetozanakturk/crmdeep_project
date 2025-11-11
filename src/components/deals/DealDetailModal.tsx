'use client';

import { type Deal } from '@/app/dashboard/deals/page';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  DollarSign,
  Building2,
  User,
  Clock,
  Edit,
  Trash2,
  TrendingUp,
  Target,
  Calendar,
  Tag,
} from 'lucide-react';

interface DealDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deal: Deal;
  onEdit: (deal: Deal) => void;
  onDelete: (dealId: string) => void;
  onMoveStage?: (dealId: string, newStage: Deal['stage']) => void;
}

export function DealDetailModal({
  open,
  onOpenChange,
  deal,
  onEdit,
  onDelete,
}: DealDetailModalProps) {
  const getStageLabel = (stage: Deal['stage']) => {
    switch (stage) {
      case 'lead':
        return 'Potansiyel';
      case 'qualified':
        return 'Nitelikli';
      case 'proposal':
        return 'Teklif';
      case 'negotiation':
        return 'Müzakere';
      case 'closed_won':
        return 'Kazanıldı';
      case 'closed_lost':
        return 'Kaybedildi';
    }
  };

  const getStageColor = (stage: Deal['stage']) => {
    switch (stage) {
      case 'lead':
        return 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300';
      case 'qualified':
        return 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400';
      case 'proposal':
        return 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400';
      case 'negotiation':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'closed_won':
        return 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400';
      case 'closed_lost':
        return 'bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400';
    }
  };

  const handleDelete = () => {
    if (confirm('Bu fırsatı silmek istediğinizden emin misiniz?')) {
      onDelete(deal.id);
      onOpenChange(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 pr-8">
              {deal.title}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Stage and Probability */}
          <div className="flex items-center gap-3 flex-wrap">
            <Badge className={getStageColor(deal.stage)}>
              {getStageLabel(deal.stage)}
            </Badge>
            <Badge variant="outline" className="bg-primary-50 dark:bg-primary-900/20">
              <TrendingUp className="mr-1 h-3 w-3" />
              %{deal.probability} Olasılık
            </Badge>
            <Badge variant="secondary" className="bg-neutral-100 dark:bg-neutral-800">
              <Clock className="mr-1 h-3 w-3" />
              {deal.daysInStage} gün
            </Badge>
          </div>

          {/* Deal Value */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              Fırsat Değeri
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800">
                <DollarSign className="h-6 w-6 text-success-600 dark:text-success-400" />
                <span className="text-2xl font-bold text-success-700 dark:text-success-300">
                  {formatCurrency(deal.value)}
                </span>
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                <p>Tahmini Değer</p>
                <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {formatCurrency(deal.value * (deal.probability / 100))}
                </p>
              </div>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              Firma
            </h3>
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-neutral-100 dark:bg-neutral-800">
              <Building2 className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              <span className="font-medium text-neutral-900 dark:text-neutral-100">
                {deal.company}
              </span>
            </div>
          </div>

          {/* Contact Person */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              İletişim Kişisi
            </h3>
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-neutral-100 dark:bg-neutral-800">
              <User className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              <span className="font-medium text-neutral-900 dark:text-neutral-100">
                {deal.contactPerson}
              </span>
            </div>
          </div>

          {/* Assignee */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              Sorumlu
            </h3>
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-neutral-100 dark:bg-neutral-800">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                  {deal.assignee.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-neutral-900 dark:text-neutral-100">
                {deal.assignee}
              </span>
            </div>
          </div>

          {/* Tags */}
          {deal.tags && deal.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                Etiketler
              </h3>
              <div className="flex flex-wrap gap-2">
                {deal.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                  >
                    <Tag className="mr-1 h-3 w-3" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Probability Progress */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              Başarı Olasılığı
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  Kapanma Şansı
                </span>
                <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                  %{deal.probability}
                </span>
              </div>
              <Progress value={deal.probability} className="h-3" />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-lg bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
              <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 mb-1">
                <Calendar className="h-4 w-4" />
                <span className="text-xs font-medium">Aşamada</span>
              </div>
              <p className="text-2xl font-bold text-primary-700 dark:text-primary-300">
                {deal.daysInStage} gün
              </p>
            </div>
            <div className="p-4 rounded-lg bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800">
              <div className="flex items-center gap-2 text-success-600 dark:text-success-400 mb-1">
                <Target className="h-4 w-4" />
                <span className="text-xs font-medium">Beklenen</span>
              </div>
              <p className="text-lg font-bold text-success-700 dark:text-success-300">
                {formatCurrency(deal.value * (deal.probability / 100))}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <Button
              onClick={() => {
                onEdit(deal);
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
