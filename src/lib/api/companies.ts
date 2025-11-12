import { createClient } from '@/lib/supabase/client';

export interface Company {
  id: string;
  workspace_id: string;
  name: string;
  logo?: string;
  industry: string | null;
  size: string | null;
  revenue: string | null;
  location: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  contacts: number;
  deals: number;
  status: 'active' | 'prospect' | 'inactive';
  priority: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
  description: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCompanyInput {
  name: string;
  logo?: string;
  industry?: string;
  size?: string;
  revenue?: string;
  location?: string;
  website?: string;
  email?: string;
  phone?: string;
  contacts?: number;
  deals?: number;
  status?: 'active' | 'prospect' | 'inactive';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  tags?: string[];
  description?: string;
}

export interface UpdateCompanyInput extends Partial<CreateCompanyInput> {
  id: string;
}

/**
 * Load all companies for a workspace
 */
export async function loadCompanies(workspaceId: string): Promise<Company[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading companies:', error);
    return [];
  }

  return data || [];
}

/**
 * Get a single company by ID
 */
export async function getCompany(id: string): Promise<Company | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error loading company:', error);
    return null;
  }

  return data;
}

/**
 * Create a new company
 */
export async function createCompany(
  workspaceId: string,
  input: CreateCompanyInput
): Promise<Company | null> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error('No user found');
    return null;
  }

  const { data, error } = await supabase
    .from('companies')
    .insert({
      workspace_id: workspaceId,
      ...input,
      status: input.status || 'prospect',
      priority: input.priority || 'medium',
      contacts: input.contacts || 0,
      deals: input.deals || 0,
      tags: input.tags || [],
      created_by: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating company:', error);
    return null;
  }

  return data;
}

/**
 * Update an existing company
 */
export async function updateCompany(input: UpdateCompanyInput): Promise<Company | null> {
  const supabase = createClient();

  const { id, ...updates } = input;

  const { data, error } = await supabase
    .from('companies')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating company:', error);
    return null;
  }

  return data;
}

/**
 * Delete a company
 */
export async function deleteCompany(id: string): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase.from('companies').delete().eq('id', id);

  if (error) {
    console.error('Error deleting company:', error);
    return false;
  }

  return true;
}

/**
 * Search companies
 */
export async function searchCompanies(
  workspaceId: string,
  query: string
): Promise<Company[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('workspace_id', workspaceId)
    .or(`name.ilike.%${query}%,industry.ilike.%${query}%,description.ilike.%${query}%,location.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching companies:', error);
    return [];
  }

  return data || [];
}

/**
 * Get company statistics
 */
export async function getCompanyStats(workspaceId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('companies')
    .select('status, contacts, deals')
    .eq('workspace_id', workspaceId);

  if (error) {
    console.error('Error loading company stats:', error);
    return {
      total: 0,
      active: 0,
      prospect: 0,
      inactive: 0,
      totalContacts: 0,
      totalDeals: 0,
    };
  }

  const stats = {
    total: data.length,
    active: data.filter(c => c.status === 'active').length,
    prospect: data.filter(c => c.status === 'prospect').length,
    inactive: data.filter(c => c.status === 'inactive').length,
    totalContacts: data.reduce((sum, c) => sum + (c.contacts || 0), 0),
    totalDeals: data.reduce((sum, c) => sum + (c.deals || 0), 0),
  };

  return stats;
}
