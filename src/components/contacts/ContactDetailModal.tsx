'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { type Contact } from '@/app/dashboard/contacts/page';
import {
  User,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Edit,
  Trash2,
} from 'lucide-react';

interface ContactDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onDelete: (contactId: string) => void;
}

const getStatusInfo = (status: Contact['status']) => {
  switch (status) {
    case 'vip':
      return { label: 'VIP', variant: 'default' as const };
    case 'client':
      return { label: 'Müşteri', variant: 'default' as const };
    case 'lead':
      return { label: 'Lead', variant: 'secondary' as const };
    case 'prospect':
      return { label: 'Potansiyel', variant: 'secondary' as const };
    case 'active':
      return { label: 'Aktif', variant: 'outline' as const };
    case 'inactive':
      return { label: 'Pasif', variant: 'outline' as const };
  }
};

export function ContactDetailModal({
  open,
  onOpenChange,
  contact,
  onEdit,
  onDelete,
}: ContactDetailModalProps) {
  const priorityInfo = getPriorityInfo(contact.priority || 'medium');
  const statusInfo = getStatusInfo(contact.status);

  const handleEdit = () => {
    onOpenChange(false);
    onEdit(contact);
  };

  const handleDelete = () => {
    if (confirm(`${contact.name} kişisini silmek istediğinizden emin misiniz?`)) {
      onDelete(contact.id);
      onOpenChange(false);
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Belirtilmemiş';
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={contact.avatar_url || ''} />
                  <AvatarFallback className="bg-primary-100 text-2xl font-bold text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                    {contact.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <DialogTitle className="text-2xl text-neutral-900 dark:text-neutral-100">
                      {contact.name}
                    </DialogTitle>
                    {contact.is_key_contact && (
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    )}
                  </div>
                  {contact.position && (
                    <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                      {contact.position}
                      {contact.department && ` • ${contact.department}`}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                    <Badge className={`${priorityInfo.color} text-white border-0`}>
                      {priorityInfo.label} Öncelik
                    </Badge>
                    {contact.tags && contact.tags.length > 0 && (
                      contact.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* İletişim Bilgileri */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <User className="h-5 w-5" />
              İletişim Bilgileri
            </h3>
            <div className="grid gap-3">
              {contact.email && (
                <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <a href={`mailto:${contact.email}`} className="hover:text-primary-600 dark:hover:text-primary-400">
                    {contact.email}
                  </a>
                </div>
              )}
              {contact.phone && (
                <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <a href={`tel:${contact.phone}`} className="hover:text-primary-600 dark:hover:text-primary-400">
                    {contact.phone}
                  </a>
                </div>
              )}
              {contact.company_name && (
                <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <Building2 className="h-4 w-4 flex-shrink-0" />
                  <span>{contact.company_name}</span>
                </div>
              )}
              {(contact.city || contact.address) && (
                <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span>
                    {contact.address && `${contact.address}, `}
                    {contact.city}
                    {contact.state && `, ${contact.state}`}
                    {contact.country && `, ${contact.country}`}
                  </span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Sosyal Medya */}
          {(contact.linkedin_url || contact.twitter_url) && (
            <>
              <div>
                <h3 className="mb-3 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  Sosyal Medya
                </h3>
                <div className="flex gap-3">
                  {contact.linkedin_url && (
                    <a
                      href={contact.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg border border-neutral-200 dark:border-neutral-700 px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800"
                    >
                      <Linkedin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      LinkedIn
                    </a>
                  )}
                  {contact.twitter_url && (
                    <a
                      href={contact.twitter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg border border-neutral-200 dark:border-neutral-700 px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800"
                    >
                      <Twitter className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                      Twitter
                    </a>
                  )}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Önemli Tarihler */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Önemli Tarihler
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Son İletişim</p>
                <p className="mt-1 text-sm font-medium text-neutral-900 dark:text-neutral-100 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(contact.last_contact_date)}
                </p>
              </div>
              {contact.birthday && (
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Doğum Günü</p>
                  <p className="mt-1 text-sm font-medium text-neutral-900 dark:text-neutral-100 flex items-center gap-1">
                    <Cake className="h-4 w-4" />
                    {formatDate(contact.birthday)}
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Eklenme Tarihi</p>
                <p className="mt-1 text-sm font-medium text-neutral-900 dark:text-neutral-100 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(contact.created_at)}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Notlar */}
          {contact.notes && (
            <>
              <div>
                <h3 className="mb-3 text-lg font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Notlar
                </h3>
                <div className="rounded-lg bg-neutral-50 dark:bg-neutral-800/50 p-4 text-sm text-neutral-700 dark:text-neutral-300">
                  {contact.notes}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* İlişkili Öğeler */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              İlişkili Öğeler
            </h3>
            <div className="grid gap-3 sm:grid-cols-3">
              <Button variant="outline" className="h-auto flex-col py-4">
                <CalendarDays className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                <span className="mt-2 text-sm font-medium">
                  {contact.relatedEvents?.length || 0} Etkinlik
                </span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">Görüntüle</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col py-4">
                <ListTodo className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                <span className="mt-2 text-sm font-medium">
                  {contact.relatedTasks?.length || 0} Görev
                </span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">Görüntüle</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col py-4">
                <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                <span className="mt-2 text-sm font-medium">
                  {contact.relatedNotes?.length || 0} Not
                </span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">Görüntüle</span>
              </Button>
            </div>
          </div>

          {/* Hızlı Aksiyonlar */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Hızlı Aksiyonlar
            </h3>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Görev Ekle
              </Button>
              <Button size="sm" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Not Ekle
              </Button>
              <Button size="sm" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Etkinlik Ekle
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-neutral-200 dark:border-neutral-700">
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
