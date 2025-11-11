import { createClient } from '@/lib/supabase/client';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  logo_url: string | null;
  subscription_plan: 'free' | 'pro' | 'enterprise';
  created_at: string;
  updated_at: string;
}

/**
 * Get the current user's organization
 * Returns the first organization the user is a member of
 */
export async function getCurrentOrganization(): Promise<Organization | null> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error('No user found');
    return null;
  }

  // Get the first organization the user is a member of
  const { data: membership, error: membershipError } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .limit(1)
    .single();

  if (membershipError || !membership) {
    console.error('No organization membership found:', membershipError);

    // Try to create a demo organization for the user
    const demoOrg = await createDemoOrganization(user.id);
    return demoOrg;
  }

  // Get the organization details
  const { data: organization, error: orgError } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', membership.organization_id)
    .single();

  if (orgError || !organization) {
    console.error('Error loading organization:', orgError);
    return null;
  }

  return organization;
}

/**
 * Create a demo organization for testing
 */
async function createDemoOrganization(userId: string): Promise<Organization | null> {
  const supabase = createClient();

  // Create organization
  const { data: organization, error: orgError } = await supabase
    .from('organizations')
    .insert({
      name: 'My Organization',
      slug: `org-${userId.substring(0, 8)}`,
      owner_id: userId,
      subscription_plan: 'free',
    })
    .select()
    .single();

  if (orgError || !organization) {
    console.error('Error creating demo organization:', orgError);
    return null;
  }

  // Add user as owner
  const { error: memberError } = await supabase
    .from('organization_members')
    .insert({
      organization_id: organization.id,
      user_id: userId,
      role: 'owner',
    });

  if (memberError) {
    console.error('Error adding user to organization:', memberError);
    return null;
  }

  return organization;
}

/**
 * Get organization ID (convenience function)
 */
export async function getCurrentOrganizationId(): Promise<string | null> {
  const org = await getCurrentOrganization();
  return org?.id || null;
}
