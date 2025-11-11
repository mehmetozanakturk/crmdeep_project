import { createClient } from '@/lib/supabase/client';

export interface Company {
  id: string;
  organization_id: string;
  name: string;
  industry: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postal_code: string | null;
  employee_count: string | null;
  annual_revenue: string | null;
  logo_url: string | null;
  description: string | null;
  tags: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCompanyInput {
  name: string;
  industry?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  employee_count?: string;
  annual_revenue?: string;
  description?: string;
  tags?: string[];
}

export interface UpdateCompanyInput extends Partial<CreateCompanyInput> {
  id: string;
}

/**
 * Load all companies for an organization
 */
export async function loadCompanies(organizationId: string): Promise<Company[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('organization_id', organizationId)
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
  organizationId: string,
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
      organization_id: organizationId,
      ...input,
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
  organizationId: string,
  query: string
): Promise<Company[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('organization_id', organizationId)
    .or(`name.ilike.%${query}%,industry.ilike.%${query}%,description.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching companies:', error);
    return [];
  }

  return data || [];
}
