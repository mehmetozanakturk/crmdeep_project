'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Inbox as InboxIcon, Mail, Star, Archive, Trash2, Search, Send, RefreshCw, Loader2 } from 'lucide-react';
import { getActiveWorkspaceId } from '@/lib/workspace-storage';
import * as EmailsAPI from '@/lib/api/emails';

interface Email {
  id: string;
  from: string;
  subject: string;
  preview: string;
  time: string;
  unread: boolean;
  starred: boolean;
  company?: string;
}

const DEMO_EMAILS: Email[] = [
  { id: '1', from: 'Can Demir', subject: 'Proje güncellemesi', preview: 'Merhaba, projedeki son gelişmeleri paylaşmak istiyorum...', time: '10:30', unread: true, starred: true, company: 'Acme Corp' },
  { id: '2', from: 'Elif Yılmaz', subject: 'Toplantı daveti', preview: 'Yarın saat 14:00de yapılacak toplantıya davetlisiniz...', time: '09:15', unread: true, starred: false, company: 'TechStart' },
  { id: '3', from: 'Ahmet Kaya', subject: 'Fatura onayı', preview: 'Ekli faturayı incelemenizi rica ederim...', time: 'Dün', unread: false, starred: false },
  { id: '4', from: 'Zeynep Arslan', subject: 'Demo talebi', preview: 'Ürününüzün demosunu görmek istiyoruz...', time: 'Dün', unread: false, starred: true, company: 'GlobalSoft' },
];

export default function InboxPage() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'starred'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmailsData();

    const handleWorkspaceChange = () => {
      loadEmailsData();
    };

    window.addEventListener('workspaceChanged', handleWorkspaceChange);
    return () => window.removeEventListener('workspaceChanged', handleWorkspaceChange);
  }, []);

  const loadEmailsData = async () => {
    try {
      setLoading(true);
      const workspaceId = getActiveWorkspaceId();
      if (!workspaceId) {
        console.warn('No active workspace');
        setLoading(false);
        return;
      }

      const data = await EmailsAPI.loadEmails(workspaceId);
      // Map to frontend format
      const mappedData = data.map((email: any) => ({
        id: email.id,
        from: email.from_name || email.from_email,
        subject: email.subject,
        preview: email.body?.substring(0, 100) || '',
        time: new Date(email.created_at).toLocaleDateString('tr-TR'),
        unread: !email.is_read,
        starred: email.is_starred,
        company: email.company_id,
      }));
      setEmails(mappedData);
    } catch (error) {
      console.error('Error loading emails:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmails = emails.filter(email => {
    const matchesSearch =
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.from.toLowerCase().includes(searchQuery.toLowerCase());

    if (filter === 'unread') return matchesSearch && email.unread;
    if (filter === 'starred') return matchesSearch && email.starred;
    return matchesSearch;
  });

  const unreadCount = emails.filter(e => e.unread).length;
  const starredCount = emails.filter(e => e.starred).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary-600 dark:text-primary-400" />
          <h3 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            E-postalar yükleniyor...
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            Gelen Kutusu
            {unreadCount > 0 && <Badge variant="destructive">{unreadCount}</Badge>}
          </h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">{emails.length} e-posta Supabase'den yüklendi</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadEmailsData}><RefreshCw className="mr-2 h-4 w-4" />Yenile</Button>
          <Button><Send className="mr-2 h-4 w-4" />Yeni E-posta</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Gelen</p>
                <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-neutral-100">{emails.length}</p>
              </div>
              <InboxIcon className="h-8 w-8 text-primary-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
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
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Yıldızlı</p>
                <p className="mt-1 text-2xl font-bold text-primary-600 dark:text-primary-400">{starredCount}</p>
              </div>
              <Star className="h-8 w-8 text-primary-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Arşiv</p>
                <p className="mt-1 text-2xl font-bold text-neutral-600 dark:text-neutral-400">0</p>
              </div>
              <Archive className="h-8 w-8 text-neutral-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <Input
            type="text"
            placeholder="E-posta ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>Tümü</Button>
        <Button variant={filter === 'unread' ? 'default' : 'outline'} onClick={() => setFilter('unread')}>Okunmamış</Button>
        <Button variant={filter === 'starred' ? 'default' : 'outline'} onClick={() => setFilter('starred')}>Yıldızlı</Button>
      </div>

      <div className="grid gap-2">
        {filteredEmails.map((email) => (
          <Card key={email.id} className="border-neutral-200 dark:border-neutral-700 hover:shadow-sm transition-all cursor-pointer">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                    {email.from.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-semibold ${email.unread ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-600 dark:text-neutral-400'}`}>
                      {email.from}
                    </h3>
                    {email.company && <Badge variant="outline" className="text-xs">{email.company}</Badge>}
                    <span className="text-xs text-neutral-500 ml-auto">{email.time}</span>
                    {email.starred && <Star className="h-4 w-4 fill-warning-500 text-warning-500" />}
                    {email.unread && <Badge className="bg-primary-500 text-white text-xs">Yeni</Badge>}
                  </div>
                  <p className={`text-sm mt-1 ${email.unread ? 'font-medium text-neutral-900 dark:text-neutral-100' : 'text-neutral-700 dark:text-neutral-300'}`}>
                    {email.subject}
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate mt-1">{email.preview}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Archive className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-danger-600"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredEmails.length === 0 && (
          <Card className="border-neutral-200 dark:border-neutral-700">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Mail className="h-12 w-12 text-neutral-300 dark:text-neutral-600" />
              <h3 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                E-posta bulunamadı
              </h3>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                Bu filtreye uygun e-posta yok
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
