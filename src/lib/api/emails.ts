import { createClient } from '@/lib/supabase/client';

export interface Email {
  id: string;
  organization_id: string;

  // Email Details
  from_email: string;
  from_name: string | null;
  to_email: string;
  cc_emails: string[];
  bcc_emails: string[];

  subject: string;
  body: string | null;
  html_body: string | null;

  // Status & Flags
  status: 'inbox' | 'sent' | 'draft' | 'trash' | 'spam' | 'archived';
  is_read: boolean;
  is_starred: boolean;
  is_important: boolean;

  // Threading
  thread_id: string | null;
  in_reply_to: string | null;

  // Metadata
  sent_at: string | null;
  received_at: string;

  // Attachments
  has_attachments: boolean;
  attachment_count: number;

  // Tracking
  tags: string[];
  labels: string[];

  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateEmailInput {
  from_email: string;
  from_name?: string;
  to_email: string;
  cc_emails?: string[];
  bcc_emails?: string[];
  subject: string;
  body?: string;
  html_body?: string;
  status?: Email['status'];
  sent_at?: string;
  thread_id?: string;
  in_reply_to?: string;
  tags?: string[];
  labels?: string[];
}

export interface UpdateEmailInput extends Partial<CreateEmailInput> {
  id: string;
  is_read?: boolean;
  is_starred?: boolean;
  is_important?: boolean;
}

/**
 * Load all emails for an organization
 */
export async function loadEmails(organizationId: string): Promise<Email[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('emails')
    .select('*')
    .eq('organization_id', organizationId)
    .order('received_at', { ascending: false });

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
 * Create a new email
 */
export async function createEmail(
  organizationId: string,
  input: CreateEmailInput
): Promise<Email | null> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error('No user found');
    return null;
  }

  const { data, error } = await supabase
    .from('emails')
    .insert({
      organization_id: organizationId,
      ...input,
      cc_emails: input.cc_emails || [],
      bcc_emails: input.bcc_emails || [],
      tags: input.tags || [],
      labels: input.labels || [],
      is_read: false,
      is_starred: false,
      is_important: false,
      has_attachments: false,
      attachment_count: 0,
      created_by: user.id,
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
 * Mark email as read
 */
export async function markEmailAsRead(id: string): Promise<boolean> {
  const result = await updateEmail({ id, is_read: true });
  return result !== null;
}

/**
 * Mark email as unread
 */
export async function markEmailAsUnread(id: string): Promise<boolean> {
  const result = await updateEmail({ id, is_read: false });
  return result !== null;
}

/**
 * Toggle email starred status
 */
export async function toggleEmailStarred(id: string, starred: boolean): Promise<boolean> {
  const result = await updateEmail({ id, is_starred: starred });
  return result !== null;
}

/**
 * Move email to trash
 */
export async function moveEmailToTrash(id: string): Promise<boolean> {
  const result = await updateEmail({ id, status: 'trash' });
  return result !== null;
}

/**
 * Archive email
 */
export async function archiveEmail(id: string): Promise<boolean> {
  const result = await updateEmail({ id, status: 'archived' });
  return result !== null;
}

/**
 * Get emails by status
 */
export async function getEmailsByStatus(
  organizationId: string,
  status: Email['status']
): Promise<Email[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('emails')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('status', status)
    .order('received_at', { ascending: false });

  if (error) {
    console.error('Error loading emails by status:', error);
    return [];
  }

  return data || [];
}

/**
 * Get unread emails
 */
export async function getUnreadEmails(organizationId: string): Promise<Email[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('emails')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('is_read', false)
    .eq('status', 'inbox')
    .order('received_at', { ascending: false });

  if (error) {
    console.error('Error loading unread emails:', error);
    return [];
  }

  return data || [];
}

/**
 * Get starred emails
 */
export async function getStarredEmails(organizationId: string): Promise<Email[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('emails')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('is_starred', true)
    .order('received_at', { ascending: false });

  if (error) {
    console.error('Error loading starred emails:', error);
    return [];
  }

  return data || [];
}

/**
 * Search emails
 */
export async function searchEmails(
  organizationId: string,
  query: string
): Promise<Email[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('emails')
    .select('*')
    .eq('organization_id', organizationId)
    .or(
      `from_email.ilike.%${query}%,from_name.ilike.%${query}%,subject.ilike.%${query}%,body.ilike.%${query}%`
    )
    .order('received_at', { ascending: false });

  if (error) {
    console.error('Error searching emails:', error);
    return [];
  }

  return data || [];
}

/**
 * Get emails in a thread
 */
export async function getEmailThread(threadId: string): Promise<Email[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('emails')
    .select('*')
    .eq('thread_id', threadId)
    .order('received_at', { ascending: true });

  if (error) {
    console.error('Error loading email thread:', error);
    return [];
  }

  return data || [];
}

/**
 * Get email statistics
 */
export async function getEmailStats(organizationId: string) {
  const emails = await loadEmails(organizationId);

  const totalEmails = emails.length;
  const unreadCount = emails.filter((e) => !e.is_read && e.status === 'inbox').length;
  const starredCount = emails.filter((e) => e.is_starred).length;
  const draftCount = emails.filter((e) => e.status === 'draft').length;
  const inboxCount = emails.filter((e) => e.status === 'inbox').length;

  return {
    totalEmails,
    unreadCount,
    starredCount,
    draftCount,
    inboxCount,
  };
}
