'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, CreditCard, TrendingUp, Users, DollarSign } from 'lucide-react';

const DEMO_SUBSCRIPTIONS = [
  { id: '1', client: 'TechCorp Premium', plan: 'Enterprise', amount: '₺2,500', billing: 'Aylık', status: 'active', nextBilling: '2024-03-15' },
  { id: '2', client: 'GreenLife Basic', plan: 'Professional', amount: '₺999', billing: 'Aylık', status: 'active', nextBilling: '2024-03-10' },
  { id: '3', client: 'BlueSky Hosting', plan: 'Business', amount: '₺1,499', billing: 'Aylık', status: 'active', nextBilling: '2024-03-20' },
  { id: '4', client: 'StyleHub Suite', plan: 'Starter', amount: '₺499', billing: 'Aylık', status: 'cancelled', nextBilling: null },
];

export default function SubscriptionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Abonelikler</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">Yinelenen gelir yönetimi</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" />Yeni Abonelik</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Aylık Gelir</p>
                <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-neutral-100">₺4,998</p>
              </div>
              <DollarSign className="h-8 w-8 text-success-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Aktif</p>
                <p className="mt-1 text-2xl font-bold text-success-600 dark:text-success-400">3</p>
              </div>
              <Users className="h-8 w-8 text-success-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Büyüme</p>
                <p className="mt-1 text-2xl font-bold text-primary-600 dark:text-primary-400">+15%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Churn Rate</p>
                <p className="mt-1 text-2xl font-bold text-warning-600 dark:text-warning-400">5%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-warning-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        {DEMO_SUBSCRIPTIONS.map((sub) => (
          <Card key={sub.id} className="border-neutral-200 dark:border-neutral-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <CreditCard className="h-10 w-10 text-primary-600 dark:text-primary-400" />
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{sub.client}</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Plan: {sub.plan}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{sub.amount}</p>
                    <p className="text-xs text-neutral-500">{sub.billing}</p>
                  </div>
                  <div className="text-right">
                    <Badge className={sub.status === 'active' ? 'bg-success-100 text-success-700 mb-1' : 'bg-neutral-100 text-neutral-700 mb-1'}>
                      {sub.status === 'active' ? 'Aktif' : 'İptal Edildi'}
                    </Badge>
                    {sub.nextBilling && <p className="text-xs text-neutral-500">Sonraki: {sub.nextBilling}</p>}
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
