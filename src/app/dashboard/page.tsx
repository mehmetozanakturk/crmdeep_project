'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  TrendingUp,
  TrendingDown,
  Briefcase,
  Users,
  DollarSign,
  Target,
  Calendar,
  Clock,
  Activity,
  ArrowUpRight,
  Building2,
  Mail,
  Phone,
  Loader2,
  Plus,
  BarChart3,
  LineChart,
  PieChart as PieChartIcon,
  ShoppingCart,
} from 'lucide-react';
import {
  LineChart as RechartsLineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
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
import { useOrganization } from '@/lib/hooks/useOrganization';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import type { DateRange } from 'react-day-picker';

interface Deal {
  id: string;
  title: string;
  company: string;
  value: number;
  stage: string;
  created_at: string;
  updated_at: string;
}

interface Contact {
  id: string;
  name: string;
  email: string | null;
  company_name: string | null;
  created_at: string;
}

interface Company {
  id: string;
  name: string;
  created_at: string;
}

interface Campaign {
  id: string;
  name: string;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  status?: string;
  created_at: string;
}

interface DashboardStats {
  totalRevenue: number;
  revenueChange: number;
  activeDeals: number;
  dealsChange: number;
  totalContacts: number;
  contactsChange: number;
  conversionRate: number;
  conversionChange: number;
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

export default function DashboardPage() {
  const { currentOrganization, isLoading: orgLoading } = useOrganization();
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  });
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    revenueChange: 0,
    activeDeals: 0,
    dealsChange: 0,
    totalContacts: 0,
    contactsChange: 0,
    conversionRate: 0,
    conversionChange: 0,
  });
  const [deals, setDeals] = useState<Deal[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [dealsByStage, setDealsByStage] = useState<any[]>([]);
  const [monthlyDeals, setMonthlyDeals] = useState<any[]>([]);

  const loadDashboardData = useCallback(async () => {
    if (!currentOrganization) return;

    try {
      setIsLoading(true);
      const supabase = createClient();

      // Fetch all data in parallel
      const [dealsData, contactsData, companiesData, campaignsData] = await Promise.all([
        supabase.from('deals').select('*').eq('organization_id', currentOrganization.id).order('created_at', { ascending: false }),
        supabase.from('contacts').select('*').eq('organization_id', currentOrganization.id).order('created_at', { ascending: false }),
        supabase.from('companies').select('*').eq('organization_id', currentOrganization.id).order('created_at', { ascending: false }),
        supabase.from('campaigns').select('*').eq('organization_id', currentOrganization.id).order('created_at', { ascending: false }),
      ]);

      const allDeals = dealsData.data || [];
      const allContacts = contactsData.data || [];
      const allCompanies = companiesData.data || [];
      const allCampaigns = campaignsData.data || [];

      setDeals(allDeals);
      setContacts(allContacts);
      setCompanies(allCompanies);
      setCampaigns(allCampaigns);

      // Calculate stats
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

      // Revenue calculations
      const totalRevenue = allDeals
        .filter((d) => d.stage === 'closed_won')
        .reduce((sum, deal) => sum + (deal.value || 0), 0);

      const revenueLastMonth = allDeals
        .filter((d) => d.stage === 'closed_won' && new Date(d.updated_at) >= thirtyDaysAgo)
        .reduce((sum, deal) => sum + (deal.value || 0), 0);

      const revenuePrevMonth = allDeals
        .filter((d) => d.stage === 'closed_won' && new Date(d.updated_at) >= sixtyDaysAgo && new Date(d.updated_at) < thirtyDaysAgo)
        .reduce((sum, deal) => sum + (deal.value || 0), 0);

      const revenueChange = revenuePrevMonth > 0 ? ((revenueLastMonth - revenuePrevMonth) / revenuePrevMonth) * 100 : 0;

      // Active deals (not closed)
      const activeDeals = allDeals.filter((d) => d.stage !== 'closed_won' && d.stage !== 'closed_lost').length;
      const activeDealsLastMonth = allDeals.filter(
        (d) => d.stage !== 'closed_won' && d.stage !== 'closed_lost' && new Date(d.created_at) >= thirtyDaysAgo
      ).length;
      const activeDealsChange = activeDealsLastMonth;

      // Contacts
      const totalContacts = allContacts.length;
      const contactsLastMonth = allContacts.filter((c) => new Date(c.created_at) >= thirtyDaysAgo).length;

      // Conversion rate
      const totalLeads = allDeals.length;
      const wonDeals = allDeals.filter((d) => d.stage === 'closed_won').length;
      const conversionRate = totalLeads > 0 ? (wonDeals / totalLeads) * 100 : 0;

      setStats({
        totalRevenue,
        revenueChange,
        activeDeals,
        dealsChange: activeDealsChange,
        totalContacts,
        contactsChange: contactsLastMonth,
        conversionRate,
        conversionChange: 2.3, // Mock for now
      });

      // Generate revenue trend data (last 30 days)
      const revenueByDay = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dateStr = date.toISOString().split('T')[0];
        const dayRevenue = allDeals
          .filter(
            (d) =>
              d.stage === 'closed_won' &&
              d.updated_at &&
              d.updated_at.split('T')[0] === dateStr
          )
          .reduce((sum, deal) => sum + (deal.value || 0), 0);

        revenueByDay.push({
          date: date.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' }),
          revenue: dayRevenue,
        });
      }
      setRevenueData(revenueByDay);

      // Deals by stage
      const stageGroups = allDeals.reduce((acc: any, deal) => {
        const stage = deal.stage || 'unknown';
        if (!acc[stage]) {
          acc[stage] = { name: stage, value: 0, count: 0 };
        }
        acc[stage].value += deal.value || 0;
        acc[stage].count += 1;
        return acc;
      }, {});

      const stageLabels: Record<string, string> = {
        lead: 'Lead',
        qualified: 'Nitelikli',
        proposal: 'Teklif',
        negotiation: 'Görüşme',
        closed_won: 'Kazanıldı',
        closed_lost: 'Kaybedildi',
      };

      const stagesData = Object.values(stageGroups).map((stage: any) => ({
        name: stageLabels[stage.name] || stage.name,
        value: stage.count,
        revenue: stage.value,
      }));
      setDealsByStage(stagesData);

      // Monthly deals comparison (last 6 months)
      const monthlyData = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthStr = date.toLocaleDateString('tr-TR', { month: 'short' });
        const monthDeals = allDeals.filter((d) => {
          const dealDate = new Date(d.created_at);
          return dealDate.getMonth() === date.getMonth() && dealDate.getFullYear() === date.getFullYear();
        });

        monthlyData.push({
          month: monthStr,
          deals: monthDeals.length,
          revenue: monthDeals.reduce((sum, deal) => sum + (deal.value || 0), 0),
        });
      }
      setMonthlyDeals(monthlyData);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentOrganization]);

  useEffect(() => {
    if (currentOrganization) {
      loadDashboardData();
    }
  }, [currentOrganization, loadDashboardData]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('tr-TR').format(value);
  };

  // Show loading state
  if (orgLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary-600 dark:text-primary-400" />
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">Dashboard yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!currentOrganization) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <p className="text-neutral-600 dark:text-neutral-400">Organizasyon bulunamadı</p>
        </div>
      </div>
    );
  }

  const recentDeals = deals.slice(0, 5);
  const recentContacts = contacts.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Dashboard</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">
            Hoş geldiniz! İşinizin genel görünümü.
          </p>
        </div>
        <div className="flex gap-2">
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              Toplam Gelir
            </CardTitle>
            <div className="rounded-lg bg-success-100 dark:bg-success-900/30 p-2">
              <DollarSign className="h-4 w-4 text-success-600 dark:text-success-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              {formatCurrency(stats.totalRevenue)}
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs">
                {stats.revenueChange >= 0 ? (
                  <>
                    <TrendingUp className="h-3 w-3 text-success-600" />
                    <span className="text-success-600">+{stats.revenueChange.toFixed(1)}%</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-3 w-3 text-danger-600" />
                    <span className="text-danger-600">{stats.revenueChange.toFixed(1)}%</span>
                  </>
                )}
              </div>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">vs geçen ay</span>
            </div>
          </CardContent>
        </Card>

        {/* Active Deals */}
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              Aktif Fırsatlar
            </CardTitle>
            <div className="rounded-lg bg-primary-100 dark:bg-primary-900/30 p-2">
              <Target className="h-4 w-4 text-primary-600 dark:text-primary-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              {stats.activeDeals}
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs">
                <TrendingUp className="h-3 w-3 text-primary-600" />
                <span className="text-primary-600">+{stats.dealsChange}</span>
              </div>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">bu ay</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Contacts */}
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              Toplam Kişiler
            </CardTitle>
            <div className="rounded-lg bg-warning-100 dark:bg-warning-900/30 p-2">
              <Users className="h-4 w-4 text-warning-600 dark:text-warning-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              {stats.totalContacts}
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs">
                <TrendingUp className="h-3 w-3 text-warning-600" />
                <span className="text-warning-600">+{stats.contactsChange}</span>
              </div>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">yeni</span>
            </div>
          </CardContent>
        </Card>

        {/* Conversion Rate */}
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              Dönüşüm Oranı
            </CardTitle>
            <div className="rounded-lg bg-success-100 dark:bg-success-900/30 p-2">
              <BarChart3 className="h-4 w-4 text-success-600 dark:text-success-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              {stats.conversionRate.toFixed(1)}%
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs">
                <TrendingUp className="h-3 w-3 text-success-600" />
                <span className="text-success-600">+{stats.conversionChange}%</span>
              </div>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">deal başarısı</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Revenue Trend Chart */}
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5 text-primary-600" />
              Gelir Trendi
            </CardTitle>
            <CardDescription>Son 30 günlük gelir akışı</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsLineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-200 dark:stroke-neutral-700" />
                <XAxis
                  dataKey="date"
                  className="text-xs text-neutral-600 dark:text-neutral-400"
                  tick={{ fill: 'currentColor' }}
                />
                <YAxis
                  className="text-xs text-neutral-600 dark:text-neutral-400"
                  tick={{ fill: 'currentColor' }}
                  tickFormatter={(value) => `₺${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: any) => [formatCurrency(value), 'Gelir']}
                />
                <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} dot={false} />
              </RechartsLineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Deals by Stage Pie Chart */}
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-primary-600" />
              Fırsatlar - Aşama Dağılımı
            </CardTitle>
            <CardDescription>Deal&apos;lerin mevcut durumu</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={dealsByStage}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dealsByStage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: any, name: string, props: any) => [
                    `${value} deal (${formatCurrency(props.payload.revenue)})`,
                    'Toplam',
                  ]}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 md:grid-cols-1">
        {/* Monthly Deals Bar Chart */}
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary-600" />
              Aylık Fırsat Performansı
            </CardTitle>
            <CardDescription>Son 6 aydaki fırsat sayısı ve gelir</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <RechartsBarChart data={monthlyDeals}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-200 dark:stroke-neutral-700" />
                <XAxis
                  dataKey="month"
                  className="text-xs text-neutral-600 dark:text-neutral-400"
                  tick={{ fill: 'currentColor' }}
                />
                <YAxis
                  yAxisId="left"
                  className="text-xs text-neutral-600 dark:text-neutral-400"
                  tick={{ fill: 'currentColor' }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  className="text-xs text-neutral-600 dark:text-neutral-400"
                  tick={{ fill: 'currentColor' }}
                  tickFormatter={(value) => `₺${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: any, name: string) => [
                    name === 'deals' ? value : formatCurrency(value),
                    name === 'deals' ? 'Fırsat Sayısı' : 'Gelir',
                  ]}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="deals" fill="#6366f1" name="Fırsat Sayısı" radius={[8, 8, 0, 0]} />
                <Bar yAxisId="right" dataKey="revenue" fill="#10b981" name="Gelir" radius={[8, 8, 0, 0]} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Stats */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Deals */}
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary-600" />
                  Son Fırsatlar
                </CardTitle>
                <CardDescription>En son eklenen deals</CardDescription>
              </div>
              <Link href="/dashboard/deals">
                <Button variant="ghost" size="sm" className="text-primary-600">
                  Tümünü Gör
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDeals.length === 0 ? (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-neutral-400 mx-auto mb-3" />
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Henüz fırsat eklenmemiş</p>
                  <Link href="/dashboard/deals">
                    <Button variant="outline" size="sm" className="mt-3">
                      <Plus className="mr-2 h-4 w-4" />
                      İlk Fırsatı Ekle
                    </Button>
                  </Link>
                </div>
              ) : (
                recentDeals.map((deal) => (
                  <div key={deal.id} className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                        {deal.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Building2 className="h-3 w-3 text-neutral-400" />
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{deal.company}</p>
                      </div>
                    </div>
                    <div className="text-right ml-3">
                      <p className="text-sm font-bold text-primary-600 dark:text-primary-400">
                        {formatCurrency(deal.value)}
                      </p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {deal.stage}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Contacts */}
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary-600" />
                  Son Kişiler
                </CardTitle>
                <CardDescription>En son eklenen contacts</CardDescription>
              </div>
              <Link href="/dashboard/contacts">
                <Button variant="ghost" size="sm" className="text-primary-600">
                  Tümünü Gör
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentContacts.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-neutral-400 mx-auto mb-3" />
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Henüz kişi eklenmemiş</p>
                  <Link href="/dashboard/contacts">
                    <Button variant="outline" size="sm" className="mt-3">
                      <Plus className="mr-2 h-4 w-4" />
                      İlk Kişiyi Ekle
                    </Button>
                  </Link>
                </div>
              ) : (
                recentContacts.map((contact) => (
                  <div key={contact.id} className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                        {contact.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                        {contact.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {contact.email && (
                          <>
                            <Mail className="h-3 w-3 text-neutral-400" />
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                              {contact.email}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    {contact.company_name && (
                      <Badge variant="secondary" className="text-xs">
                        {contact.company_name}
                      </Badge>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-neutral-200 dark:border-neutral-700">
        <CardHeader>
          <CardTitle>Hızlı Aksiyonlar</CardTitle>
          <CardDescription>Sık kullanılan işlemler</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/dashboard/deals">
              <Button variant="outline" className="w-full h-auto p-4 flex items-start gap-3 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20">
                <div className="rounded-lg bg-primary-100 dark:bg-primary-900/30 p-2">
                  <Target className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Yeni Fırsat</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Deal ekle</p>
                </div>
              </Button>
            </Link>

            <Link href="/dashboard/contacts">
              <Button variant="outline" className="w-full h-auto p-4 flex items-start gap-3 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20">
                <div className="rounded-lg bg-warning-100 dark:bg-warning-900/30 p-2">
                  <Users className="h-5 w-5 text-warning-600 dark:text-warning-400" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Yeni Kişi</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Contact ekle</p>
                </div>
              </Button>
            </Link>

            <Link href="/dashboard/companies">
              <Button variant="outline" className="w-full h-auto p-4 flex items-start gap-3 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20">
                <div className="rounded-lg bg-success-100 dark:bg-success-900/30 p-2">
                  <Briefcase className="h-5 w-5 text-success-600 dark:text-success-400" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Yeni Firma</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Company ekle</p>
                </div>
              </Button>
            </Link>

            <Link href="/dashboard/reports">
              <Button variant="outline" className="w-full h-auto p-4 flex items-start gap-3 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20">
                <div className="rounded-lg bg-purple-100 dark:bg-purple-900/30 p-2">
                  <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Raporlar</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Analiz görüntüle</p>
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Additional Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Toplam Firmalar</p>
                <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {companies.length}
                </p>
              </div>
              <Building2 className="h-8 w-8 text-neutral-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Aktif Kampanyalar</p>
                <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {campaigns.filter((c) => c.status === 'active').length}
                </p>
              </div>
              <Activity className="h-8 w-8 text-neutral-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Ortalama Deal Değeri</p>
                <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {deals.length > 0 ? formatCurrency(stats.totalRevenue / deals.length) : formatCurrency(0)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-neutral-400" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
