'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Inbox as InboxIcon, Mail, Star, Archive, Trash2 } from 'lucide-react';

const DEMO_EMAILS = [
  { id: '1', from: 'Can Demir', subject: 'Proje güncellemesi', preview: 'Merhaba, projedeki son gelişmeleri paylaşmak istiyorum...', time: '10:30', unread: true, starred: true },
  { id: '2', from: 'Elif Yılmaz', subject: 'Toplantı daveti', preview: 'Yarın saat 14:00de yapılacak toplantıya davetlisiniz...', time: '09:15', unread: true, starred: false },
  { id: '3', from: 'Ahmet Kaya', subject: 'Fatura onayı', preview: 'Ekli faturayı incelemenizi rica ederim...', time: 'Dün', unread: false, starred: false },
  { id: '4', from: 'Zeynep Arslan', subject: 'Demo talebi', preview: 'Ürününüzün demosunu görmek istiyoruz...', time: 'Dün', unread: false, starred: true },
];

export default function InboxPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Gelen Kutusu</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">Ortak e-posta yönetimi</p>
        </div>
        <Button><Mail className="mr-2 h-4 w-4" />Yeni Email</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Gelen</p>
                <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-neutral-100">4</p>
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
                <p className="mt-1 text-2xl font-bold text-warning-600 dark:text-warning-400">2</p>
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
                <p className="mt-1 text-2xl font-bold text-primary-600 dark:text-primary-400">2</p>
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
                <p className="mt-1 text-2xl font-bold text-neutral-600 dark:text-neutral-400">28</p>
              </div>
              <Archive className="h-8 w-8 text-neutral-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-2">
        {DEMO_EMAILS.map((email) => (
          <Card key={email.id} className="border-neutral-200 dark:border-neutral-700 hover:shadow-sm transition-all cursor-pointer">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary-100 text-primary-600">{email.from.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{email.from}</h3>
                    <span className="text-xs text-neutral-500">{email.time}</span>
                    {email.starred && <Star className="h-4 w-4 fill-warning-500 text-warning-500" />}
                    {email.unread && <Badge className="bg-primary-500 text-white text-xs">Yeni</Badge>}
                  </div>
                  <p className="text-sm mt-1 text-neutral-900 dark:text-neutral-100">{email.subject}</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-500 truncate mt-1">{email.preview}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Archive className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
