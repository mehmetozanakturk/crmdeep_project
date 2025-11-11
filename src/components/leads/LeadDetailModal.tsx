'use client';

import { type Lead } from '@/app/dashboard/leads/page';
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
  Mail,
  Phone,
  Building2,
  Edit,
  Trash2,
  TrendingUp,
  Target,
  Award,
} from 'lucide-react';

interface LeadDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onDelete: (leadId: string) => void;
}

export function LeadDetailModal({
  open,
  onOpenChange,
  lead,
  onEdit,
  onDelete,
}: LeadDetailModalProps) {
  const getStatusBadge = (status: Lead['status']) => {
    switch (status) {
      case 'new':
        return (
          <Badge className="bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100">
            Yeni
          </Badge>
        );
      case 'contacted':
        return (
          <Badge className="bg-warning-100 text-warning-700 dark:bg-warning-900 dark:text-warning-100">
            İletişimde
          </Badge>
        );
      case 'qualified':
        return (
          <Badge className="bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-100">
            Nitelikli
          </Badge>
        );
      case 'unqualified':
        return (
          <Badge className="bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
            Niteliksiz
          </Badge>
        );
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success-600 dark:text-success-400';
    if (score >= 60) return 'text-warning-600 dark:text-warning-400';
    return 'text-danger-600 dark:text-danger-400';
  };

  const handleDelete = () => {
    if (confirm('Bu lead\'i silmek istediğinizden emin misiniz?')) {
      onDelete(lead.id);
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
                <AvatarFallback className="bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-100 text-lg">
                  {lead.name.split(' ').map((n) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {lead.name}
                </DialogTitle>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 flex items-center gap-1 mt-1">
                  <Building2 className="h-3 w-3" />
                  {lead.company}
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Source */}
          <div className="flex items-center gap-3 flex-wrap">
            {getStatusBadge(lead.status)}
            <Badge variant="outline" className="bg-neutral-50 dark:bg-neutral-800">
              Kaynak: {lead.source}
            </Badge>
          </div>

          {/* Lead Score */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              Lead Skoru
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  Nitelik Değerlendirmesi
                </span>
                <span className={`text-2xl font-bold ${getScoreColor(lead.score)}`}>
                  {lead.score}
                </span>
              </div>
              <Progress value={lead.score} className="h-3" />
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {lead.score >= 80 && 'Yüksek kaliteli lead - Öncelikli takip önerilir'}
                {lead.score >= 60 && lead.score < 80 && 'Orta kaliteli lead - Düzenli takip gerekli'}
                {lead.score < 60 && 'Düşük kaliteli lead - İlave nitelendirme gerekli'}
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">
              İletişim Bilgileri
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                <Mail className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                <a
                  href={`mailto:${lead.email}`}
                  className="font-medium text-neutral-900 dark:text-neutral-100 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  {lead.email}
                </a>
              </div>
              {lead.phone && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                  <Phone className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  <a
                    href={`tel:${lead.phone}`}
                    className="font-medium text-neutral-900 dark:text-neutral-100 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    {lead.phone}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Potential Value */}
          {lead.value && (
            <div>
              <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                Potansiyel Değer
              </h3>
              <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-success-50 dark:bg-neutral-800 border border-success-200 dark:border-success-600">
                <TrendingUp className="h-6 w-6 text-success-700 dark:text-success-400" />
                <span className="text-2xl font-bold text-success-800 dark:text-success-300">
                  {lead.value}
                </span>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-lg bg-primary-50 dark:bg-neutral-800 border border-primary-200 dark:border-primary-600">
              <div className="flex items-center gap-2 text-primary-700 dark:text-primary-400 mb-1">
                <Target className="h-4 w-4" />
                <span className="text-xs font-medium">Durum</span>
              </div>
              <p className="text-sm font-bold text-primary-800 dark:text-primary-300">
                {lead.status === 'new' && 'Yeni'}
                {lead.status === 'contacted' && 'İletişimde'}
                {lead.status === 'qualified' && 'Nitelikli'}
                {lead.status === 'unqualified' && 'Niteliksiz'}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-success-50 dark:bg-neutral-800 border border-success-200 dark:border-success-600">
              <div className="flex items-center gap-2 text-success-700 dark:text-success-400 mb-1">
                <Award className="h-4 w-4" />
                <span className="text-xs font-medium">Skor</span>
              </div>
              <p className="text-lg font-bold text-success-800 dark:text-success-300">
                {lead.score}/100
              </p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-600">
              <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-400 mb-1">
                <Building2 className="h-4 w-4" />
                <span className="text-xs font-medium">Kaynak</span>
              </div>
              <p className="text-sm font-bold text-neutral-800 dark:text-neutral-300">
                {lead.source}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <Button
              onClick={() => {
                onEdit(lead);
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
