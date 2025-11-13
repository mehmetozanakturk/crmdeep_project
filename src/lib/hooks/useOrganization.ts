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

      // Get user's organization memberships
      const { data: memberships, error: membershipsError } = await supabase
        .from('organization_members')
        .select('*, organizations(*)')
        .eq('user_id', user.id);

      if (membershipsError) {
        throw membershipsError;
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
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Error loading organizations:', err);
      setError(err as Error);
      setIsLoading(false);
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
