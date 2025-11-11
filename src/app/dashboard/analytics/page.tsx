'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Target,
  Mail,
  Phone,
  Calendar,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

const REVENUE_DATA = [
  { month: 'Oca', value: 45, label: '₺45K' },
  { month: 'Şub', value: 52, label: '₺52K' },
  { month: 'Mar', value: 48, label: '₺48K' },
  { month: 'Nis', value: 61, label: '₺61K' },
  { month: 'May', value: 55, label: '₺55K' },
  { month: 'Haz', value: 67, label: '₺67K' },
];

const DEALS_DATA = [
  { stage: 'Lead', count: 24, color: 'bg-neutral-500 dark:bg-neutral-600' },
  { stage: 'Qualified', count: 18, color: 'bg-primary-500 dark:bg-primary-600' },
  { stage: 'Proposal', count: 12, color: 'bg-warning-500 dark:bg-warning-600' },
  { stage: 'Negotiation', count: 8, color: 'bg-success-500 dark:bg-success-600' },
  { stage: 'Closed', count: 15, color: 'bg-success-600 dark:bg-success-700' },
];

const TEAM_PERFORMANCE = [
  { name: 'Ahmet Y.', deals: 12, revenue: '₺85K', growth: 23, avatar: 'AY', color: '#3B82F6' },
  { name: 'Zeynep K.', deals: 10, revenue: '₺72K', growth: 18, avatar: 'ZK', color: '#10B981' },
  { name: 'Mehmet S.', deals: 8, revenue: '₺65K', growth: -5, avatar: 'MS', color: '#8B5CF6' },
  { name: 'Ayşe D.', deals: 9, revenue: '₺68K', growth: 12, avatar: 'AD', color: '#EC4899' },
];

const RECENT_ACTIVITIES = [
  { type: 'deal', title: 'Yeni anlaşma eklendi', detail: 'TechCorp - ₺50K', time: '2 saat önce' },
  { type: 'contact', title: 'Yeni müşteri kaydı', detail: 'Ahmet Yılmaz', time: '3 saat önce' },
  { type: 'email', title: 'Email kampanyası gönderildi', detail: '250 alıcı', time: '5 saat önce' },
  { type: 'meeting', title: 'Toplantı tamamlandı', detail: 'GreenLife stratejisi', time: '1 gün önce' },
];

export default function AnalyticsPage() {
  const maxRevenue = Math.max(...REVENUE_DATA.map((d) => d.value));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Analitik</h1>
        <p className="mt-1 text-neutral-600 dark:text-neutral-400">
          İş performansınızı detaylı analiz edin
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Toplam Gelir</p>
                <p className="mt-1 text-3xl font-bold text-neutral-900 dark:text-neutral-100">₺328K</p>
                <div className="mt-1 flex items-center gap-1 text-xs text-success-600 dark:text-success-400">
                  <ArrowUp className="h-3 w-3" />
                  <span>+12.5%</span>
                </div>
              </div>
              <div className="rounded-lg bg-success-100 dark:bg-success-900/30 p-3">
                <DollarSign className="h-6 w-6 text-success-600 dark:text-success-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Aktif Anlaşma</p>
                <p className="mt-1 text-3xl font-bold text-neutral-900 dark:text-neutral-100">62</p>
                <div className="mt-1 flex items-center gap-1 text-xs text-success-600 dark:text-success-400">
                  <ArrowUp className="h-3 w-3" />
                  <span>+8.2%</span>
                </div>
              </div>
              <div className="rounded-lg bg-primary-100 dark:bg-primary-900/30 p-3">
                <Target className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Yeni Müşteri</p>
                <p className="mt-1 text-3xl font-bold text-neutral-900 dark:text-neutral-100">184</p>
                <div className="mt-1 flex items-center gap-1 text-xs text-success-600 dark:text-success-400">
                  <ArrowUp className="h-3 w-3" />
                  <span>+15.3%</span>
                </div>
              </div>
              <div className="rounded-lg bg-primary-100 dark:bg-primary-900/30 p-3">
                <Users className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Dönüşüm Oranı</p>
                <p className="mt-1 text-3xl font-bold text-neutral-900 dark:text-neutral-100">24.3%</p>
                <div className="mt-1 flex items-center gap-1 text-xs text-danger-600 dark:text-danger-400">
                  <ArrowDown className="h-3 w-3" />
                  <span>-2.1%</span>
                </div>
              </div>
              <div className="rounded-lg bg-warning-100 dark:bg-warning-900/30 p-3">
                <TrendingUp className="h-6 w-6 text-warning-600 dark:text-warning-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardHeader>
            <CardTitle className="text-neutral-900 dark:text-neutral-100">Aylık Gelir Trendi</CardTitle>
            <CardDescription className="text-neutral-600 dark:text-neutral-400">
              Son 6 aylık gelir performansı
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Simple Bar Chart */}
              <div className="flex items-end justify-between gap-2 h-48">
                {REVENUE_DATA.map((item, idx) => (
                  <div key={idx} className="flex flex-1 flex-col items-center gap-2">
                    <div className="w-full flex flex-col justify-end h-40">
                      <div
                        className="w-full bg-primary-500 dark:bg-primary-600 rounded-t-md transition-all hover:bg-primary-600 dark:hover:bg-primary-500 relative group"
                        style={{ height: `${(item.value / maxRevenue) * 100}%` }}
                      >
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                            {item.label}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-neutral-600 dark:text-neutral-400">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sales Pipeline */}
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardHeader>
            <CardTitle className="text-neutral-900 dark:text-neutral-100">Satış Hunisi</CardTitle>
            <CardDescription className="text-neutral-600 dark:text-neutral-400">
              Anlaşma aşamalarına göre dağılım
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {DEALS_DATA.map((item, idx) => {
                const total = DEALS_DATA.reduce((sum, d) => sum + d.count, 0);
                const percentage = Math.round((item.count / total) * 100);

                return (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-neutral-900 dark:text-neutral-100">{item.stage}</span>
                      <span className="text-neutral-600 dark:text-neutral-400">
                        {item.count} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-neutral-100 dark:bg-neutral-800">
                      <div
                        className={`h-2 rounded-full ${item.color} transition-all`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Team Performance */}
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardHeader>
            <CardTitle className="text-neutral-900 dark:text-neutral-100">Ekip Performansı</CardTitle>
            <CardDescription className="text-neutral-600 dark:text-neutral-400">
              Bu ayki en iyi performans gösterenler
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {TEAM_PERFORMANCE.map((member, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg border border-neutral-200 dark:border-neutral-700 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold"
                      style={{ backgroundColor: member.color + '20', color: member.color }}
                    >
                      {member.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900 dark:text-neutral-100">{member.name}</p>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">
                        {member.deals} anlaşma
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100">{member.revenue}</p>
                    <div
                      className={`flex items-center gap-1 text-xs ${
                        member.growth >= 0
                          ? 'text-success-600 dark:text-success-400'
                          : 'text-danger-600 dark:text-danger-400'
                      }`}
                    >
                      {member.growth >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      <span>{Math.abs(member.growth)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardHeader>
            <CardTitle className="text-neutral-900 dark:text-neutral-100">Son Aktiviteler</CardTitle>
            <CardDescription className="text-neutral-600 dark:text-neutral-400">
              Sistemdeki son hareketler
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {RECENT_ACTIVITIES.map((activity, idx) => {
                const getIcon = () => {
                  switch (activity.type) {
                    case 'deal':
                      return <Target className="h-4 w-4" />;
                    case 'contact':
                      return <Users className="h-4 w-4" />;
                    case 'email':
                      return <Mail className="h-4 w-4" />;
                    case 'meeting':
                      return <Calendar className="h-4 w-4" />;
                  }
                };

                const getColor = () => {
                  switch (activity.type) {
                    case 'deal':
                      return 'bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400';
                    case 'contact':
                      return 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400';
                    case 'email':
                      return 'bg-warning-100 text-warning-600 dark:bg-warning-900/30 dark:text-warning-400';
                    case 'meeting':
                      return 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400';
                  }
                };

                return (
                  <div key={idx} className="flex items-start gap-3">
                    <div className={`rounded-lg p-2 ${getColor()}`}>{getIcon()}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        {activity.title}
                      </p>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">{activity.detail}</p>
                    </div>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">{activity.time}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-primary-100 dark:bg-primary-900/30 p-3">
                <Mail className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Email Açılma Oranı</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">42.5%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-success-100 dark:bg-success-900/30 p-3">
                <Phone className="h-5 w-5 text-success-600 dark:text-success-400" />
              </div>
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Arama Bağlantı Oranı</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">68.3%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-warning-100 dark:bg-warning-900/30 p-3">
                <Calendar className="h-5 w-5 text-warning-600 dark:text-warning-400" />
              </div>
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Toplantı Tamamlama</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">91.2%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
