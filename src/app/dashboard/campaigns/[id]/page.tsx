'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Eye,
  MousePointerClick,
  Zap,
  Target,
  Calendar,
  Play,
  Pause,
  Settings,
  Download,
  Share2,
  Loader2,
  Users,
  MapPin,
  Clock,
  Activity,
  PieChart as PieChartIcon,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart as RechartsPie,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getActiveWorkspaceId } from '@/lib/workspace-storage';
import * as CampaignsAPI from '@/lib/api/campaigns';

const COLORS = {
  meta: '#1877F2',
  google: '#4285F4',
  linkedin: '#0A66C2',
  twitter: '#1DA1F2',
  primary: '#3B82F6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
};

const CHART_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7');

  useEffect(() => {
    loadCampaignData();
  }, [params.id]);

  const loadCampaignData = async () => {
    try {
      setLoading(true);
      const workspaceId = getActiveWorkspaceId();
      if (!workspaceId) {
        console.warn('No active workspace');
        setLoading(false);
        return;
      }

      const data = await CampaignsAPI.getCampaign(params.id as string);
      setCampaign(data);
    } catch (error) {
      console.error('Error loading campaign:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary-600 dark:text-primary-400" />
          <h3 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Kampanya yükleniyor...
          </h3>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Target className="mx-auto h-12 w-12 text-neutral-400" />
          <h3 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Kampanya bulunamadı
          </h3>
          <Button onClick={() => router.push('/dashboard/campaigns')} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kampanyalara Dön
          </Button>
        </div>
      </div>
    );
  }

  // Calculate metrics
  const impressions = campaign.impressions || 0;
  const clicks = campaign.clicks || 0;
  const conversions = campaign.conversions || 0;
  const spent = campaign.spent || 0;
  const budget = campaign.budget || 0;

  const ctr = impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : '0.00';
  const cpa = conversions > 0 ? (spent / conversions).toFixed(2) : '0.00';
  const cvr = clicks > 0 ? ((conversions / clicks) * 100).toFixed(2) : '0.00';
  const budgetUsed = budget > 0 ? ((spent / budget) * 100).toFixed(0) : '0';
  const roi = spent > 0 ? (((conversions * 100 - spent) / spent) * 100).toFixed(1) : '0.0';

  // Platform color
  const platformColor = campaign.platform ? COLORS[campaign.platform as keyof typeof COLORS] || COLORS.primary : COLORS.primary;

  // Mock performance over time data (in real app, this would come from database)
  const performanceData = Array.from({ length: parseInt(timeRange) }, (_, i) => {
    const dayOffset = parseInt(timeRange) - 1 - i;
    const baseImpressions = impressions / parseInt(timeRange);
    const baseClicks = clicks / parseInt(timeRange);
    const baseConversions = conversions / parseInt(timeRange);

    return {
      date: new Date(Date.now() - dayOffset * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' }),
      impressions: Math.floor(baseImpressions * (0.8 + Math.random() * 0.4)),
      clicks: Math.floor(baseClicks * (0.8 + Math.random() * 0.4)),
      conversions: Math.floor(baseConversions * (0.8 + Math.random() * 0.4)),
      spent: Math.floor((spent / parseInt(timeRange)) * (0.8 + Math.random() * 0.4)),
    };
  }).reverse();

  // Hourly performance (mock)
  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i.toString().padStart(2, '0')}:00`,
    clicks: Math.floor(Math.random() * (clicks / 24) * 2),
    conversions: Math.floor(Math.random() * (conversions / 24) * 2),
  }));

  // Audience demographics (mock)
  const ageDistribution = [
    { name: '18-24', value: 15, color: CHART_COLORS[0] },
    { name: '25-34', value: 35, color: CHART_COLORS[1] },
    { name: '35-44', value: 25, color: CHART_COLORS[2] },
    { name: '45-54', value: 15, color: CHART_COLORS[3] },
    { name: '55+', value: 10, color: CHART_COLORS[4] },
  ];

  const genderDistribution = [
    { name: 'Kadın', value: 52, color: '#EC4899' },
    { name: 'Erkek', value: 45, color: '#3B82F6' },
    { name: 'Diğer', value: 3, color: '#8B5CF6' },
  ];

  // Geographic performance (mock)
  const geoData = [
    { city: 'İstanbul', impressions: Math.floor(impressions * 0.35), clicks: Math.floor(clicks * 0.35), conversions: Math.floor(conversions * 0.40) },
    { city: 'Ankara', impressions: Math.floor(impressions * 0.20), clicks: Math.floor(clicks * 0.20), conversions: Math.floor(conversions * 0.18) },
    { city: 'İzmir', impressions: Math.floor(impressions * 0.15), clicks: Math.floor(clicks * 0.15), conversions: Math.floor(conversions * 0.15) },
    { city: 'Bursa', impressions: Math.floor(impressions * 0.10), clicks: Math.floor(clicks * 0.10), conversions: Math.floor(conversions * 0.12) },
    { city: 'Antalya', impressions: Math.floor(impressions * 0.08), clicks: Math.floor(clicks * 0.08), conversions: Math.floor(conversions * 0.08) },
    { city: 'Diğer', impressions: Math.floor(impressions * 0.12), clicks: Math.floor(clicks * 0.12), conversions: Math.floor(conversions * 0.07) },
  ];

  // Conversion funnel
  const funnelData = [
    { stage: 'Gösterimler', value: impressions, percentage: 100 },
    { stage: 'Tıklamalar', value: clicks, percentage: impressions > 0 ? Math.round((clicks / impressions) * 100) : 0 },
    { stage: 'Sayfaya Ulaşan', value: Math.floor(clicks * 0.85), percentage: impressions > 0 ? Math.round((clicks * 0.85 / impressions) * 100) : 0 },
    { stage: 'İlgi Gösterenler', value: Math.floor(clicks * 0.45), percentage: impressions > 0 ? Math.round((clicks * 0.45 / impressions) * 100) : 0 },
    { stage: 'Dönüşümler', value: conversions, percentage: impressions > 0 ? Math.round((conversions / impressions) * 100) : 0 },
  ];

  // Device performance (mock)
  const deviceData = [
    { device: 'Mobil', impressions: Math.floor(impressions * 0.65), clicks: Math.floor(clicks * 0.70), conversions: Math.floor(conversions * 0.60) },
    { device: 'Masaüstü', impressions: Math.floor(impressions * 0.30), clicks: Math.floor(clicks * 0.25), conversions: Math.floor(conversions * 0.35) },
    { device: 'Tablet', impressions: Math.floor(impressions * 0.05), clicks: Math.floor(clicks * 0.05), conversions: Math.floor(conversions * 0.05) },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push('/dashboard/campaigns')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">{campaign.name}</h1>
              <Badge
                variant={campaign.status === 'active' ? 'default' : campaign.status === 'paused' ? 'secondary' : 'destructive'}
                className="text-sm"
              >
                {campaign.status === 'active' ? 'Aktif' : campaign.status === 'paused' ? 'Duraklatıldı' : 'Tamamlandı'}
              </Badge>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ backgroundColor: `${platformColor}20` }}>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: platformColor }} />
                <span className="text-sm font-medium" style={{ color: platformColor }}>
                  {campaign.platform?.toUpperCase() || 'PLATFORM'}
                </span>
              </div>
            </div>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
              {campaign.description || 'Detaylı kampanya analizi ve performans metrikleri'}
            </p>
            <div className="mt-2 flex items-center gap-4 text-sm text-neutral-500">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Başlangıç: {new Date(campaign.start_date).toLocaleDateString('tr-TR')}
              </span>
              {campaign.end_date && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Bitiş: {new Date(campaign.end_date).toLocaleDateString('tr-TR')}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Son 7 gün</SelectItem>
              <SelectItem value="14">Son 14 gün</SelectItem>
              <SelectItem value="30">Son 30 gün</SelectItem>
              <SelectItem value="90">Son 90 gün</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Düzenle
          </Button>
          {campaign.status === 'active' ? (
            <Button variant="outline">
              <Pause className="mr-2 h-4 w-4" />
              Duraklat
            </Button>
          ) : (
            <Button>
              <Play className="mr-2 h-4 w-4" />
              Başlat
            </Button>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Harcama</p>
                <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  ₺{spent.toLocaleString('tr-TR')}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Progress value={parseInt(budgetUsed)} className="h-2 flex-1" />
                  <span className="text-xs text-neutral-500">{budgetUsed}%</span>
                </div>
                <p className="mt-1 text-xs text-neutral-500">Bütçe: ₺{budget.toLocaleString('tr-TR')}</p>
              </div>
              <DollarSign className="h-8 w-8 text-success-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Gösterimler</p>
                <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {impressions.toLocaleString('tr-TR')}
                </p>
                <div className="mt-2 flex items-center gap-1 text-xs">
                  <TrendingUp className="h-3 w-3 text-success-600" />
                  <span className="text-success-600">+12.5%</span>
                  <span className="text-neutral-500">vs önceki dönem</span>
                </div>
              </div>
              <Eye className="h-8 w-8 text-primary-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Tıklama Oranı</p>
                <p className="mt-1 text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {ctr}%
                </p>
                <p className="mt-2 text-xs text-neutral-500">{clicks.toLocaleString('tr-TR')} tıklama</p>
              </div>
              <MousePointerClick className="h-8 w-8 text-primary-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Dönüşüm Oranı</p>
                <p className="mt-1 text-2xl font-bold text-success-600 dark:text-success-400">
                  {cvr}%
                </p>
                <p className="mt-2 text-xs text-neutral-500">{conversions.toLocaleString('tr-TR')} dönüşüm</p>
              </div>
              <Zap className="h-8 w-8 text-success-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Başına Maliyet (CPA)</p>
                <p className="mt-1 text-2xl font-bold text-warning-600 dark:text-warning-400">
                  ₺{cpa}
                </p>
                <p className="mt-2 text-xs text-neutral-500">Dönüşüm başına ortalama</p>
              </div>
              <Target className="h-8 w-8 text-warning-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">ROI (Yatırım Getirisi)</p>
                <p className={`mt-1 text-2xl font-bold ${parseFloat(roi) >= 0 ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'}`}>
                  {parseFloat(roi) >= 0 ? '+' : ''}{roi}%
                </p>
                <p className="mt-2 text-xs text-neutral-500">Kampanya getirisi</p>
              </div>
              <Activity className="h-8 w-8 text-primary-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Kalan Bütçe</p>
                <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  ₺{(budget - spent).toLocaleString('tr-TR')}
                </p>
                <p className="mt-2 text-xs text-neutral-500">{(100 - parseInt(budgetUsed)).toFixed(0)}% kaldı</p>
              </div>
              <DollarSign className="h-8 w-8 text-neutral-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Over Time */}
      <Card className="border-neutral-200 dark:border-neutral-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary-600" />
            Performans Trendi
          </CardTitle>
          <CardDescription>Zaman içinde kampanya performansı</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS[0]} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={CHART_COLORS[0]} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS[1]} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={CHART_COLORS[1]} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS[2]} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={CHART_COLORS[2]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#F3F4F6',
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="impressions"
                stroke={CHART_COLORS[0]}
                fillOpacity={1}
                fill="url(#colorImpressions)"
                name="Gösterimler"
              />
              <Area
                type="monotone"
                dataKey="clicks"
                stroke={CHART_COLORS[1]}
                fillOpacity={1}
                fill="url(#colorClicks)"
                name="Tıklamalar"
              />
              <Area
                type="monotone"
                dataKey="conversions"
                stroke={CHART_COLORS[2]}
                fillOpacity={1}
                fill="url(#colorConversions)"
                name="Dönüşümler"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Conversion Funnel & Hourly Performance */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Conversion Funnel */}
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary-600" />
              Dönüşüm Hunisi
            </CardTitle>
            <CardDescription>Kullanıcı yolculuğu ve dönüşüm aşamaları</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {funnelData.map((stage, index) => (
                <div key={stage.stage}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-neutral-900 dark:text-neutral-100">{stage.stage}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-neutral-600 dark:text-neutral-400">
                        {stage.value.toLocaleString('tr-TR')}
                      </span>
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100 w-12 text-right">
                        {stage.percentage}%
                      </span>
                    </div>
                  </div>
                  <Progress
                    value={stage.percentage}
                    className="h-6"
                    style={{
                      background: `linear-gradient(to right, ${CHART_COLORS[index]} ${stage.percentage}%, #E5E7EB ${stage.percentage}%)`,
                    }}
                  />
                  {index < funnelData.length - 1 && (
                    <div className="mt-1 text-xs text-neutral-500 text-right">
                      ↓ {((funnelData[index + 1].value / stage.value) * 100).toFixed(1)}% geçiş oranı
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Hourly Performance */}
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary-600" />
              Saatlik Performans
            </CardTitle>
            <CardDescription>Günün hangi saatlerinde daha aktif</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hourlyData.filter((_, i) => i % 2 === 0)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="hour" stroke="#6B7280" fontSize={11} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#F3F4F6',
                  }}
                />
                <Legend />
                <Bar dataKey="clicks" fill={CHART_COLORS[0]} name="Tıklamalar" radius={[4, 4, 0, 0]} />
                <Bar dataKey="conversions" fill={CHART_COLORS[1]} name="Dönüşümler" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Demographics & Geographic */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Age Distribution */}
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary-600" />
              Yaş Dağılımı
            </CardTitle>
            <CardDescription>Hedef kitle yaş grupları</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <RechartsPie>
                <Pie
                  data={ageDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {ageDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPie>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gender Distribution */}
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-primary-600" />
              Cinsiyet Dağılımı
            </CardTitle>
            <CardDescription>Hedef kitle cinsiyet oranı</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <RechartsPie>
                <Pie
                  data={genderDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {genderDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPie>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Device Distribution */}
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary-600" />
              Cihaz Performansı
            </CardTitle>
            <CardDescription>Platform bazlı dağılım</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deviceData.map((device, index) => {
                const total = deviceData.reduce((sum, d) => sum + d.impressions, 0);
                const percentage = total > 0 ? ((device.impressions / total) * 100).toFixed(0) : '0';
                return (
                  <div key={device.device}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium text-neutral-900 dark:text-neutral-100">{device.device}</span>
                      <span className="text-neutral-600 dark:text-neutral-400">{percentage}%</span>
                    </div>
                    <Progress value={parseInt(percentage)} className="h-2" />
                    <div className="mt-1 flex items-center justify-between text-xs text-neutral-500">
                      <span>{device.clicks.toLocaleString('tr-TR')} tıklama</span>
                      <span>{device.conversions.toLocaleString('tr-TR')} dönüşüm</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Geographic Performance */}
      <Card className="border-neutral-200 dark:border-neutral-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary-600" />
            Coğrafi Performans
          </CardTitle>
          <CardDescription>Şehir bazlı kampanya performansı</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={geoData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="city" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#F3F4F6',
                }}
              />
              <Legend />
              <Bar dataKey="impressions" fill={CHART_COLORS[0]} name="Gösterimler" radius={[4, 4, 0, 0]} />
              <Bar dataKey="clicks" fill={CHART_COLORS[1]} name="Tıklamalar" radius={[4, 4, 0, 0]} />
              <Bar dataKey="conversions" fill={CHART_COLORS[2]} name="Dönüşümler" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
