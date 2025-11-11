import { createClient } from '@/lib/supabase/client';

export interface Contact {
  id: string;
  organization_id: string;
  company_id: string | null;
  company_name: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  position: string | null;
  avatar_url: string | null;
  tags: string[];
  status: 'active' | 'inactive' | 'lead' | 'prospect' | 'client' | 'vip';
  linkedin_url: string | null;
  twitter_url: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  notes: string | null;
  last_contact_date: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateContactInput {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  position?: string;
  tags?: string[];
  status?: Contact['status'];
  notes?: string;
}

export interface UpdateContactInput extends Partial<CreateContactInput> {
  id: string;
}

/**
 * Load all contacts for an organization
 */
export async function loadContacts(organizationId: string): Promise<Contact[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading contacts:', error);
    return [];
  }

  return data || [];
}

/**
 * Get a single contact by ID
 */
export async function getContact(id: string): Promise<Contact | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error loading contact:', error);
    return null;
  }

  return data;
}

/**
 * Create a new contact
 */
export async function createContact(
  organizationId: string,
  input: CreateContactInput
): Promise<Contact | null> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error('No user found');
    return null;
  }

  const { data, error } = await supabase
    .from('contacts')
    .insert({
      organization_id: organizationId,
      name: input.name,
      email: input.email || null,
      phone: input.phone || null,
      position: input.position || null,
      tags: input.tags || [],
      status: input.status || 'active',
      notes: input.notes || null,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating contact:', error);
    return null;
  }

  return data;
}

/**
 * Update an existing contact
 */
export async function updateContact(input: UpdateContactInput): Promise<Contact | null> {
  const supabase = createClient();

  const { id, ...updates } = input;

  const { data, error } = await supabase
    .from('contacts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating contact:', error);
    return null;
  }

  return data;
}

/**
 * Delete a contact
 */
export async function deleteContact(id: string): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase.from('contacts').delete().eq('id', id);

  if (error) {
    console.error('Error deleting contact:', error);
    return false;
  }

  return true;
}

/**
 * Search contacts
 */
export async function searchContacts(
  organizationId: string,
  query: string
): Promise<Contact[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('organization_id', organizationId)
    .or(`name.ilike.%${query}%,email.ilike.%${query}%,position.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching contacts:', error);
    return [];
  }

  return data || [];
}
