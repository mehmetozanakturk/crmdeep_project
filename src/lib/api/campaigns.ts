import { createClient } from '@/lib/supabase/client';

export interface Campaign {
  id: string;
  organization_id: string;
  name: string;
  platform: 'meta' | 'google' | 'linkedin' | 'twitter' | 'other';
  status: 'draft' | 'active' | 'paused' | 'completed' | 'archived';
  campaign_type?: 'awareness' | 'consideration' | 'conversion' | 'remarketing';

  // Budget & Spend
  budget: number;
  spent: number;
  currency: string;

  // Performance Metrics
  impressions: number;
  clicks: number;
  conversions: number;
  reach: number;

  // Date Management
  start_date: string | null;
  end_date: string | null;

  // Targeting & Creative
  target_audience?: any; // JSONB
  creative_assets?: string[];
  ad_copy?: string | null;
  call_to_action?: string | null;
  landing_page_url?: string | null;

  // Tracking
  tags?: string[];
  notes?: string | null;

  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCampaignInput {
  name: string;
  platform: Campaign['platform'];
  status?: Campaign['status'];
  campaign_type?: Campaign['campaign_type'];
  budget?: number;
  start_date?: string;
  end_date?: string;
  ad_copy?: string;
  target_audience?: any;
  creative_assets?: string[];
  call_to_action?: string;
  landing_page_url?: string;
  tags?: string[];
  notes?: string;
}

export interface UpdateCampaignInput extends Partial<CreateCampaignInput> {
  id: string;
  spent?: number;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  reach?: number;
}

/**
 * Load all campaigns for an organization
 */
export async function loadCampaigns(organizationId: string): Promise<Campaign[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading campaigns:', error);
    return [];
  }

  return data || [];
}

/**
 * Get a single campaign by ID
 */
export async function getCampaign(id: string): Promise<Campaign | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error loading campaign:', error);
    return null;
  }

  return data;
}

/**
 * Create a new campaign
 */
export async function createCampaign(
  organizationId: string,
  input: CreateCampaignInput
): Promise<Campaign | null> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error('No user found');
    return null;
  }

  const { data, error } = await supabase
    .from('campaigns')
    .insert({
      organization_id: organizationId,
      ...input,
      budget: input.budget || 0,
      spent: 0,
      impressions: 0,
      clicks: 0,
      conversions: 0,
      reach: 0,
      currency: 'TRY',
      tags: input.tags || [],
      created_by: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating campaign:', error);
    return null;
  }

  return data;
}

/**
 * Update an existing campaign
 */
export async function updateCampaign(input: UpdateCampaignInput): Promise<Campaign | null> {
  const supabase = createClient();

  const { id, ...updates } = input;

  const { data, error } = await supabase
    .from('campaigns')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating campaign:', error);
    return null;
  }

  return data;
}

/**
 * Delete a campaign
 */
export async function deleteCampaign(id: string): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase.from('campaigns').delete().eq('id', id);

  if (error) {
    console.error('Error deleting campaign:', error);
    return false;
  }

  return true;
}

/**
 * Search campaigns
 */
export async function searchCampaigns(
  organizationId: string,
  query: string
): Promise<Campaign[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('organization_id', organizationId)
    .or(`name.ilike.%${query}%,ad_copy.ilike.%${query}%,notes.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching campaigns:', error);
    return [];
  }

  return data || [];
}

/**
 * Get campaigns by platform
 */
export async function getCampaignsByPlatform(
  organizationId: string,
  platform: Campaign['platform']
): Promise<Campaign[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('platform', platform)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading campaigns by platform:', error);
    return [];
  }

  return data || [];
}

/**
 * Get campaigns by status
 */
export async function getCampaignsByStatus(
  organizationId: string,
  status: Campaign['status']
): Promise<Campaign[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading campaigns by status:', error);
    return [];
  }

  return data || [];
}

/**
 * Calculate campaign stats for an organization
 */
export async function getCampaignStats(organizationId: string) {
  const campaigns = await loadCampaigns(organizationId);

  const totalSpent = campaigns.reduce((sum, c) => sum + (c.spent || 0), 0);
  const totalBudget = campaigns.reduce((sum, c) => sum + (c.budget || 0), 0);
  const totalImpressions = campaigns.reduce((sum, c) => sum + (c.impressions || 0), 0);
  const totalClicks = campaigns.reduce((sum, c) => sum + (c.clicks || 0), 0);
  const totalConversions = campaigns.reduce((sum, c) => sum + (c.conversions || 0), 0);

  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const completedCampaigns = campaigns.filter(c => c.status === 'completed').length;

  const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const avgCPA = totalConversions > 0 ? totalSpent / totalConversions : 0;
  const avgCVR = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

  return {
    totalCampaigns: campaigns.length,
    activeCampaigns,
    completedCampaigns,
    totalSpent,
    totalBudget,
    totalImpressions,
    totalClicks,
    totalConversions,
    avgCTR,
    avgCPA,
    avgCVR,
  };
}
