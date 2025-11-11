'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, Download, DollarSign, Clock, CheckCircle2 } from 'lucide-react';

const DEMO_INVOICES = [
  { id: '1', number: 'INV-2024-001', client: 'TechCorp', amount: '₺45,000', status: 'paid', dueDate: '2024-02-10', paidDate: '2024-02-08' },
  { id: '2', number: 'INV-2024-002', client: 'GreenLife', amount: '₺32,500', status: 'pending', dueDate: '2024-02-20', paidDate: null },
  { id: '3', number: 'INV-2024-003', client: 'BlueSky', amount: '₺68,000', status: 'overdue', dueDate: '2024-02-05', paidDate: null },
  { id: '4', number: 'INV-2024-004', client: 'StyleHub', amount: '₺24,500', status: 'draft', dueDate: '2024-02-25', paidDate: null },
];

export default function InvoicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Faturalar</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">Faturalama ve ödeme takibi</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" />Yeni Fatura</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Toplam</p>
                <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-neutral-100">₺170K</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Ödendi</p>
                <p className="mt-1 text-2xl font-bold text-success-600 dark:text-success-400">₺45K</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-success-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Bekliyor</p>
                <p className="mt-1 text-2xl font-bold text-warning-600 dark:text-warning-400">₺57K</p>
              </div>
              <Clock className="h-8 w-8 text-warning-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Gecikmiş</p>
                <p className="mt-1 text-2xl font-bold text-danger-600 dark:text-danger-400">₺68K</p>
              </div>
              <Clock className="h-8 w-8 text-danger-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        {DEMO_INVOICES.map((invoice) => (
          <Card key={invoice.id} className="border-neutral-200 dark:border-neutral-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <FileText className="h-10 w-10 text-primary-600 dark:text-primary-400" />
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{invoice.number}</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">{invoice.client}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{invoice.amount}</p>
                    <p className="text-xs text-neutral-500">Vade: {invoice.dueDate}</p>
                  </div>
                  <Badge className={
                    invoice.status === 'paid' ? 'bg-success-100 text-success-700' :
                    invoice.status === 'pending' ? 'bg-warning-100 text-warning-700' :
                    invoice.status === 'overdue' ? 'bg-danger-100 text-danger-700' :
                    'bg-neutral-100 text-neutral-700'
                  }>
                    {invoice.status === 'paid' ? 'Ödendi' : invoice.status === 'pending' ? 'Bekliyor' : invoice.status === 'overdue' ? 'Gecikmiş' : 'Taslak'}
                  </Badge>
                  <Button variant="outline" size="icon"><Download className="h-4 w-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
