'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Search, TrendingUp, TrendingDown, DollarSign, Eye, MousePointer, Target, BarChart3, MoreVertical, Edit, Trash2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface Campaign {
  id: string;
  name: string;
  platform: 'meta' | 'google' | 'linkedin' | 'twitter';
  status: 'active' | 'paused' | 'completed' | 'draft';
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  startDate: string;
  endDate?: string;
  company?: string;
  created_at: string;
}

const DEMO_CAMPAIGNS: Campaign[] = [
  {
    id: '1',
    name: 'Q1 Product Launch - Meta',
    platform: 'meta',
    status: 'active',
    budget: 50000,
    spent: 32500,
    impressions: 450000,
    clicks: 12500,
    conversions: 350,
    startDate: '2025-01-01',
    endDate: '2025-03-31',
    company: 'Acme Corp',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Brand Awareness - Google Ads',
    platform: 'google',
    status: 'active',
    budget: 75000,
    spent: 48000,
    impressions: 850000,
    clicks: 28000,
    conversions: 680,
    startDate: '2025-01-15',
    company: 'TechStart Inc',
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'LinkedIn B2B Campaign',
    platform: 'linkedin',
    status: 'paused',
    budget: 25000,
    spent: 18500,
    impressions: 125000,
    clicks: 4200,
    conversions: 120,
    startDate: '2024-12-01',
    endDate: '2025-02-28',
    created_at: new Date().toISOString(),
  },
];

const STORAGE_KEY = 'crmdeep_campaigns';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setCampaigns(JSON.parse(stored));
    } else {
      setCampaigns(DEMO_CAMPAIGNS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_CAMPAIGNS));
    }
  }, []);

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = platformFilter === 'all' || campaign.platform === platformFilter;
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesPlatform && matchesStatus;
  });

  const calculateCTR = (clicks: number, impressions: number) => {
    return impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : '0.00';
  };

  const calculateCPA = (spent: number, conversions: number) => {
    return conversions > 0 ? (spent / conversions).toFixed(2) : '0.00';
  };

  const getPlatformBadge = (platform: Campaign['platform']) => {
    const badges = {
      meta: { label: 'Meta Ads', color: 'bg-blue-500' },
      google: { label: 'Google Ads', color: 'bg-red-500' },
      linkedin: { label: 'LinkedIn', color: 'bg-sky-600' },
      twitter: { label: 'Twitter', color: 'bg-sky-400' },
    };
    const badge = badges[platform];
    return <Badge className={`${badge.color} text-white`}>{badge.label}</Badge>;
  };

  const getStatusBadge = (status: Campaign['status']) => {
    const badges = {
      active: { label: 'Aktif', color: 'bg-success-500' },
      paused: { label: 'Duraklatıldı', color: 'bg-warning-500' },
      completed: { label: 'Tamamlandı', color: 'bg-neutral-500' },
      draft: { label: 'Taslak', color: 'bg-neutral-400' },
    };
    const badge = badges[status];
    return <Badge className={`${badge.color} text-white`}>{badge.label}</Badge>;
  };

  const totalBudget = filteredCampaigns.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = filteredCampaigns.reduce((sum, c) => sum + c.spent, 0);
  const totalImpressions = filteredCampaigns.reduce((sum, c) => sum + c.impressions, 0);
  const totalClicks = filteredCampaigns.reduce((sum, c) => sum + c.clicks, 0);
  const totalConversions = filteredCampaigns.reduce((sum, c) => sum + c.conversions, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            Kampanyalar
          </h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">
            Meta ve Google Ads kampanyalarınızı tek yerden yönetin
          </p>
        </div>
        <Button onClick={() => alert('Kampanya ekleme yakında!')}>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Kampanya
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Toplam Bütçe</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  ₺{(totalBudget / 1000).toFixed(0)}K
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Harcanan</p>
                <p className="text-2xl font-bold text-warning-600 dark:text-warning-400">
                  ₺{(totalSpent / 1000).toFixed(0)}K
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-warning-600 dark:text-warning-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Gösterim</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {(totalImpressions / 1000).toFixed(0)}K
                </p>
              </div>
              <Eye className="h-8 w-8 text-sky-600 dark:text-sky-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Tıklama</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {(totalClicks / 1000).toFixed(1)}K
                </p>
              </div>
              <MousePointer className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Dönüşüm</p>
                <p className="text-2xl font-bold text-success-600 dark:text-success-400">
                  {totalConversions}
                </p>
              </div>
              <Target className="h-8 w-8 text-success-600 dark:text-success-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <Input
            type="text"
            placeholder="Kampanya ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={platformFilter} onValueChange={setPlatformFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Platformlar</SelectItem>
            <SelectItem value="meta">Meta Ads</SelectItem>
            <SelectItem value="google">Google Ads</SelectItem>
            <SelectItem value="linkedin">LinkedIn</SelectItem>
            <SelectItem value="twitter">Twitter</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Durum" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Durumlar</SelectItem>
            <SelectItem value="active">Aktif</SelectItem>
            <SelectItem value="paused">Duraklatıldı</SelectItem>
            <SelectItem value="completed">Tamamlandı</SelectItem>
            <SelectItem value="draft">Taslak</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle>Kampanya Listesi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700">
                  <th className="text-left p-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Kampanya</th>
                  <th className="text-left p-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Platform</th>
                  <th className="text-left p-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Durum</th>
                  <th className="text-right p-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Bütçe</th>
                  <th className="text-right p-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Harcama</th>
                  <th className="text-right p-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Gösterim</th>
                  <th className="text-right p-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Tıklama</th>
                  <th className="text-right p-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">CTR</th>
                  <th className="text-right p-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Dönüşüm</th>
                  <th className="text-right p-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">CPA</th>
                  <th className="text-right p-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300"></th>
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                    <td className="p-3">
                      <div>
                        <p className="font-medium text-neutral-900 dark:text-neutral-100">{campaign.name}</p>
                        {campaign.company && (
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">{campaign.company}</p>
                        )}
                      </div>
                    </td>
                    <td className="p-3">{getPlatformBadge(campaign.platform)}</td>
                    <td className="p-3">{getStatusBadge(campaign.status)}</td>
                    <td className="p-3 text-right font-medium">₺{(campaign.budget / 1000).toFixed(0)}K</td>
                    <td className="p-3 text-right font-medium text-warning-600 dark:text-warning-400">₺{(campaign.spent / 1000).toFixed(0)}K</td>
                    <td className="p-3 text-right">{(campaign.impressions / 1000).toFixed(0)}K</td>
                    <td className="p-3 text-right">{(campaign.clicks / 1000).toFixed(1)}K</td>
                    <td className="p-3 text-right text-purple-600 dark:text-purple-400">{calculateCTR(campaign.clicks, campaign.impressions)}%</td>
                    <td className="p-3 text-right text-success-600 dark:text-success-400">{campaign.conversions}</td>
                    <td className="p-3 text-right">₺{calculateCPA(campaign.spent, campaign.conversions)}</td>
                    <td className="p-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => alert('Detaylar yakında!')}>
                            <BarChart3 className="mr-2 h-4 w-4" />
                            Detaylar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => alert('Düzenleme yakında!')}>
                            <Edit className="mr-2 h-4 w-4" />
                            Düzenle
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-danger-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Sil
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCampaigns.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <Search className="h-12 w-12 text-neutral-300 dark:text-neutral-600" />
              <h3 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Kampanya bulunamadı
              </h3>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                Arama kriterlerinize uygun kampanya yok
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
