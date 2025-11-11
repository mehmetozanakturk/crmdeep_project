'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, List, Users, Mail } from 'lucide-react';

const DEMO_LISTS = [
  { id: '1', name: 'Potansiyel Müşteriler', count: 245, type: 'leads', lastUpdated: '2 saat önce' },
  { id: '2', name: 'VIP Müşteriler', count: 42, type: 'customers', lastUpdated: '1 gün önce' },
  { id: '3', name: 'Email Kampanya - Q1', count: 1200, type: 'campaign', lastUpdated: '3 gün önce' },
  { id: '4', name: 'Event Katılımcıları', count: 87, type: 'event', lastUpdated: '1 hafta önce' },
];

export default function ListsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Listeler</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">Pazarlama segmentleri ve kişi listeleri</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" />Yeni Liste</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {DEMO_LISTS.map((list) => (
          <Card key={list.id} className="border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className="rounded-lg bg-primary-100 dark:bg-primary-900/30 p-3">
                    <List className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{list.name}</h3>
                    <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">Son güncelleme: {list.lastUpdated}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {list.count} kişi
                      </Badge>
                      <Badge variant="outline">{list.type}</Badge>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm"><Mail className="mr-1 h-3 w-3" />Email Gönder</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
