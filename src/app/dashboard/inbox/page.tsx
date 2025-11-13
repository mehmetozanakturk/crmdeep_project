'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Inbox as InboxIcon, Mail, Archive, Trash2, Send, Eye, EyeOff } from 'lucide-react';
import { useOrganization } from '@/lib/hooks/useOrganization';
import { createClient } from '@/lib/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import { ComposeMessageModal } from '@/components/inbox/ComposeMessageModal';

interface InboxMessage {
  id: string;
  organization_id: string;
  subject: string;
  body: string;
  from_email: string;
  to_email: string;
  message_type: string;
  status: string;
  contact_id?: string;
  company_id?: string;
  created_at: string;
  updated_at: string;
}

export default function InboxPage() {
  const { currentOrganization } = useOrganization();
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [composeModalOpen, setComposeModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread' | 'archived'>('all');

  useEffect(() => {
    loadMessages();
  }, [currentOrganization, selectedFilter]);

  const loadMessages = async () => {
    if (!currentOrganization) return;

    setLoading(true);
    try {
      const supabase = createClient();
      let query = supabase
        .from('inbox_messages')
        .select('*')
        .eq('organization_id', currentOrganization.id)
        .order('created_at', { ascending: false });

      if (selectedFilter === 'unread') {
        query = query.eq('status', 'unread');
      } else if (selectedFilter === 'archived') {
        query = query.eq('status', 'archived');
      }

      const { data, error } = await query;

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string, currentStatus: string) => {
    try {
      const supabase = createClient();
      const newStatus = currentStatus === 'read' ? 'unread' : 'read';
      const { error } = await supabase
        .from('inbox_messages')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      loadMessages();
    } catch (error) {
      console.error('Error updating message:', error);
      alert('Mesaj güncellenirken hata oluştu');
    }
  };

  const handleArchive = async (id: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('inbox_messages')
        .update({ status: 'archived' })
        .eq('id', id);

      if (error) throw error;
      loadMessages();
    } catch (error) {
      console.error('Error archiving message:', error);
      alert('Mesaj arşivlenirken hata oluştu');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu mesajı silmek istediğinizden emin misiniz?')) return;

    try {
      const supabase = createClient();
      const { error } = await supabase.from('inbox_messages').delete().eq('id', id);

      if (error) throw error;
      loadMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Mesaj silinirken hata oluştu');
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Dün';
    } else {
      return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
    }
  };

  const getInitials = (email: string) => {
    const name = email.split('@')[0];
    return name.substring(0, 2).toUpperCase();
  };

  const totalMessages = messages.length;
  const unreadCount = messages.filter(m => m.status === 'unread').length;
  const archivedCount = messages.filter(m => m.status === 'archived').length;
  const emailCount = messages.filter(m => m.message_type === 'email').length;

  const filteredMessages = selectedFilter === 'all'
    ? messages.filter(m => m.status !== 'archived')
    : messages;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Gelen Kutusu</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">Ortak e-posta yönetimi</p>
        </div>
        <Button onClick={() => setComposeModalOpen(true)}>
          <Send className="mr-2 h-4 w-4" />Yeni Mesaj
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Toplam</p>
                <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-neutral-100">{totalMessages}</p>
              </div>
              <InboxIcon className="h-8 w-8 text-primary-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700 cursor-pointer hover:shadow-sm transition-shadow" onClick={() => setSelectedFilter('unread')}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Okunmamış</p>
                <p className="mt-1 text-2xl font-bold text-warning-600 dark:text-warning-400">{unreadCount}</p>
              </div>
              <Mail className="h-8 w-8 text-warning-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">E-posta</p>
                <p className="mt-1 text-2xl font-bold text-primary-600 dark:text-primary-400">{emailCount}</p>
              </div>
              <Mail className="h-8 w-8 text-primary-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700 cursor-pointer hover:shadow-sm transition-shadow" onClick={() => setSelectedFilter('archived')}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Arşiv</p>
                <p className="mt-1 text-2xl font-bold text-neutral-600 dark:text-neutral-400">{archivedCount}</p>
              </div>
              <Archive className="h-8 w-8 text-neutral-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2">
        <Button
          variant={selectedFilter === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedFilter('all')}
        >
          Tümü
        </Button>
        <Button
          variant={selectedFilter === 'unread' ? 'default' : 'outline'}
          onClick={() => setSelectedFilter('unread')}
        >
          Okunmamış
        </Button>
        <Button
          variant={selectedFilter === 'archived' ? 'default' : 'outline'}
          onClick={() => setSelectedFilter('archived')}
        >
          Arşiv
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-neutral-600 dark:text-neutral-400">Mesajlar yükleniyor...</p>
          </div>
        </div>
      ) : filteredMessages.length === 0 ? (
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="py-12 text-center">
            <InboxIcon className="h-12 w-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              {selectedFilter === 'archived' ? 'Arşivlenmiş mesaj yok' : 'Henüz mesaj yok'}
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {selectedFilter === 'all' ? 'Yeni mesaj oluşturmak için yukarıdaki butonu kullanın' : 'Bu kategoride mesaj bulunmuyor'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-2">
          {filteredMessages.map((message) => (
            <Card
              key={message.id}
              className={`border-neutral-200 dark:border-neutral-700 hover:shadow-sm transition-all cursor-pointer ${
                message.status === 'unread' ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''
              }`}
            >
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary-100 text-primary-600">
                      {getInitials(message.from_email)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-semibold text-neutral-900 dark:text-neutral-100 ${message.status === 'unread' ? 'font-bold' : ''}`}>
                        {message.from_email}
                      </h3>
                      <span className="text-xs text-neutral-500">{formatTime(message.created_at)}</span>
                      {message.status === 'unread' && (
                        <Badge className="bg-primary-500 text-white text-xs">Yeni</Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {message.message_type === 'email' ? 'E-posta' : message.message_type === 'sms' ? 'SMS' : 'Chat'}
                      </Badge>
                    </div>
                    <p className={`text-sm mt-1 text-neutral-900 dark:text-neutral-100 ${message.status === 'unread' ? 'font-semibold' : ''}`}>
                      {message.subject}
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-500 truncate mt-1">
                      {message.body ? message.body.substring(0, 100) + '...' : 'İçerik yok'}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleMarkAsRead(message.id, message.status)}>
                          {message.status === 'read' ? (
                            <><EyeOff className="mr-2 h-4 w-4" />Okunmadı işaretle</>
                          ) : (
                            <><Eye className="mr-2 h-4 w-4" />Okundu işaretle</>
                          )}
                        </DropdownMenuItem>
                        {message.status !== 'archived' && (
                          <DropdownMenuItem onClick={() => handleArchive(message.id)}>
                            <Archive className="mr-2 h-4 w-4" />Arşivle
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleDelete(message.id)} className="text-danger-600">
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

      <ComposeMessageModal
        open={composeModalOpen}
        onOpenChange={setComposeModalOpen}
        onMessageSent={loadMessages}
      />
    </div>
  );
}
