'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, MessageSquare, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const DEMO_TICKETS = [
  { id: '1', title: 'Login sorunu yaşıyorum', client: 'Ahmet Yılmaz', priority: 'high', status: 'open', created: '2 saat önce', category: 'Technical' },
  { id: '2', title: 'Fatura bilgilerini güncelleme', client: 'Zeynep Kaya', priority: 'medium', status: 'in-progress', created: '5 saat önce', category: 'Billing' },
  { id: '3', title: 'Yeni özellik önerisi', client: 'Mehmet Demir', priority: 'low', status: 'open', created: '1 gün önce', category: 'Feature Request' },
  { id: '4', title: 'API entegrasyonu yardım', client: 'Elif Şahin', priority: 'high', status: 'resolved', created: '2 gün önce', category: 'Technical' },
];

export default function TicketsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Destek Talepleri</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">Müşteri destek ticket sistemi</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" />Yeni Ticket</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Açık</p>
                <p className="mt-1 text-2xl font-bold text-warning-600 dark:text-warning-400">2</p>
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
                <p className="mt-1 text-2xl font-bold text-primary-600 dark:text-primary-400">1</p>
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
                <p className="mt-1 text-2xl font-bold text-success-600 dark:text-success-400">1</p>
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
                <p className="mt-1 text-2xl font-bold text-danger-600 dark:text-danger-400">2</p>
              </div>
              <AlertCircle className="h-8 w-8 text-danger-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        {DEMO_TICKETS.map((ticket) => (
          <Card key={ticket.id} className="border-neutral-200 dark:border-neutral-700">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary-100 text-primary-600">{ticket.client.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{ticket.title}</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">{ticket.client}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">{ticket.category}</Badge>
                      <Badge className={ticket.priority === 'high' ? 'bg-danger-100 text-danger-700' : ticket.priority === 'medium' ? 'bg-warning-100 text-warning-700' : 'bg-neutral-100 text-neutral-700'}>
                        {ticket.priority === 'high' ? 'Yüksek' : ticket.priority === 'medium' ? 'Orta' : 'Düşük'}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-neutral-500">{ticket.created}</span>
                  <Badge className={ticket.status === 'resolved' ? 'bg-success-100 text-success-700' : ticket.status === 'in-progress' ? 'bg-primary-100 text-primary-700' : 'bg-warning-100 text-warning-700'}>
                    {ticket.status === 'resolved' ? 'Çözüldü' : ticket.status === 'in-progress' ? 'İşlemde' : 'Açık'}
                  </Badge>
                  <Button variant="outline" size="sm">Görüntüle</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
