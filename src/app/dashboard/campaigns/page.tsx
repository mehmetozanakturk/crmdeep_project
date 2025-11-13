'use client';

import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plus,
  TrendingUp,
  DollarSign,
  MousePointerClick,
  Target,
  Facebook,
  Globe,
  Linkedin,
  Twitter,
  BarChart3,
  Trash2,
  Play,
  Pause,
} from 'lucide-react';
import { useOrganization } from '@/lib/hooks/useOrganization';
import { useBrands } from '@/lib/hooks/useBrands';
import { createClient } from '@/lib/supabase/client';
import { AddCampaignModal } from '@/components/campaigns/AddCampaignModal';

interface Campaign {
  id: string;
  organization_id: string;
  name: string;
  platform: 'meta' | 'google' | 'linkedin' | 'twitter' | 'other';
  status: 'draft' | 'active' | 'paused' | 'completed' | 'archived';
  campaign_type?: 'awareness' | 'consideration' | 'conversion' | 'remarketing';
  budget: number;
  spent: number;
  currency: string;
  impressions: number;
  clicks: number;
  conversions: number;
  reach: number;
  start_date: string | null;
  end_date: string | null;
  ad_copy?: string | null;
  call_to_action?: string | null;
  landing_page_url?: string | null;
  tags?: string[];
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export default function CampaignsPage() {
  const { currentOrganization } = useOrganization();
  const { currentBrand } = useBrands();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const loadCampaigns = async () => {
    if (!currentOrganization) return;

    setIsLoading(true);
    try {
      const supabase = createClient();
      let query = supabase
        .from('campaigns')
        .select('*')
        .eq('organization_id', currentOrganization.id)
        .order('created_at', { ascending: false });

      // Note: brand_id filtering removed since the table doesn't have this column
      // If needed in future, add brand_id column to campaigns table first

      const { data, error } = await query;

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error loading campaigns:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterCampaigns = useCallback(() => {
    if (selectedPlatform === 'all') {
      setFilteredCampaigns(campaigns);
    } else {
      setFilteredCampaigns(campaigns.filter((c) => c.platform === selectedPlatform));
    }
  }, [campaigns, selectedPlatform]);

  useEffect(() => {
    if (currentOrganization) {
      loadCampaigns();
    }
  }, [currentOrganization]);

  useEffect(() => {
    filterCampaigns();
  }, [filterCampaigns]);

  const handleDeleteCampaign = async (id: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;

    try {
      const supabase = createClient();
      const { error } = await supabase.from('campaigns').delete().eq('id', id);

      if (error) throw error;
      loadCampaigns();
    } catch (error) {
      console.error('Error deleting campaign:', error);
      alert('Error deleting campaign');
    }
  };

  const handleToggleStatus = async (campaign: Campaign) => {
    const newStatus = campaign.status === 'active' ? 'paused' : 'active';

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('campaigns')
        .update({ status: newStatus })
        .eq('id', campaign.id);

      if (error) throw error;
      loadCampaigns();
    } catch (error) {
      console.error('Error updating campaign status:', error);
      alert('Error updating campaign status');
    }
  };

  const getPlatformIcon = (platform: Campaign['platform']) => {
    switch (platform) {
      case 'meta':
        return <Facebook className="h-5 w-5" />;
      case 'google':
        return <Globe className="h-5 w-5" />;
      case 'linkedin':
        return <Linkedin className="h-5 w-5" />;
      case 'twitter':
        return <Twitter className="h-5 w-5" />;
      default:
        return <BarChart3 className="h-5 w-5" />;
    }
  };

  const getPlatformColor = (platform: Campaign['platform']) => {
    switch (platform) {
      case 'meta':
        return 'bg-blue-500';
      case 'google':
        return 'bg-green-500';
      case 'linkedin':
        return 'bg-blue-700';
      case 'twitter':
        return 'bg-sky-500';
      default:
        return 'bg-neutral-500';
    }
  };

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'active':
        return 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400';
      case 'paused':
        return 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400';
      case 'completed':
        return 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400';
      case 'draft':
        return 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400';
      default:
        return 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400';
    }
  };

  const calculateROI = (campaign: Campaign) => {
    if (campaign.spent === 0) return 0;
    const revenue = campaign.conversions * 50;
    return ((revenue - campaign.spent) / campaign.spent) * 100;
  };

  const calculateCTR = (campaign: Campaign) => {
    if (campaign.impressions === 0) return 0;
    return (campaign.clicks / campaign.impressions) * 100;
  };

  const calculateCPA = (campaign: Campaign) => {
    if (campaign.conversions === 0) return 0;
    return campaign.spent / campaign.conversions;
  };

  // Calculate stats from campaigns data
  const stats = {
    totalBudget: campaigns.reduce((sum, c) => sum + (c.budget || 0), 0),
    totalSpent: campaigns.reduce((sum, c) => sum + (c.spent || 0), 0),
    totalImpressions: campaigns.reduce((sum, c) => sum + (c.impressions || 0), 0),
    totalClicks: campaigns.reduce((sum, c) => sum + (c.clicks || 0), 0),
    totalConversions: campaigns.reduce((sum, c) => sum + (c.conversions || 0), 0),
  };

  const avgCTR = stats.totalImpressions > 0 ? (stats.totalClicks / stats.totalImpressions) * 100 : 0;
  const avgCPA = stats.totalConversions > 0 ? stats.totalSpent / stats.totalConversions : 0;
  const avgCVR = stats.totalClicks > 0 ? (stats.totalConversions / stats.totalClicks) * 100 : 0;
  const avgROI = stats.totalSpent > 0 ? ((stats.totalConversions * 50 - stats.totalSpent) / stats.totalSpent) * 100 : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            Marketing Campaigns
          </h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">
            Manage your advertising campaigns across platforms
          </p>
        </div>
        <Button onClick={() => setAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Campaign
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Total Spent</p>
                <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {formatCurrency(stats.totalSpent)}
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  of {formatCurrency(stats.totalBudget)} budget
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-primary-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Avg ROI</p>
                <p className="mt-1 text-2xl font-bold text-success-600 dark:text-success-400">
                  {avgROI.toFixed(1)}%
                </p>
                <p className="text-xs text-neutral-500 mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Return on Investment
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-success-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Total Clicks</p>
                <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {formatNumber(stats.totalClicks)}
                </p>
                <p className="text-xs text-neutral-500 mt-1">{avgCTR.toFixed(2)}% CTR</p>
              </div>
              <MousePointerClick className="h-8 w-8 text-primary-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Conversions</p>
                <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {formatNumber(stats.totalConversions)}
                </p>
                <p className="text-xs text-neutral-500 mt-1">{avgCVR.toFixed(2)}% CVR</p>
              </div>
              <Target className="h-8 w-8 text-success-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Tabs */}
      <Tabs value={selectedPlatform} onValueChange={setSelectedPlatform}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All Platforms</TabsTrigger>
          <TabsTrigger value="meta">Meta Ads</TabsTrigger>
          <TabsTrigger value="google">Google Ads</TabsTrigger>
          <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
          <TabsTrigger value="twitter">Twitter</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedPlatform} className="space-y-4 mt-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-4 text-neutral-600 dark:text-neutral-400">Loading campaigns...</p>
              </div>
            </div>
          ) : filteredCampaigns.length === 0 ? (
            <Card className="border-neutral-200 dark:border-neutral-700">
              <CardContent className="py-12 text-center">
                <BarChart3 className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                  No campaigns yet
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  Create your first campaign to start tracking performance
                </p>
                <Button onClick={() => setAddModalOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Campaign
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredCampaigns.map((campaign) => {
                const roi = calculateROI(campaign);
                const ctr = calculateCTR(campaign);
                const cpa = calculateCPA(campaign);

                return (
                  <Card key={campaign.id} className="border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`rounded-lg ${getPlatformColor(campaign.platform)} p-2.5 text-white`}>
                            {getPlatformIcon(campaign.platform)}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{campaign.name}</CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                              <span className="capitalize">{campaign.platform}</span>
                              {campaign.campaign_type && (
                                <>
                                  <span>•</span>
                                  <span className="capitalize">{campaign.campaign_type}</span>
                                </>
                              )}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(campaign.status)}>
                            {campaign.status}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleStatus(campaign)}
                            title={campaign.status === 'active' ? 'Pause' : 'Activate'}
                          >
                            {campaign.status === 'active' ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteCampaign(campaign.id)}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4 text-error-600" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Budget Progress */}
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-neutral-600 dark:text-neutral-400">Budget</span>
                          <span className="font-medium text-neutral-900 dark:text-neutral-100">
                            {formatCurrency(campaign.spent)} / {formatCurrency(campaign.budget)}
                          </span>
                        </div>
                        <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary-600 transition-all"
                            style={{ width: `${Math.min((campaign.spent / campaign.budget) * 100, 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Performance Metrics */}
                      <div className="grid grid-cols-6 gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                        <div className="text-center">
                          <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Impressions</p>
                          <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                            {formatNumber(campaign.impressions)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Clicks</p>
                          <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                            {formatNumber(campaign.clicks)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">CTR</p>
                          <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                            {ctr.toFixed(2)}%
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">Conversions</p>
                          <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                            {formatNumber(campaign.conversions)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">CPA</p>
                          <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                            {formatCurrency(cpa)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">ROI</p>
                          <p className={`text-lg font-bold ${roi >= 0 ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'}`}>
                            {roi.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <AddCampaignModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onCampaignAdded={loadCampaigns}
      />
    </div>
  );
}
