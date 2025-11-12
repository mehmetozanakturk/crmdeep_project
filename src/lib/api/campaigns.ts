import { createClient } from '@/lib/supabase/client';

export interface Campaign {
  id: string;
  workspace_id: string;
  name: string;
  platform: 'meta' | 'google' | 'linkedin' | 'twitter';
  status: 'active' | 'paused' | 'completed' | 'draft';
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  start_date: string | null;
  end_date: string | null;
  external_id: string | null;
  external_data: any | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCampaignInput {
  name: string;
  platform: 'meta' | 'google' | 'linkedin' | 'twitter';
  status?: 'active' | 'paused' | 'completed' | 'draft';
  budget?: number;
  spent?: number;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  start_date?: string;
  end_date?: string;
  external_id?: string;
  external_data?: any;
}

export interface UpdateCampaignInput extends Partial<CreateCampaignInput> {
  id: string;
}

/**
 * Load all campaigns for a workspace
 */
export async function loadCampaigns(workspaceId: string): Promise<Campaign[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('workspace_id', workspaceId)
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
  workspaceId: string,
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
      workspace_id: workspaceId,
      ...input,
      status: input.status || 'draft',
      budget: input.budget || 0,
      spent: input.spent || 0,
      impressions: input.impressions || 0,
      clicks: input.clicks || 0,
      conversions: input.conversions || 0,
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
  workspaceId: string,
  query: string
): Promise<Campaign[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('workspace_id', workspaceId)
    .ilike('name', `%${query}%`)
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
  workspaceId: string,
  platform: 'meta' | 'google' | 'linkedin' | 'twitter'
): Promise<Campaign[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('workspace_id', workspaceId)
    .eq('platform', platform)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading platform campaigns:', error);
    return [];
  }

  return data || [];
}

/**
 * Get campaign statistics
 */
export async function getCampaignStats(workspaceId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('campaigns')
    .select('budget, spent, impressions, clicks, conversions, status, platform')
    .eq('workspace_id', workspaceId);

  if (error) {
    console.error('Error loading campaign stats:', error);
    return {
      totalBudget: 0,
      totalSpent: 0,
      totalImpressions: 0,
      totalClicks: 0,
      totalConversions: 0,
      active: 0,
      byPlatform: {
        meta: 0,
        google: 0,
        linkedin: 0,
        twitter: 0,
      },
    };
  }

  const stats = {
    totalBudget: data.reduce((sum, c) => sum + (c.budget || 0), 0),
    totalSpent: data.reduce((sum, c) => sum + (c.spent || 0), 0),
    totalImpressions: data.reduce((sum, c) => sum + (c.impressions || 0), 0),
    totalClicks: data.reduce((sum, c) => sum + (c.clicks || 0), 0),
    totalConversions: data.reduce((sum, c) => sum + (c.conversions || 0), 0),
    active: data.filter(c => c.status === 'active').length,
    byPlatform: {
      meta: data.filter(c => c.platform === 'meta').length,
      google: data.filter(c => c.platform === 'google').length,
      linkedin: data.filter(c => c.platform === 'linkedin').length,
      twitter: data.filter(c => c.platform === 'twitter').length,
    },
  };

  return stats;
}

/**
 * Sync campaign data from external platform
 */
export async function syncCampaignFromPlatform(
  campaignId: string,
  externalData: any
): Promise<Campaign | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('campaigns')
    .update({
      spent: externalData.spent || 0,
      impressions: externalData.impressions || 0,
      clicks: externalData.clicks || 0,
      conversions: externalData.conversions || 0,
      external_data: externalData,
    })
    .eq('id', campaignId)
    .select()
    .single();

  if (error) {
    console.error('Error syncing campaign:', error);
    return null;
  }

  return data;
}
