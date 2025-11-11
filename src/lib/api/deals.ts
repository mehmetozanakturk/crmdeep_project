import { createClient } from '@/lib/supabase/client';

export type DealStage = 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';

export interface Deal {
  id: string;
  organization_id: string;
  company_id: string | null;
  contact_id: string | null;
  title: string;
  description: string | null;
  value: number | null;
  currency: string;
  stage: DealStage;
  probability: number;
  expected_close_date: string | null;
  actual_close_date: string | null;
  assigned_to: string | null;
  tags: string[];
  notes: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateDealInput {
  title: string;
  description?: string;
  value?: number;
  currency?: string;
  stage?: DealStage;
  probability?: number;
  expected_close_date?: string;
  company_id?: string;
  contact_id?: string;
  assigned_to?: string;
  tags?: string[];
  notes?: string;
}

export interface UpdateDealInput extends Partial<CreateDealInput> {
  id: string;
}

/**
 * Load all deals for an organization
 */
export async function loadDeals(organizationId: string): Promise<Deal[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('deals')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading deals:', error);
    return [];
  }

  return data || [];
}

/**
 * Get a single deal by ID
 */
export async function getDeal(id: string): Promise<Deal | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('deals')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error loading deal:', error);
    return null;
  }

  return data;
}

/**
 * Create a new deal
 */
export async function createDeal(
  organizationId: string,
  input: CreateDealInput
): Promise<Deal | null> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error('No user found');
    return null;
  }

  const { data, error } = await supabase
    .from('deals')
    .insert({
      organization_id: organizationId,
      title: input.title,
      description: input.description || null,
      value: input.value || null,
      currency: input.currency || 'USD',
      stage: input.stage || 'lead',
      probability: input.probability || 0,
      expected_close_date: input.expected_close_date || null,
      company_id: input.company_id || null,
      contact_id: input.contact_id || null,
      assigned_to: input.assigned_to || user.id,
      tags: input.tags || [],
      notes: input.notes || null,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating deal:', error);
    return null;
  }

  return data;
}

/**
 * Update an existing deal
 */
export async function updateDeal(input: UpdateDealInput): Promise<Deal | null> {
  const supabase = createClient();

  const { id, ...updates } = input;

  const { data, error } = await supabase
    .from('deals')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating deal:', error);
    return null;
  }

  return data;
}

/**
 * Delete a deal
 */
export async function deleteDeal(id: string): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase.from('deals').delete().eq('id', id);

  if (error) {
    console.error('Error deleting deal:', error);
    return false;
  }

  return true;
}

/**
 * Get deals by stage (for pipeline view)
 */
export async function getDealsByStage(
  organizationId: string,
  stage: DealStage
): Promise<Deal[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('deals')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('stage', stage)
    .order('value', { ascending: false });

  if (error) {
    console.error('Error loading deals by stage:', error);
    return [];
  }

  return data || [];
}

/**
 * Search deals
 */
export async function searchDeals(organizationId: string, query: string): Promise<Deal[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('deals')
    .select('*')
    .eq('organization_id', organizationId)
    .or(`title.ilike.%${query}%,description.ilike.%${query}%,notes.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching deals:', error);
    return [];
  }

  return data || [];
}
