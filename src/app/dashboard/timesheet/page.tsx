'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, Play, Pause } from 'lucide-react';

const DEMO_ENTRIES = [
  { project: 'Web Sitesi Yenileme', task: 'Landing Page Design', hours: 4.5, date: '2024-02-15', status: 'completed' },
  { project: 'Mobil Uygulama', task: 'API Integration', hours: 6, date: '2024-02-15', status: 'completed' },
  { project: 'Sosyal Medya', task: 'Content Creation', hours: 2, date: '2024-02-14', status: 'completed' },
];

export default function TimesheetPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Zaman Çizelgesi</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">Harcanan zaman takibi</p>
        </div>
        <Button className="bg-success-600 hover:bg-success-700"><Play className="mr-2 h-4 w-4" />Zamanlayıcıyı Başlat</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Bu Hafta</p>
                <p className="mt-1 text-3xl font-bold text-neutral-900 dark:text-neutral-100">32.5 saat</p>
              </div>
              <Clock className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Bu Ay</p>
                <p className="mt-1 text-3xl font-bold text-neutral-900 dark:text-neutral-100">142 saat</p>
              </div>
              <Calendar className="h-8 w-8 text-success-600 dark:text-success-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Faturalanabilir</p>
                <p className="mt-1 text-3xl font-bold text-success-600 dark:text-success-400">85%</p>
              </div>
              <Clock className="h-8 w-8 text-success-600 dark:text-success-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-neutral-200 dark:border-neutral-700">
        <CardContent className="pt-6">
          <div className="space-y-4">
            {DEMO_ENTRIES.map((entry, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4 last:border-0 last:pb-0">
                <div>
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{entry.task}</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">{entry.project}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-neutral-500">{entry.date}</span>
                  <Badge variant="secondary">{entry.hours} saat</Badge>
                  <Badge className="bg-success-100 text-success-700">Tamamlandı</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
