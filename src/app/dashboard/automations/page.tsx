'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Workflow, Zap, Clock, CheckCircle2 } from 'lucide-react';

const DEMO_AUTOMATIONS = [
  { id: '1', name: 'Yeni Lead Hoşgeldin Emaili', trigger: 'Lead oluşturulduğunda', status: 'active', runs: 142 },
  { id: '2', name: 'Fatura Ödeme Hatırlatıcı', trigger: 'Vade tarihinden 3 gün önce', status: 'active', runs: 89 },
  { id: '3', name: 'Proje Tamamlama Bildirimi', trigger: 'Proje %100 tamamlandığında', status: 'active', runs: 24 },
  { id: '4', name: 'İnaktif Müşteri Takibi', trigger: '30 gün aktivite olmazsa', status: 'paused', runs: 15 },
];

export default function AutomationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Otomasyonlar</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">İş akışlarını otomatikleştirin</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" />Yeni Otomasyon</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Aktif</p>
                <p className="mt-1 text-2xl font-bold text-success-600 dark:text-success-400">3</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-success-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Duraklatılmış</p>
                <p className="mt-1 text-2xl font-bold text-warning-600 dark:text-warning-400">1</p>
              </div>
              <Clock className="h-8 w-8 text-warning-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Bu Ay Çalıştı</p>
                <p className="mt-1 text-2xl font-bold text-primary-600 dark:text-primary-400">270</p>
              </div>
              <Zap className="h-8 w-8 text-primary-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Başarı Oranı</p>
                <p className="mt-1 text-2xl font-bold text-success-600 dark:text-success-400">98%</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-success-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        {DEMO_AUTOMATIONS.map((automation) => (
          <Card key={automation.id} className="border-neutral-200 dark:border-neutral-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-primary-100 dark:bg-primary-900/30 p-3">
                    <Workflow className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{automation.name}</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                      <span className="font-medium">Tetikleyici:</span> {automation.trigger}
                    </p>
                    <p className="text-sm text-neutral-500 mt-1">{automation.runs} kez çalıştı</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={automation.status === 'active' ? 'bg-success-100 text-success-700' : 'bg-warning-100 text-warning-700'}>
                    {automation.status === 'active' ? 'Aktif' : 'Duraklatıldı'}
                  </Badge>
                  <Button variant="outline" size="sm">Düzenle</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
