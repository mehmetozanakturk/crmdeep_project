'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  created_at: string;
  updated_at: string;
}

interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  created_at: string;
}

export function useOrganization() {
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [memberRole, setMemberRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    try {
      setIsLoading(true);
      const supabase = createClient();

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsLoading(false);
        return;
      }

      // Try to get user's organization memberships
      const { data: memberships, error: membershipsError } = await supabase
        .from('organization_members')
        .select('*, organizations(*)')
        .eq('user_id', user.id);

      // If organization_members table doesn't exist or error, fallback to direct organizations query
      if (membershipsError) {
        console.log('organization_members error, falling back to organizations table:', membershipsError);

        // Fallback: Get all organizations (for now)
        const { data: orgs, error: orgsError } = await supabase
          .from('organizations')
          .select('*')
          .limit(1);

        if (orgsError) {
          console.error('Error loading organizations:', orgsError);
          // If organizations also fails, create a demo org
          await createDemoOrganization(user.id, supabase);
          setIsLoading(false);
          return;
        }

        if (orgs && orgs.length > 0) {
          setOrganizations(orgs);
          setCurrentOrganization(orgs[0]);
          setMemberRole('owner');
        } else {
          // No organizations exist, create a demo one
          await createDemoOrganization(user.id, supabase);
        }

        setIsLoading(false);
        return;
      }

      if (memberships && memberships.length > 0) {
        // Extract organizations from memberships
        const orgs = memberships.map((m: any) => m.organizations).filter(Boolean);
        setOrganizations(orgs);

        // Set current organization (first one by default)
        // In a real app, you might want to store the selected org in localStorage
        const storedOrgId = localStorage.getItem('currentOrganizationId');
        let currentOrg = orgs[0];

        if (storedOrgId) {
          const found = orgs.find((o: Organization) => o.id === storedOrgId);
          if (found) {
            currentOrg = found;
          }
        }

        setCurrentOrganization(currentOrg);

        // Set user's role in current organization
        const membership = memberships.find((m: any) => m.organization_id === currentOrg.id);
        setMemberRole(membership?.role || 'member');
      } else {
        // No memberships found, create a demo organization
        await createDemoOrganization(user.id, supabase);
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Error loading organizations:', err);
      setError(err as Error);
      setIsLoading(false);
    }
  };

  const createDemoOrganization = async (userId: string, supabase: any) => {
    try {
      console.log('Creating demo organization for user:', userId);

      // Create new organization
      const { data: newOrg, error: createError } = await supabase
        .from('organizations')
        .insert({
          name: 'My Organization',
          slug: `org-${userId.substring(0, 8)}-${Date.now()}`,
          owner_id: userId,
          subscription_plan: 'free',
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating organization:', createError);
        return;
      }

      if (newOrg) {
        console.log('Organization created successfully:', newOrg.id);

        // CRITICAL: Add user to organization_members table
        const { error: memberError } = await supabase
          .from('organization_members')
          .insert({
            organization_id: newOrg.id,
            user_id: userId,
            role: 'owner',
          });

        if (memberError) {
          console.error('Error adding user to organization_members:', memberError);
          // Even if this fails, we can still set the organization locally
        } else {
          console.log('User added to organization_members successfully');
        }

        setOrganizations([newOrg]);
        setCurrentOrganization(newOrg);
        setMemberRole('owner');
      }
    } catch (err) {
      console.error('Error in createDemoOrganization:', err);
    }
  };

  const switchOrganization = (organizationId: string) => {
    const org = organizations.find((o) => o.id === organizationId);
    if (org) {
      setCurrentOrganization(org);
      localStorage.setItem('currentOrganizationId', organizationId);

      // Update member role
      // You would need to fetch the membership info again here
      // For now, we'll just keep the current role
    }
  };

  const isOwner = memberRole === 'owner';
  const isAdmin = memberRole === 'admin' || memberRole === 'owner';

  return {
    currentOrganization,
    organizations,
    memberRole,
    isOwner,
    isAdmin,
    isLoading,
    error,
    switchOrganization,
    refetch: loadOrganizations,
  };
}
