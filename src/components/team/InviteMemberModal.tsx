'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useOrganization } from '@/lib/hooks/useOrganization';
import { createClient } from '@/lib/supabase/client';

interface InviteMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMemberInvited: () => void;
}

export function InviteMemberModal({ open, onOpenChange, onMemberInvited }: InviteMemberModalProps) {
  const { currentOrganization } = useOrganization();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    role: 'member',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOrganization) return;

    setLoading(true);
    try {
      const supabase = createClient();

      // First, check if user exists by email
      const { data: existingUser, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', formData.email)
        .single();

      // For now, we'll just create a pending invitation record
      // In a production app, you'd send an email invitation
      // and handle user signup/acceptance separately

      // Check if user already exists in the organization
      const { data: existingMember } = await supabase
        .from('organization_members')
        .select('id')
        .eq('organization_id', currentOrganization.id)
        .eq('user_id', formData.email)
        .single();

      if (existingMember) {
        alert('This user is already a member of this organization');
        return;
      }

      // For demo purposes, we'll show a message that invitation would be sent
      // In production, you'd integrate with an email service
      alert(`Invitation email would be sent to ${formData.email} with role: ${formData.role}\n\nNote: In production, this would send an actual email invitation.`);

      onMemberInvited();
      onOpenChange(false);
      setFormData({
        email: '',
        role: 'member',
      });
    } catch (error) {
      console.error('Error inviting member:', error);
      alert('Error sending invitation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            Send an invitation to join your organization. They will receive an email with instructions.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="colleague@example.com"
            />
          </div>

          <div>
            <Label htmlFor="role">Role</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="owner">Owner</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Members can view and edit. Admins can manage team members. Owners have full control.
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Invitation'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
