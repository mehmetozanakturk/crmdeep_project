'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, Download, Eye } from 'lucide-react';

const DEMO_QUOTES = [
  { id: '1', number: 'QT-2024-001', client: 'TechCorp', amount: '₺45,000', status: 'sent', date: '2024-02-15' },
  { id: '2', number: 'QT-2024-002', client: 'GreenLife', amount: '₺32,500', status: 'accepted', date: '2024-02-14' },
  { id: '3', number: 'QT-2024-003', client: 'BlueSky', amount: '₺68,000', status: 'draft', date: '2024-02-13' },
];

export default function QuotesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Teklifler</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">Fiyat teklifleri ve öneriler</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" />Yeni Teklif</Button>
      </div>
      
      <div className="grid gap-4">
        {DEMO_QUOTES.map((quote) => (
          <Card key={quote.id} className="border-neutral-200 dark:border-neutral-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <FileText className="h-10 w-10 text-primary-600 dark:text-primary-400" />
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{quote.number}</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">{quote.client}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{quote.amount}</p>
                    <p className="text-xs text-neutral-500">{quote.date}</p>
                  </div>
                  <Badge className={quote.status === 'accepted' ? 'bg-success-100 text-success-700' : quote.status === 'sent' ? 'bg-warning-100 text-warning-700' : 'bg-neutral-100 text-neutral-700'}>
                    {quote.status === 'accepted' ? 'Kabul Edildi' : quote.status === 'sent' ? 'Gönderildi' : 'Taslak'}
                  </Badge>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon"><Eye className="h-4 w-4" /></Button>
                    <Button variant="outline" size="icon"><Download className="h-4 w-4" /></Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
