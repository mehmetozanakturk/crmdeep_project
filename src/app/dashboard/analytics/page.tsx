'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Eye,
  MousePointer,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Loader2,
  Calendar,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPie,
  Pie,
  Cell,
  AreaChart,
  Area,
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

interface CampaignData {
  platform: string;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  date: string;
}

export default function AnalyticsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('30');

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const workspaceId = getActiveWorkspaceId();
      if (!workspaceId) {
        setLoading(false);
        return;
      }

      const data = await CampaignsAPI.loadCampaigns(workspaceId);
      setCampaigns(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter campaigns by platform
  const filteredCampaigns = platformFilter === 'all'
    ? campaigns
    : campaigns.filter(c => c.platform === platformFilter);

  // Calculate metrics
  const totalSpent = filteredCampaigns.reduce((sum, c) => sum + (c.spent || 0), 0);
  const totalImpressions = filteredCampaigns.reduce((sum, c) => sum + (c.impressions || 0), 0);
  const totalClicks = filteredCampaigns.reduce((sum, c) => sum + (c.clicks || 0), 0);
  const totalConversions = filteredCampaigns.reduce((sum, c) => sum + (c.conversions || 0), 0);

  const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00';
  const cpa = totalConversions > 0 ? (totalSpent / totalConversions).toFixed(2) : '0.00';
  const cvr = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(2) : '0.00';

  // Platform distribution data for Pie Chart
  const platformData = campaigns.reduce((acc: any[], campaign) => {
    const existing = acc.find(item => item.name === campaign.platform);
    if (existing) {
      existing.value += campaign.spent || 0;
    } else {
      acc.push({
        name: campaign.platform,
        value: campaign.spent || 0,
      });
    }
    return acc;
  }, []);

  // Trend data for Line Chart (last 7 days mock - replace with real date grouping)
  const trendData = [
    { date: '1 Haz', impressions: totalImpressions * 0.12, clicks: totalClicks * 0.11, conversions: totalConversions * 0.10 },
    { date: '2 Haz', impressions: totalImpressions * 0.13, clicks: totalClicks * 0.13, conversions: totalConversions * 0.12 },
    { date: '3 Haz', impressions: totalImpressions * 0.15, clicks: totalClicks * 0.14, conversions: totalConversions * 0.15 },
    { date: '4 Haz', impressions: totalImpressions * 0.14, clicks: totalClicks * 0.15, conversions: totalConversions * 0.14 },
    { date: '5 Haz', impressions: totalImpressions * 0.16, clicks: totalClicks * 0.16, conversions: totalConversions * 0.16 },
    { date: '6 Haz', impressions: totalImpressions * 0.15, clicks: totalClicks * 0.16, conversions: totalConversions * 0.17 },
    { date: '7 Haz', impressions: totalImpressions * 0.15, clicks: totalClicks * 0.15, conversions: totalConversions * 0.16 },
  ];

  // Performance by campaign for Bar Chart
  const campaignPerformance = filteredCampaigns.slice(0, 5).map(c => ({
    name: c.name.length > 20 ? c.name.substring(0, 20) + '...' : c.name,
    spent: c.spent || 0,
    conversions: c.conversions || 0,
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary-600 dark:text-primary-400" />
          <h3 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Analytics yükleniyor...
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header with Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              Kampanya Analytics
            </h1>
            <p className="mt-1 text-neutral-600 dark:text-neutral-400">
              Detaylı kampanya performans analizi ve insights
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <Select value={platformFilter} onValueChange={setPlatformFilter}>
            <SelectTrigger className="w-[200px]">
              <Activity className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Platformlar</SelectItem>
              <SelectItem value="meta">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.meta }} />
                  Meta Ads
                </div>
              </SelectItem>
              <SelectItem value="google">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.google }} />
                  Google Ads
                </div>
              </SelectItem>
              <SelectItem value="linkedin">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.linkedin }} />
                  LinkedIn
                </div>
              </SelectItem>
              <SelectItem value="twitter">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.twitter }} />
                  Twitter
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Son 7 gün</SelectItem>
              <SelectItem value="30">Son 30 gün</SelectItem>
              <SelectItem value="90">Son 90 gün</SelectItem>
              <SelectItem value="365">Son 1 yıl</SelectItem>
            </SelectContent>
          </Select>

          <Badge variant="outline" className="ml-auto">
            {filteredCampaigns.length} kampanya
          </Badge>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Toplam Harcama</p>
                <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  ₺{totalSpent.toLocaleString('tr-TR')}
                </p>
                <p className="mt-1 text-xs text-neutral-500">
                  {filteredCampaigns.length} kampanya
                </p>
              </div>
              <div className="rounded-lg bg-primary-100 dark:bg-primary-900/30 p-3">
                <DollarSign className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Click-Through Rate</p>
                <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {ctr}%
                </p>
                <p className="mt-1 text-xs text-success-600 dark:text-success-400 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Industry avg: 2.5%
                </p>
              </div>
              <div className="rounded-lg bg-success-100 dark:bg-success-900/30 p-3">
                <MousePointer className="h-6 w-6 text-success-600 dark:text-success-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Cost Per Acquisition</p>
                <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  ₺{cpa}
                </p>
                <p className="mt-1 text-xs text-neutral-500">
                  {totalConversions} conversion
                </p>
              </div>
              <div className="rounded-lg bg-warning-100 dark:bg-warning-900/30 p-3">
                <Target className="h-6 w-6 text-warning-600 dark:text-warning-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Conversion Rate</p>
                <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {cvr}%
                </p>
                <p className="mt-1 text-xs text-neutral-500">
                  {totalClicks.toLocaleString()} clicks
                </p>
              </div>
              <div className="rounded-lg bg-purple-100 dark:bg-purple-900/30 p-3">
                <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Performance Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Trend</CardTitle>
            <CardDescription>Son 7 günlük performans</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
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
                <Line
                  type="monotone"
                  dataKey="impressions"
                  stroke={CHART_COLORS[0]}
                  strokeWidth={2}
                  dot={{ fill: CHART_COLORS[0], r: 4 }}
                  name="Gösterimler"
                />
                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke={CHART_COLORS[1]}
                  strokeWidth={2}
                  dot={{ fill: CHART_COLORS[1], r: 4 }}
                  name="Tıklamalar"
                />
                <Line
                  type="monotone"
                  dataKey="conversions"
                  stroke={CHART_COLORS[2]}
                  strokeWidth={2}
                  dot={{ fill: CHART_COLORS[2], r: 4 }}
                  name="Dönüşümler"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Platform Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Dağılımı</CardTitle>
            <CardDescription>Harcama bazında platform payı</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPie>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {platformData.map((entry, index) => {
                    const colorMap: any = {
                      meta: COLORS.meta,
                      google: COLORS.google,
                      linkedin: COLORS.linkedin,
                      twitter: COLORS.twitter,
                    };
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={colorMap[entry.name] || CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    );
                  })}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#F3F4F6',
                  }}
                  formatter={(value: any) => `₺${value.toLocaleString('tr-TR')}`}
                />
              </RechartsPie>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Campaign Performance */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Kampanya Performansı</CardTitle>
            <CardDescription>Top 5 kampanya - Harcama vs Dönüşüm</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={campaignPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
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
                <Bar dataKey="spent" fill={CHART_COLORS[0]} name="Harcama (₺)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="conversions" fill={CHART_COLORS[1]} name="Dönüşüm" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Toplam Gösterim</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalImpressions.toLocaleString('tr-TR')}</div>
            <p className="text-xs text-neutral-500 mt-1">
              Kampanyalar toplamda {totalImpressions.toLocaleString()} kez görüntülendi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Toplam Tıklama</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks.toLocaleString('tr-TR')}</div>
            <p className="text-xs text-neutral-500 mt-1">
              {ctr}% tıklama oranı ile {totalClicks.toLocaleString()} tıklama
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Toplam Dönüşüm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConversions.toLocaleString('tr-TR')}</div>
            <p className="text-xs text-neutral-500 mt-1">
              {cvr}% dönüşüm oranı - Ortalama ₺{cpa} CPA
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
