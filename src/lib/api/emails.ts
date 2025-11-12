import { createClient } from '@/lib/supabase/client';

export interface Email {
  id: string;
  workspace_id: string;
  from_email: string;
  from_name: string | null;
  to_email: string;
  to_name: string | null;
  subject: string;
  body: string | null;
  html_body: string | null;
  is_read: boolean;
  is_starred: boolean;
  is_archived: boolean;
  thread_id: string | null;
  company_id: string | null;
  contact_id: string | null;
  attachments: any[];
  metadata: any | null;
  created_at: string;
  updated_at: string;
}

export interface CreateEmailInput {
  from_email: string;
  from_name?: string;
  to_email: string;
  to_name?: string;
  subject: string;
  body?: string;
  html_body?: string;
  thread_id?: string;
  company_id?: string;
  contact_id?: string;
  attachments?: any[];
  metadata?: any;
}

export interface UpdateEmailInput extends Partial<CreateEmailInput> {
  id: string;
  is_read?: boolean;
  is_starred?: boolean;
  is_archived?: boolean;
}

/**
 * Load all emails for a workspace
 */
export async function loadEmails(workspaceId: string): Promise<Email[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('emails')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading emails:', error);
    return [];
  }

  return data || [];
}

/**
 * Get a single email by ID
 */
export async function getEmail(id: string): Promise<Email | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('emails')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error loading email:', error);
    return null;
  }

  return data;
}

/**
 * Create a new email (for storing received emails)
 */
export async function createEmail(
  workspaceId: string,
  input: CreateEmailInput
): Promise<Email | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('emails')
    .insert({
      workspace_id: workspaceId,
      ...input,
      is_read: false,
      is_starred: false,
      is_archived: false,
      attachments: input.attachments || [],
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating email:', error);
    return null;
  }

  return data;
}

/**
 * Update an existing email
 */
export async function updateEmail(input: UpdateEmailInput): Promise<Email | null> {
  const supabase = createClient();

  const { id, ...updates } = input;

  const { data, error } = await supabase
    .from('emails')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating email:', error);
    return null;
  }

  return data;
}

/**
 * Delete an email
 */
export async function deleteEmail(id: string): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase.from('emails').delete().eq('id', id);

  if (error) {
    console.error('Error deleting email:', error);
    return false;
  }

  return true;
}

/**
 * Search emails
 */
export async function searchEmails(
  workspaceId: string,
  query: string
): Promise<Email[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('emails')
    .select('*')
    .eq('workspace_id', workspaceId)
    .or(`subject.ilike.%${query}%,body.ilike.%${query}%,from_email.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching emails:', error);
    return [];
  }

  return data || [];
}

/**
 * Get unread emails
 */
export async function getUnreadEmails(workspaceId: string): Promise<Email[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('emails')
    .select('*')
    .eq('workspace_id', workspaceId)
    .eq('is_read', false)
    .eq('is_archived', false)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading unread emails:', error);
    return [];
  }

  return data || [];
}

/**
 * Get starred emails
 */
export async function getStarredEmails(workspaceId: string): Promise<Email[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('emails')
    .select('*')
    .eq('workspace_id', workspaceId)
    .eq('is_starred', true)
    .eq('is_archived', false)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading starred emails:', error);
    return [];
  }

  return data || [];
}

/**
 * Mark email as read
 */
export async function markAsRead(id: string): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from('emails')
    .update({ is_read: true })
    .eq('id', id);

  if (error) {
    console.error('Error marking email as read:', error);
    return false;
  }

  return true;
}

/**
 * Toggle star on email
 */
export async function toggleStar(id: string, starred: boolean): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from('emails')
    .update({ is_starred: starred })
    .eq('id', id);

  if (error) {
    console.error('Error toggling star:', error);
    return false;
  }

  return true;
}

/**
 * Archive email
 */
export async function archiveEmail(id: string): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from('emails')
    .update({ is_archived: true })
    .eq('id', id);

  if (error) {
    console.error('Error archiving email:', error);
    return false;
  }

  return true;
}

/**
 * Get emails by thread
 */
export async function getEmailThread(
  workspaceId: string,
  threadId: string
): Promise<Email[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('emails')
    .select('*')
    .eq('workspace_id', workspaceId)
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error loading email thread:', error);
    return [];
  }

  return data || [];
}

/**
 * Get email statistics
 */
export async function getEmailStats(workspaceId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('emails')
    .select('is_read, is_starred, is_archived')
    .eq('workspace_id', workspaceId);

  if (error) {
    console.error('Error loading email stats:', error);
    return {
      total: 0,
      unread: 0,
      starred: 0,
      archived: 0,
    };
  }

  const stats = {
    total: data.length,
    unread: data.filter(e => !e.is_read && !e.is_archived).length,
    starred: data.filter(e => e.is_starred && !e.is_archived).length,
    archived: data.filter(e => e.is_archived).length,
  };

  return stats;
}
