'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, MessageSquare, Clock, CheckCircle2, AlertCircle, Trash2, MoreVertical } from 'lucide-react';
import { AddTicketModal } from '@/components/tickets/AddTicketModal';
import { useOrganization } from '@/lib/hooks/useOrganization';
import { useBrands } from '@/lib/hooks/useBrands';
import { createClient } from '@/lib/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Ticket {
  id: string;
  title: string;
  description?: string;
  client_name?: string;
  client_email?: string;
  priority: string;
  status: string;
  category?: string;
  created_at: string;
  updated_at: string;
}

export default function TicketsPage() {
  const { currentOrganization } = useOrganization();
  const { currentBrand } = useBrands();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTickets();
  }, [currentOrganization, currentBrand]);

  const loadTickets = async () => {
    if (!currentOrganization) return;

    setLoading(true);
    try {
      const supabase = createClient();
      let query = supabase
        .from('tickets')
        .select('*')
        .eq('organization_id', currentOrganization.id)
        .order('created_at', { ascending: false });

      if (currentBrand) {
        query = query.eq('brand_id', currentBrand.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu destek talebini silmek istediğinizden emin misiniz?')) return;

    try {
      const supabase = createClient();
      const { error } = await supabase.from('tickets').delete().eq('id', id);

      if (error) throw error;
      loadTickets();
    } catch (error) {
      console.error('Error deleting ticket:', error);
      alert('Destek talebi silinirken hata oluştu');
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('tickets')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      loadTickets();
    } catch (error) {
      console.error('Error updating ticket status:', error);
      alert('Durum güncellenirken hata oluştu');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return 'Az önce';
    if (diffInHours < 24) return `${diffInHours} saat önce`;
    if (diffInDays === 1) return '1 gün önce';
    if (diffInDays < 7) return `${diffInDays} gün önce`;

    return date.toLocaleDateString('tr-TR');
  };

  const getInitials = (name?: string) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'low': return 'Düşük';
      case 'medium': return 'Orta';
      case 'high': return 'Yüksek';
      case 'urgent': return 'Acil';
      default: return priority;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open': return 'Açık';
      case 'in-progress': return 'İşlemde';
      case 'resolved': return 'Çözüldü';
      case 'closed': return 'Kapalı';
      default: return status;
    }
  };

  const getCategoryLabel = (category?: string) => {
    if (!category) return 'Genel';
    switch (category) {
      case 'technical': return 'Teknik';
      case 'billing': return 'Fatura';
      case 'feature': return 'Özellik';
      case 'other': return 'Diğer';
      default: return category;
    }
  };

  // Calculate stats
  const openTickets = tickets.filter(t => t.status === 'open').length;
  const inProgressTickets = tickets.filter(t => t.status === 'in-progress').length;
  const resolvedTickets = tickets.filter(t => t.status === 'resolved').length;
  const highPriorityTickets = tickets.filter(t => t.priority === 'high' || t.priority === 'urgent').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Destek Talepleri</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">Müşteri destek ticket sistemi</p>
        </div>
        <Button onClick={() => setAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />Yeni Ticket
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Açık</p>
                <p className="mt-1 text-2xl font-bold text-warning-600 dark:text-warning-400">{openTickets}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-warning-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">İşlemde</p>
                <p className="mt-1 text-2xl font-bold text-primary-600 dark:text-primary-400">{inProgressTickets}</p>
              </div>
              <Clock className="h-8 w-8 text-primary-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Çözüldü</p>
                <p className="mt-1 text-2xl font-bold text-success-600 dark:text-success-400">{resolvedTickets}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-success-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Yüksek Öncelik</p>
                <p className="mt-1 text-2xl font-bold text-danger-600 dark:text-danger-400">{highPriorityTickets}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-danger-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-neutral-600 dark:text-neutral-400">Destek talepleri yükleniyor...</p>
          </div>
        </div>
      ) : tickets.length === 0 ? (
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="py-12 text-center">
            <MessageSquare className="h-12 w-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Henüz destek talebi yok</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Yeni destek talebi eklemek için yukarıdaki butonu kullanın</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {tickets.map((ticket) => (
            <Card key={ticket.id} className="border-neutral-200 dark:border-neutral-700">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                        {getInitials(ticket.client_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{ticket.title}</h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        {ticket.client_name || 'Müşteri belirtilmemiş'}
                      </p>
                      <div className="flex gap-2 mt-2">
                        {ticket.category && (
                          <Badge variant="outline" className="dark:border-neutral-600">
                            {getCategoryLabel(ticket.category)}
                          </Badge>
                        )}
                        <Badge className={
                          ticket.priority === 'high' || ticket.priority === 'urgent'
                            ? 'bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400'
                            : ticket.priority === 'medium'
                            ? 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400'
                            : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400'
                        }>
                          {getPriorityLabel(ticket.priority)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">
                      {formatDate(ticket.created_at)}
                    </span>
                    <Badge className={
                      ticket.status === 'resolved'
                        ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400'
                        : ticket.status === 'in-progress'
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                        : ticket.status === 'closed'
                        ? 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400'
                        : 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400'
                    }>
                      {getStatusLabel(ticket.status)}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleStatusUpdate(ticket.id, 'open')}>
                          Açık olarak işaretle
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusUpdate(ticket.id, 'in-progress')}>
                          İşlemde olarak işaretle
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusUpdate(ticket.id, 'resolved')}>
                          Çözüldü olarak işaretle
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusUpdate(ticket.id, 'closed')}>
                          Kapalı olarak işaretle
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(ticket.id)} className="text-danger-600">
                          <Trash2 className="mr-2 h-4 w-4" />Sil
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddTicketModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onTicketAdded={loadTickets}
      />
    </div>
  );
}
