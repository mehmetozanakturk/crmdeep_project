'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, Mail, Send, Eye, MousePointerClick } from 'lucide-react';

const DEMO_CAMPAIGNS = [
  { id: '1', name: 'Bahar Kampanyası 2024', type: 'email', sent: 1250, opened: 542, clicked: 187, status: 'active' },
  { id: '2', name: 'Yeni Ürün Lansman', type: 'email', sent: 850, opened: 445, clicked: 156, status: 'completed' },
  { id: '3', name: 'Müşteri Anketi', type: 'sms', sent: 500, opened: 412, clicked: 98, status: 'active' },
];

export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Kampanyalar</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">E-posta ve SMS kampanyaları</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" />Yeni Kampanya</Button>
      </div>

      <div className="grid gap-4">
        {DEMO_CAMPAIGNS.map((campaign) => (
          <Card key={campaign.id} className="border-neutral-200 dark:border-neutral-700">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                    <div>
                      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{campaign.name}</h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Tip: {campaign.type.toUpperCase()}</p>
                    </div>
                  </div>
                  <Badge className={campaign.status === 'active' ? 'bg-success-100 text-success-700' : 'bg-neutral-100 text-neutral-700'}>
                    {campaign.status === 'active' ? 'Aktif' : 'Tamamlandı'}
                  </Badge>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <Send className="mx-auto h-5 w-5 text-neutral-500 mb-1" />
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{campaign.sent}</p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">Gönderildi</p>
                  </div>
                  <div className="text-center">
                    <Eye className="mx-auto h-5 w-5 text-neutral-500 mb-1" />
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{campaign.opened}</p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">Açıldı</p>
                  </div>
                  <div className="text-center">
                    <MousePointerClick className="mx-auto h-5 w-5 text-neutral-500 mb-1" />
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{campaign.clicked}</p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">Tıklandı</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-success-600 dark:text-success-400">{Math.round((campaign.clicked / campaign.sent) * 100)}%</p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">Dönüşüm</p>
                  </div>
                </div>
                <Progress value={(campaign.opened / campaign.sent) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
