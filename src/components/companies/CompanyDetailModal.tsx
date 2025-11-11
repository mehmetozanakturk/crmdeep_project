'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  Building2,
  MapPin,
  Globe,
  Mail,
  Phone,
  Users,
  DollarSign,
  Calendar,
  TrendingUp,
  CheckCircle2,
  Clock,
  PauseCircle,
  ListTodo,
  FileText,
  CalendarDays,
  Edit,
  Trash2,
  Plus,
  AlertCircle,
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  status: 'planned' | 'in_progress' | 'completed' | 'on_hold';
  start_date: string;
  end_date?: string;
  budget?: string;
  progress: number;
}

interface Company {
  id: string;
  name: string;
  logo?: string;
  industry: string;
  size: string;
  revenue: string;
  location: string;
  website: string;
  email: string;
  phone: string;
  contacts: number;
  deals: number;
  status: 'active' | 'prospect' | 'inactive';
  tags: string[];
  created_at: string;
  updated_at: string;
  projects: Project[];
  agreement_date?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  relatedTasks: string[];
  relatedNotes: string[];
  relatedEvents: string[];
  last_activity_date?: string;
  total_revenue?: string;
  description?: string;
}

interface CompanyDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company: Company;
  onEdit: (company: Company) => void;
  onDelete: (companyId: string) => void;
}

const getProjectStatusInfo = (status: Project['status']) => {
  switch (status) {
    case 'planned':
      return {
        label: 'Planlandı',
        icon: ListTodo,
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-50 dark:bg-blue-500/10',
        borderColor: 'border-blue-200 dark:border-blue-500/20',
      };
    case 'in_progress':
      return {
        label: 'Devam Ediyor',
        icon: Clock,
        color: 'text-orange-600 dark:text-orange-400',
        bgColor: 'bg-orange-50 dark:bg-orange-500/10',
        borderColor: 'border-orange-200 dark:border-orange-500/20',
      };
    case 'completed':
      return {
        label: 'Tamamlandı',
        icon: CheckCircle2,
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-50 dark:bg-green-500/10',
        borderColor: 'border-green-200 dark:border-green-500/20',
      };
    case 'on_hold':
      return {
        label: 'Beklemede',
        icon: PauseCircle,
        color: 'text-neutral-600 dark:text-neutral-400',
        bgColor: 'bg-neutral-50 dark:bg-neutral-500/10',
        borderColor: 'border-neutral-200 dark:border-neutral-500/20',
      };
  }
};

const getPriorityInfo = (priority: Company['priority']) => {
  switch (priority) {
    case 'critical':
      return { label: 'Kritik', color: 'bg-red-500 dark:bg-red-600' };
    case 'high':
      return { label: 'Yüksek', color: 'bg-orange-500 dark:bg-orange-600' };
    case 'medium':
      return { label: 'Orta', color: 'bg-yellow-500 dark:bg-yellow-600' };
    case 'low':
      return { label: 'Düşük', color: 'bg-green-500 dark:bg-green-600' };
  }
};

export function CompanyDetailModal({
  open,
  onOpenChange,
  company,
  onEdit,
  onDelete,
}: CompanyDetailModalProps) {
  const priorityInfo = getPriorityInfo(company.priority);

  const handleEdit = () => {
    onOpenChange(false);
    onEdit(company);
  };

  const handleDelete = () => {
    if (confirm(`${company.name} firmasını silmek istediğinizden emin misiniz?`)) {
      onDelete(company.id);
      onOpenChange(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Belirtilmemiş';
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/30 text-xl font-bold text-primary-600 dark:text-primary-400">
                  {company.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <DialogTitle className="text-2xl text-neutral-900 dark:text-neutral-100">
                    {company.name}
                  </DialogTitle>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{company.industry}</Badge>
                    <Badge className={`${priorityInfo.color} text-white border-0`}>
                      {priorityInfo.label} Öncelik
                    </Badge>
                    <Badge variant={company.status === 'active' ? 'default' : 'outline'}>
                      {company.status === 'active' ? 'Aktif' : company.status === 'prospect' ? 'Potansiyel' : 'Pasif'}
                    </Badge>
                  </div>
                </div>
              </div>
              {company.description && (
                <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
                  {company.description}
                </p>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* İletişim Bilgileri */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              İletişim Bilgileri
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>{company.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a href={`mailto:${company.email}`} className="hover:text-primary-600 dark:hover:text-primary-400">
                  {company.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a href={`tel:${company.phone}`} className="hover:text-primary-600 dark:hover:text-primary-400">
                  {company.phone}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                <Globe className="h-4 w-4 flex-shrink-0" />
                <a
                  href={`https://${company.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-600 dark:hover:text-primary-400"
                >
                  {company.website}
                </a>
              </div>
            </div>
          </div>

          <Separator />

          {/* Firma Detayları */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Firma Detayları
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Çalışan Sayısı</p>
                <p className="mt-1 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {company.size} kişi
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Yıllık Gelir</p>
                <p className="mt-1 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {company.revenue}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Anlaşma Tarihi</p>
                <p className="mt-1 text-sm font-medium text-neutral-900 dark:text-neutral-100 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(company.agreement_date)}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Son Aktivite</p>
                <p className="mt-1 text-sm font-medium text-neutral-900 dark:text-neutral-100 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(company.last_activity_date)}
                </p>
              </div>
              {company.total_revenue && (
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Toplam Gelir</p>
                  <p className="mt-1 text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {company.total_revenue}
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* İstatistikler */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              İstatistikler
            </h3>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 p-4 text-center">
                <Users className="mx-auto h-6 w-6 text-primary-600 dark:text-primary-400" />
                <p className="mt-2 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {company.contacts}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Kişiler</p>
              </div>
              <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 p-4 text-center">
                <DollarSign className="mx-auto h-6 w-6 text-success-600 dark:text-success-400" />
                <p className="mt-2 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {company.deals}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Fırsatlar</p>
              </div>
              <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 p-4 text-center">
                <ListTodo className="mx-auto h-6 w-6 text-purple-600 dark:text-purple-400" />
                <p className="mt-2 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {company.projects.length}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Projeler</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Projeler */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <ListTodo className="h-5 w-5" />
                Projeler ve İşler
              </h3>
              <Button size="sm" variant="outline">
                <Plus className="mr-1 h-4 w-4" />
                Yeni Proje
              </Button>
            </div>

            {company.projects.length === 0 ? (
              <div className="rounded-lg border border-dashed border-neutral-300 dark:border-neutral-600 p-8 text-center">
                <AlertCircle className="mx-auto h-8 w-8 text-neutral-400 dark:text-neutral-500" />
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                  Henüz proje eklenmemiş
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {company.projects.map((project) => {
                  const statusInfo = getProjectStatusInfo(project.status);
                  const StatusIcon = statusInfo.icon;

                  return (
                    <div
                      key={project.id}
                      className={`rounded-lg border ${statusInfo.borderColor} ${statusInfo.bgColor} p-4`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <StatusIcon className={`h-4 w-4 ${statusInfo.color}`} />
                            <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">
                              {project.title}
                            </h4>
                            <Badge variant="outline" className="text-xs">
                              {statusInfo.label}
                            </Badge>
                          </div>
                          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                            {project.description}
                          </p>
                          <div className="mt-3 grid gap-2 sm:grid-cols-2">
                            <div className="text-xs text-neutral-500 dark:text-neutral-400">
                              <span className="font-medium">Başlangıç:</span> {formatDate(project.start_date)}
                            </div>
                            {project.end_date && (
                              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                <span className="font-medium">Bitiş:</span> {formatDate(project.end_date)}
                              </div>
                            )}
                            {project.budget && (
                              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                <span className="font-medium">Bütçe:</span> {project.budget}
                              </div>
                            )}
                          </div>
                          {project.status !== 'planned' && (
                            <div className="mt-3">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-neutral-600 dark:text-neutral-400">İlerleme</span>
                                <span className={`font-semibold ${statusInfo.color}`}>
                                  %{project.progress}
                                </span>
                              </div>
                              <Progress value={project.progress} className="h-2" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <Separator />

          {/* İlişkili Öğeler */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              İlişkili Öğeler
            </h3>
            <div className="grid gap-3 sm:grid-cols-3">
              <Button variant="outline" className="h-auto flex-col py-4">
                <CalendarDays className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                <span className="mt-2 text-sm font-medium">
                  {company.relatedEvents.length} Etkinlik
                </span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">Görüntüle</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col py-4">
                <ListTodo className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                <span className="mt-2 text-sm font-medium">
                  {company.relatedTasks.length} Görev
                </span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">Görüntüle</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col py-4">
                <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                <span className="mt-2 text-sm font-medium">
                  {company.relatedNotes.length} Not
                </span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">Görüntüle</span>
              </Button>
            </div>
          </div>

          <Separator />

          {/* Etiketler */}
          {company.tags.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Etiketler
              </h3>
              <div className="flex flex-wrap gap-2">
                {company.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4">
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Düzenle
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Sil
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
