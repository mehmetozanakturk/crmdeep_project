'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, BarChart3, Download, Calendar, TrendingUp, Clock } from 'lucide-react';

const DEMO_REPORTS = [
  { id: '1', name: 'Aylık Satış Raporu', type: 'Sales', period: 'Şubat 2024', generated: '2 gün önce', status: 'ready' },
  { id: '2', name: 'Müşteri Analizi', type: 'Customers', period: 'Q1 2024', generated: '5 gün önce', status: 'ready' },
  { id: '3', name: 'Proje Performansı', type: 'Projects', period: 'Ocak 2024', generated: '1 hafta önce', status: 'ready' },
  { id: '4', name: 'Ekip Verimliliği', type: 'Team', period: 'Şubat 2024', generated: 'Oluşturuluyor...', status: 'processing' },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Raporlar</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">Detaylı analiz ve raporlama</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" />Yeni Rapor</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Toplam Rapor</p>
                <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-neutral-100">24</p>
              </div>
              <BarChart3 className="h-8 w-8 text-primary-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Bu Ay</p>
                <p className="mt-1 text-2xl font-bold text-success-600 dark:text-success-400">4</p>
              </div>
              <Calendar className="h-8 w-8 text-success-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Zamanlanmış</p>
                <p className="mt-1 text-2xl font-bold text-primary-600 dark:text-primary-400">8</p>
              </div>
              <Clock className="h-8 w-8 text-primary-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Trend</p>
                <p className="mt-1 text-2xl font-bold text-success-600 dark:text-success-400">+18%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {DEMO_REPORTS.map((report) => (
          <Card key={report.id} className="border-neutral-200 dark:border-neutral-700">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="rounded-lg bg-primary-100 dark:bg-primary-900/30 p-3 h-fit">
                    <BarChart3 className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{report.name}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">{report.type}</Badge>
                      <Badge variant="outline">{report.period}</Badge>
                    </div>
                    <p className="text-sm text-neutral-500 mt-2">{report.generated}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {report.status === 'ready' ? (
                    <>
                      <Button variant="outline" size="sm">Görüntüle</Button>
                      <Button variant="outline" size="icon"><Download className="h-4 w-4" /></Button>
                    </>
                  ) : (
                    <Badge className="bg-warning-100 text-warning-700">İşleniyor</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
