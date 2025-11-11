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
    console.error('[Organization] No user found');
    return null;
  }

  console.log('[Organization] Current user ID:', user.id);

  // Get the first organization the user is a member of
  const { data: membership, error: membershipError } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .limit(1)
    .single();

  if (membershipError || !membership) {
    console.log('[Organization] No organization membership found, creating demo organization...');
    if (membershipError) {
      console.error('[Organization] Membership error:', membershipError);
    }

    // Try to create a demo organization for the user
    const demoOrg = await createDemoOrganization(user.id);
    if (demoOrg) {
      console.log('[Organization] Demo organization created successfully:', demoOrg.id);
    }
    return demoOrg;
  }

  console.log('[Organization] Found organization membership:', membership.organization_id);

  // Get the organization details
  const { data: organization, error: orgError } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', membership.organization_id)
    .single();

  if (orgError || !organization) {
    console.error('[Organization] Error loading organization:', orgError);
    return null;
  }

  console.log('[Organization] Organization loaded successfully:', organization.id);
  return organization;
}

/**
 * Create a demo organization for testing
 */
async function createDemoOrganization(userId: string): Promise<Organization | null> {
  const supabase = createClient();

  console.log('[CreateOrg] Creating organization for user:', userId);

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
    console.error('[CreateOrg] Error creating demo organization:', orgError);
    console.error('[CreateOrg] Error details:', JSON.stringify(orgError, null, 2));
    return null;
  }

  console.log('[CreateOrg] Organization created successfully:', organization.id);

  // Add user as owner
  const { error: memberError } = await supabase
    .from('organization_members')
    .insert({
      organization_id: organization.id,
      user_id: userId,
      role: 'owner',
    });

  if (memberError) {
    console.error('[CreateOrg] Error adding user to organization:', memberError);
    console.error('[CreateOrg] Error details:', JSON.stringify(memberError, null, 2));
    return null;
  }

  console.log('[CreateOrg] User added to organization successfully');

  return organization;
}

/**
 * Get organization ID (convenience function)
 */
export async function getCurrentOrganizationId(): Promise<string | null> {
  const org = await getCurrentOrganization();
  return org?.id || null;
}
