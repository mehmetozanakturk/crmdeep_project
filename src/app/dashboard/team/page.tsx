'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Shield, UserCheck, Mail, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { InviteMemberModal } from '@/components/team/InviteMemberModal';
import { EditMemberModal } from '@/components/team/EditMemberModal';
import { useOrganization } from '@/lib/hooks/useOrganization';
import { createClient } from '@/lib/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TeamMember {
  id: string;
  user_id: string;
  organization_id: string;
  role: string;
  created_at: string;
  full_name: string | null;
  email: string;
  avatar_url: string | null;
}

export default function TeamPage() {
  const { currentOrganization } = useOrganization();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMembers();
  }, [currentOrganization]);

  const loadMembers = async () => {
    if (!currentOrganization) return;

    setLoading(true);
    try {
      const supabase = createClient();

      // Join organization_members with profiles to get user information
      const { data, error } = await supabase
        .from('organization_members')
        .select(`
          id,
          user_id,
          organization_id,
          role,
          created_at,
          profiles:user_id (
            full_name,
            avatar_url,
            email
          )
        `)
        .eq('organization_id', currentOrganization.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map the data to include all profile information
      const membersWithProfile = (data || []).map((member: any) => ({
        id: member.id,
        user_id: member.user_id,
        organization_id: member.organization_id,
        role: member.role,
        created_at: member.created_at,
        full_name: member.profiles?.full_name || null,
        email: member.profiles?.email || 'Unknown',
        avatar_url: member.profiles?.avatar_url || null,
      }));

      setMembers(membersWithProfile);
    } catch (error) {
      console.error('Error loading members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, memberName: string) => {
    if (!confirm(`Are you sure you want to remove ${memberName} from the team?`)) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('organization_members')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadMembers();
    } catch (error) {
      console.error('Error removing member:', error);
      alert('Error removing team member');
    }
  };

  const handleEditClick = (member: TeamMember) => {
    setSelectedMember(member);
    setEditModalOpen(true);
  };

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return email.charAt(0).toUpperCase();
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400';
      case 'admin':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      default:
        return 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400';
    }
  };

  const totalMembers = members.length;
  const totalAdmins = members.filter(m => m.role === 'admin').length;
  const totalOwners = members.filter(m => m.role === 'owner').length;
  const totalRegularMembers = members.filter(m => m.role === 'member').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Team</h1>
          <p className="mt-1 text-neutral-600 dark:text-neutral-400">Manage your team members and their roles</p>
        </div>
        <Button onClick={() => setInviteModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Total Members</p>
                <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-neutral-100">{totalMembers}</p>
              </div>
              <Users className="h-8 w-8 text-primary-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Owners</p>
                <p className="mt-1 text-2xl font-bold text-primary-600 dark:text-primary-400">{totalOwners}</p>
              </div>
              <Shield className="h-8 w-8 text-primary-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Admins</p>
                <p className="mt-1 text-2xl font-bold text-purple-600 dark:text-purple-400">{totalAdmins}</p>
              </div>
              <UserCheck className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Regular Members</p>
                <p className="mt-1 text-2xl font-bold text-neutral-600 dark:text-neutral-400">{totalRegularMembers}</p>
              </div>
              <Users className="h-8 w-8 text-neutral-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Members List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-neutral-600 dark:text-neutral-400">Loading team members...</p>
          </div>
        </div>
      ) : members.length === 0 ? (
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardContent className="flex min-h-[200px] flex-col items-center justify-center">
            <Mail className="h-12 w-12 text-neutral-300 dark:text-neutral-600" />
            <h3 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">No team members yet</h3>
            <p className="mt-2 max-w-sm text-center text-sm text-neutral-600 dark:text-neutral-400">
              Invite team members to collaborate on brands, projects, and tasks. Assign roles and
              permissions to keep everything organized.
            </p>
            <Button className="mt-6" onClick={() => setInviteModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Send Invitation
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardHeader>
            <CardTitle className="text-neutral-900 dark:text-neutral-100">Team Members ({members.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between rounded-lg border border-neutral-200 dark:border-neutral-700 p-4">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback className="bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                        {getInitials(member.full_name, member.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-neutral-900 dark:text-neutral-100">
                        {member.full_name || member.email}
                      </p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getRoleBadgeClass(member.role)}>
                      {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditClick(member)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Change Role
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(member.id, member.full_name || member.email)}
                          className="text-danger-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <InviteMemberModal
        open={inviteModalOpen}
        onOpenChange={setInviteModalOpen}
        onMemberInvited={loadMembers}
      />

      <EditMemberModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        member={selectedMember}
        onMemberUpdated={loadMembers}
      />
    </div>
  );
}
