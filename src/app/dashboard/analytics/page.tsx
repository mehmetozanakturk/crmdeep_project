'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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
  Eye,
  MousePointer,
  ShoppingCart,
  BarChart3,
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

// Platform Analytics Data
const META_ANALYTICS = {
  impressions: 145820,
  reach: 98540,
  clicks: 4234,
  ctr: 2.9,
  conversions: 187,
  spend: 12450,
  cpc: 2.94,
  cpm: 85.4,
  roas: 4.2,
};

const GOOGLE_ANALYTICS = {
  impressions: 234560,
  clicks: 8932,
  ctr: 3.8,
  conversions: 312,
  spend: 18750,
  cpc: 2.1,
  conversionRate: 3.5,
  avgPosition: 2.4,
  qualityScore: 8.2,
};

const AMAZON_ANALYTICS = {
  sales: 45680,
  orders: 892,
  units: 1543,
  avgOrderValue: 51.2,
  acos: 18.5,
  roas: 5.4,
  impressions: 189340,
  clicks: 5234,
  conversionRate: 17.0,
};

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

      {/* Platform Analytics Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Platform Analitiği</h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">Büyük platformlardaki performansınız</p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-4 bg-neutral-100 dark:bg-neutral-800">
            <TabsTrigger value="all" className="data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-900">
              Tümü
            </TabsTrigger>
            <TabsTrigger value="meta" className="data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-900">
              Meta Ads
            </TabsTrigger>
            <TabsTrigger value="google" className="data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-900">
              Google Ads
            </TabsTrigger>
            <TabsTrigger value="amazon" className="data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-900">
              Amazon
            </TabsTrigger>
          </TabsList>

          {/* All Platforms */}
          <TabsContent value="all" className="space-y-6">
            {/* Meta (Facebook & Instagram) Analytics */}
            <Card className="border-neutral-200 dark:border-neutral-700 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 p-2">
                    <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <div>
                    <CardTitle className="text-neutral-900 dark:text-neutral-100">Meta Ads (Facebook & Instagram)</CardTitle>
                    <CardDescription className="text-neutral-600 dark:text-neutral-400">
                      Sosyal medya kampanya performansı
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Gösterimler</p>
                    </div>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{META_ANALYTICS.impressions.toLocaleString()}</p>
                    <p className="text-xs text-neutral-500">Erişim: {META_ANALYTICS.reach.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <MousePointer className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Tıklamalar</p>
                    </div>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{META_ANALYTICS.clicks.toLocaleString()}</p>
                    <p className="text-xs text-neutral-500">CTR: {META_ANALYTICS.ctr}%</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Dönüşümler</p>
                    </div>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{META_ANALYTICS.conversions}</p>
                    <p className="text-xs text-neutral-500">ROAS: {META_ANALYTICS.roas}x</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Harcama</p>
                    </div>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">₺{META_ANALYTICS.spend.toLocaleString()}</p>
                    <p className="text-xs text-neutral-500">CPC: ₺{META_ANALYTICS.cpc} | CPM: ₺{META_ANALYTICS.cpm}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Google Ads Analytics */}
            <Card className="border-neutral-200 dark:border-neutral-700 bg-gradient-to-br from-red-50 to-yellow-50 dark:from-red-950/20 dark:to-yellow-950/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-gradient-to-br from-red-500 via-yellow-500 to-green-500 p-2">
                    <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
                    </svg>
                  </div>
                  <div>
                    <CardTitle className="text-neutral-900 dark:text-neutral-100">Google Ads</CardTitle>
                    <CardDescription className="text-neutral-600 dark:text-neutral-400">
                      Arama ve display reklam performansı
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-red-600 dark:text-red-400" />
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Gösterimler</p>
                    </div>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{GOOGLE_ANALYTICS.impressions.toLocaleString()}</p>
                    <p className="text-xs text-neutral-500">Ort. Konum: {GOOGLE_ANALYTICS.avgPosition}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <MousePointer className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Tıklamalar</p>
                    </div>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{GOOGLE_ANALYTICS.clicks.toLocaleString()}</p>
                    <p className="text-xs text-neutral-500">CTR: {GOOGLE_ANALYTICS.ctr}%</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Dönüşümler</p>
                    </div>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{GOOGLE_ANALYTICS.conversions}</p>
                    <p className="text-xs text-neutral-500">Oran: {GOOGLE_ANALYTICS.conversionRate}% | Kalite: {GOOGLE_ANALYTICS.qualityScore}/10</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Harcama</p>
                    </div>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">₺{GOOGLE_ANALYTICS.spend.toLocaleString()}</p>
                    <p className="text-xs text-neutral-500">CPC: ₺{GOOGLE_ANALYTICS.cpc}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Amazon Analytics */}
            <Card className="border-neutral-200 dark:border-neutral-700 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 p-2">
                    <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.138-.06.234-.1.293-.13.226-.088.39-.046.525.13.12.174.09.336-.12.48-.256.19-.6.41-1.006.654-1.244.743-2.64 1.316-4.185 1.726-1.53.406-3.045.61-4.516.61-2.265 0-4.446-.433-6.543-1.297-2.096-.865-3.87-2.098-5.323-3.7-.184-.203-.226-.36-.11-.525zm3.533-4.836c-.138.116-.3.088-.48-.09l-.12-.12c-.184-.184-.226-.375-.135-.585.16-.315.45-.57.87-.78.42-.21.87-.315 1.35-.315.51 0 .975.12 1.394.36.42.24.615.57.615.99 0 .36-.12.66-.36.87-.24.225-.54.336-.87.336-.48 0-.84-.18-1.08-.54l-.015-.03c-.044-.06-.074-.074-.09-.03l-.045.09c-.03.09-.074.18-.135.27zm8.055 0c-.135.116-.3.088-.48-.09l-.12-.12c-.184-.184-.226-.375-.135-.585.16-.315.45-.57.87-.78.42-.21.87-.315 1.35-.315.51 0 .975.12 1.394.36.42.24.615.57.615.99 0 .36-.12.66-.36.87-.24.225-.54.336-.87.336-.48 0-.84-.18-1.08-.54l-.015-.03c-.044-.06-.074-.074-.09-.03l-.045.09c-.03.09-.074.18-.135.27z"/>
                    </svg>
                  </div>
                  <div>
                    <CardTitle className="text-neutral-900 dark:text-neutral-100">Amazon</CardTitle>
                    <CardDescription className="text-neutral-600 dark:text-neutral-400">
                      E-ticaret ve marketplace performansı
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Satışlar</p>
                    </div>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">₺{AMAZON_ANALYTICS.sales.toLocaleString()}</p>
                    <p className="text-xs text-neutral-500">{AMAZON_ANALYTICS.orders} sipariş | {AMAZON_ANALYTICS.units} ürün</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Ort. Sepet</p>
                    </div>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">₺{AMAZON_ANALYTICS.avgOrderValue}</p>
                    <p className="text-xs text-neutral-500">Dönüşüm: {AMAZON_ANALYTICS.conversionRate}%</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">ACOS</p>
                    </div>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{AMAZON_ANALYTICS.acos}%</p>
                    <p className="text-xs text-neutral-500">ROAS: {AMAZON_ANALYTICS.roas}x</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Görüntülenmeler</p>
                    </div>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{AMAZON_ANALYTICS.impressions.toLocaleString()}</p>
                    <p className="text-xs text-neutral-500">{AMAZON_ANALYTICS.clicks.toLocaleString()} tıklama</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Meta Ads Only */}
          <TabsContent value="meta" className="space-y-6">
            <Card className="border-neutral-200 dark:border-neutral-700 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 p-2">
                    <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <div>
                    <CardTitle className="text-neutral-900 dark:text-neutral-100">Meta Ads (Facebook & Instagram)</CardTitle>
                    <CardDescription className="text-neutral-600 dark:text-neutral-400">
                      Sosyal medya kampanya performansı
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Gösterimler</p>
                    </div>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{META_ANALYTICS.impressions.toLocaleString()}</p>
                    <p className="text-xs text-neutral-500">Erişim: {META_ANALYTICS.reach.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <MousePointer className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Tıklamalar</p>
                    </div>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{META_ANALYTICS.clicks.toLocaleString()}</p>
                    <p className="text-xs text-neutral-500">CTR: {META_ANALYTICS.ctr}%</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Dönüşümler</p>
                    </div>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{META_ANALYTICS.conversions}</p>
                    <p className="text-xs text-neutral-500">ROAS: {META_ANALYTICS.roas}x</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Harcama</p>
                    </div>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">₺{META_ANALYTICS.spend.toLocaleString()}</p>
                    <p className="text-xs text-neutral-500">CPC: ₺{META_ANALYTICS.cpc} | CPM: ₺{META_ANALYTICS.cpm}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Google Ads Only */}
          <TabsContent value="google" className="space-y-6">
            <Card className="border-neutral-200 dark:border-neutral-700 bg-gradient-to-br from-red-50 to-yellow-50 dark:from-red-950/20 dark:to-yellow-950/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-gradient-to-br from-red-500 via-yellow-500 to-green-500 p-2">
                    <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
                    </svg>
                  </div>
                  <div>
                    <CardTitle className="text-neutral-900 dark:text-neutral-100">Google Ads</CardTitle>
                    <CardDescription className="text-neutral-600 dark:text-neutral-400">
                      Arama ve display reklam performansı
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-red-600 dark:text-red-400" />
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Gösterimler</p>
                    </div>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{GOOGLE_ANALYTICS.impressions.toLocaleString()}</p>
                    <p className="text-xs text-neutral-500">Ort. Konum: {GOOGLE_ANALYTICS.avgPosition}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <MousePointer className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Tıklamalar</p>
                    </div>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{GOOGLE_ANALYTICS.clicks.toLocaleString()}</p>
                    <p className="text-xs text-neutral-500">CTR: {GOOGLE_ANALYTICS.ctr}%</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Dönüşümler</p>
                    </div>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{GOOGLE_ANALYTICS.conversions}</p>
                    <p className="text-xs text-neutral-500">Oran: {GOOGLE_ANALYTICS.conversionRate}% | Kalite: {GOOGLE_ANALYTICS.qualityScore}/10</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Harcama</p>
                    </div>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">₺{GOOGLE_ANALYTICS.spend.toLocaleString()}</p>
                    <p className="text-xs text-neutral-500">CPC: ₺{GOOGLE_ANALYTICS.cpc}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Amazon Only */}
          <TabsContent value="amazon" className="space-y-6">
            <Card className="border-neutral-200 dark:border-neutral-700 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 p-2">
                    <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.138-.06.234-.1.293-.13.226-.088.39-.046.525.13.12.174.09.336-.12.48-.256.19-.6.41-1.006.654-1.244.743-2.64 1.316-4.185 1.726-1.53.406-3.045.61-4.516.61-2.265 0-4.446-.433-6.543-1.297-2.096-.865-3.87-2.098-5.323-3.7-.184-.203-.226-.36-.11-.525zm3.533-4.836c-.138.116-.3.088-.48-.09l-.12-.12c-.184-.184-.226-.375-.135-.585.16-.315.45-.57.87-.78.42-.21.87-.315 1.35-.315.51 0 .975.12 1.394.36.42.24.615.57.615.99 0 .36-.12.66-.36.87-.24.225-.54.336-.87.336-.48 0-.84-.18-1.08-.54l-.015-.03c-.044-.06-.074-.074-.09-.03l-.045.09c-.03.09-.074.18-.135.27zm8.055 0c-.135.116-.3.088-.48-.09l-.12-.12c-.184-.184-.226-.375-.135-.585.16-.315.45-.57.87-.78.42-.21.87-.315 1.35-.315.51 0 .975.12 1.394.36.42.24.615.57.615.99 0 .36-.12.66-.36.87-.24.225-.54.336-.87.336-.48 0-.84-.18-1.08-.54l-.015-.03c-.044-.06-.074-.074-.09-.03l-.045.09c-.03.09-.074.18-.135.27z"/>
                    </svg>
                  </div>
                  <div>
                    <CardTitle className="text-neutral-900 dark:text-neutral-100">Amazon</CardTitle>
                    <CardDescription className="text-neutral-600 dark:text-neutral-400">
                      E-ticaret ve marketplace performansı
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Satışlar</p>
                    </div>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">₺{AMAZON_ANALYTICS.sales.toLocaleString()}</p>
                    <p className="text-xs text-neutral-500">{AMAZON_ANALYTICS.orders} sipariş | {AMAZON_ANALYTICS.units} ürün</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Ort. Sepet</p>
                    </div>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">₺{AMAZON_ANALYTICS.avgOrderValue}</p>
                    <p className="text-xs text-neutral-500">Dönüşüm: {AMAZON_ANALYTICS.conversionRate}%</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">ACOS</p>
                    </div>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{AMAZON_ANALYTICS.acos}%</p>
                    <p className="text-xs text-neutral-500">ROAS: {AMAZON_ANALYTICS.roas}x</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Görüntülenmeler</p>
                    </div>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{AMAZON_ANALYTICS.impressions.toLocaleString()}</p>
                    <p className="text-xs text-neutral-500">{AMAZON_ANALYTICS.clicks.toLocaleString()} tıklama</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
