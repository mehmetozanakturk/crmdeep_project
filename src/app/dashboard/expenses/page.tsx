'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Receipt, TrendingDown, Calendar } from 'lucide-react';

const DEMO_EXPENSES = [
  { id: '1', title: 'Ofis Malzemeleri', category: 'Office', amount: '₺2,450', date: '2024-02-15', status: 'approved' },
  { id: '2', title: 'Yazılım Lisansı', category: 'Software', amount: '₺5,800', date: '2024-02-14', status: 'pending' },
  { id: '3', title: 'Müşteri Yemeği', category: 'Meals', amount: '₺850', date: '2024-02-13', status: 'approved' },
  { id: '4', title: 'Pazarlama Materyali', category: 'Marketing', amount: '₺3,200', date: '2024-02-12', status: 'rejected' },
];

export default function ExpensesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Harcamalar</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">Masraf yönetimi ve onayları</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" />Harcama Ekle</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Bu Ay</p>
                <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-neutral-100">₺12,300</p>
              </div>
              <TrendingDown className="h-8 w-8 text-danger-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Onay Bekliyor</p>
                <p className="mt-1 text-2xl font-bold text-warning-600 dark:text-warning-400">1</p>
              </div>
              <Calendar className="h-8 w-8 text-warning-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Onaylandı</p>
                <p className="mt-1 text-2xl font-bold text-success-600 dark:text-success-400">₺8,100</p>
              </div>
              <Receipt className="h-8 w-8 text-success-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        {DEMO_EXPENSES.map((expense) => (
          <Card key={expense.id} className="border-neutral-200 dark:border-neutral-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Receipt className="h-10 w-10 text-neutral-600 dark:text-neutral-400" />
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{expense.title}</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Kategori: {expense.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{expense.amount}</p>
                    <p className="text-xs text-neutral-500">{expense.date}</p>
                  </div>
                  <Badge className={
                    expense.status === 'approved' ? 'bg-success-100 text-success-700' :
                    expense.status === 'pending' ? 'bg-warning-100 text-warning-700' :
                    'bg-danger-100 text-danger-700'
                  }>
                    {expense.status === 'approved' ? 'Onaylandı' : expense.status === 'pending' ? 'Bekliyor' : 'Reddedildi'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
