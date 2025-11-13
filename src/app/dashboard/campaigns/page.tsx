'use client';

import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
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
  Edit2,
  Trash2,
  Play,
  Pause,
  X,
} from 'lucide-react';
import {
  loadCampaigns,
  getCampaignStats,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  type Campaign,
} from '@/lib/api/campaigns';
import { useOrganization } from '@/lib/hooks/useOrganization';

export default function CampaignsPage() {
  const { currentOrganization } = useOrganization();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [stats, setStats] = useState({
    totalBudget: 0,
    totalSpent: 0,
    totalImpressions: 0,
    totalClicks: 0,
    totalConversions: 0,
    avgROI: 0,
    avgCTR: 0,
    avgCPA: 0,
    avgCVR: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    platform: 'meta' as Campaign['platform'],
    budget: '',
    status: 'draft' as Campaign['status'],
    campaign_type: 'awareness' as Campaign['campaign_type'],
    ad_copy: '',
    landing_page_url: '',
  });

  const loadData = useCallback(async () => {
    if (!currentOrganization) return;

    setIsLoading(true);
    const [campaignsData, statsData] = await Promise.all([
      loadCampaigns(currentOrganization.id),
      getCampaignStats(currentOrganization.id),
    ]);
    setCampaigns(campaignsData);
    setStats(statsData);
    setIsLoading(false);
  }, [currentOrganization]);

  const filterCampaigns = useCallback(() => {
    if (selectedPlatform === 'all') {
      setFilteredCampaigns(campaigns);
    } else {
      setFilteredCampaigns(campaigns.filter((c) => c.platform === selectedPlatform));
    }
  }, [campaigns, selectedPlatform]);

  useEffect(() => {
    if (currentOrganization) {
      loadData();
    }
  }, [currentOrganization, loadData]);

  useEffect(() => {
    filterCampaigns();
  }, [filterCampaigns]);

  const handleCreateCampaign = async () => {
    if (!currentOrganization) return;
    if (!formData.name || !formData.budget) {
      alert('Please fill in required fields');
      return;
    }

    const newCampaign = await createCampaign(currentOrganization.id, {
      name: formData.name,
      platform: formData.platform,
      budget: parseFloat(formData.budget),
      status: formData.status,
      campaign_type: formData.campaign_type,
      ad_copy: formData.ad_copy,
      landing_page_url: formData.landing_page_url,
    });

    if (newCampaign) {
      await loadData();
      setIsCreateDialogOpen(false);
      resetForm();
    }
  };

  const handleEditCampaign = async () => {
    if (!editingCampaign) return;

    const updated = await updateCampaign({
      id: editingCampaign.id,
      name: formData.name,
      platform: formData.platform,
      budget: parseFloat(formData.budget),
      status: formData.status,
      campaign_type: formData.campaign_type,
      ad_copy: formData.ad_copy,
      landing_page_url: formData.landing_page_url,
    });

    if (updated) {
      await loadData();
      setIsEditDialogOpen(false);
      setEditingCampaign(null);
      resetForm();
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;

    const success = await deleteCampaign(id);
    if (success) {
      await loadData();
    }
  };

  const handleToggleStatus = async (campaign: Campaign) => {
    const newStatus = campaign.status === 'active' ? 'paused' : 'active';
    await updateCampaign({
      id: campaign.id,
      status: newStatus,
    });
    await loadData();
  };

  const openEditDialog = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setFormData({
      name: campaign.name,
      platform: campaign.platform,
      budget: campaign.budget.toString(),
      status: campaign.status,
      campaign_type: campaign.campaign_type || 'awareness',
      ad_copy: campaign.ad_copy || '',
      landing_page_url: campaign.landing_page_url || '',
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      platform: 'meta',
      budget: '',
      status: 'draft',
      campaign_type: 'awareness',
      ad_copy: '',
      landing_page_url: '',
    });
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
        <Button onClick={() => setIsCreateDialogOpen(true)}>
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
                  {stats.avgROI.toFixed(1)}%
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
                <p className="text-xs text-neutral-500 mt-1">{stats.avgCTR.toFixed(2)}% CTR</p>
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
                <p className="text-xs text-neutral-500 mt-1">{stats.avgCVR.toFixed(2)}% CVR</p>
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
            <div className="text-center py-12">
              <p className="text-neutral-600 dark:text-neutral-400">Loading campaigns...</p>
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
                <Button onClick={() => setIsCreateDialogOpen(true)}>
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
                            onClick={() => openEditDialog(campaign)}
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
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

      {/* Create Campaign Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
            <DialogDescription>
              Set up a new advertising campaign
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Campaign Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Summer Sale 2024"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="platform">Platform *</Label>
                <Select
                  value={formData.platform}
                  onValueChange={(value: Campaign['platform']) => setFormData({ ...formData, platform: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meta">Meta Ads (Facebook/Instagram)</SelectItem>
                    <SelectItem value="google">Google Ads</SelectItem>
                    <SelectItem value="linkedin">LinkedIn Ads</SelectItem>
                    <SelectItem value="twitter">Twitter Ads</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget (USD) *</Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="1000"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: Campaign['status']) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="campaign_type">Campaign Type</Label>
                <Select
                  value={formData.campaign_type}
                  onValueChange={(value) => setFormData({ ...formData, campaign_type: value as Campaign['campaign_type'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="awareness">Awareness</SelectItem>
                    <SelectItem value="consideration">Consideration</SelectItem>
                    <SelectItem value="conversion">Conversion</SelectItem>
                    <SelectItem value="remarketing">Remarketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ad_copy">Ad Copy</Label>
              <Textarea
                id="ad_copy"
                placeholder="Write your ad copy here..."
                value={formData.ad_copy}
                onChange={(e) => setFormData({ ...formData, ad_copy: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="landing_page_url">Landing Page URL</Label>
              <Input
                id="landing_page_url"
                type="url"
                placeholder="https://example.com/landing"
                value={formData.landing_page_url}
                onChange={(e) => setFormData({ ...formData, landing_page_url: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCampaign}>Create Campaign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Campaign Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Campaign</DialogTitle>
            <DialogDescription>
              Update campaign details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Campaign Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-platform">Platform *</Label>
                <Select
                  value={formData.platform}
                  onValueChange={(value: Campaign['platform']) => setFormData({ ...formData, platform: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meta">Meta Ads</SelectItem>
                    <SelectItem value="google">Google Ads</SelectItem>
                    <SelectItem value="linkedin">LinkedIn Ads</SelectItem>
                    <SelectItem value="twitter">Twitter Ads</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-budget">Budget (USD) *</Label>
                <Input
                  id="edit-budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: Campaign['status']) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-campaign_type">Campaign Type</Label>
                <Select
                  value={formData.campaign_type}
                  onValueChange={(value) => setFormData({ ...formData, campaign_type: value as Campaign['campaign_type'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="awareness">Awareness</SelectItem>
                    <SelectItem value="consideration">Consideration</SelectItem>
                    <SelectItem value="conversion">Conversion</SelectItem>
                    <SelectItem value="remarketing">Remarketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-ad_copy">Ad Copy</Label>
              <Textarea
                id="edit-ad_copy"
                value={formData.ad_copy}
                onChange={(e) => setFormData({ ...formData, ad_copy: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-landing_page_url">Landing Page URL</Label>
              <Input
                id="edit-landing_page_url"
                type="url"
                value={formData.landing_page_url}
                onChange={(e) => setFormData({ ...formData, landing_page_url: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditCampaign}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
