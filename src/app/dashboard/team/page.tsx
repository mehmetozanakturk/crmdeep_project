import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Mail } from 'lucide-react';

export default function TeamPage() {
  // TODO: Replace with real data from Supabase
  const teamMembers = [
    { name: 'Demo User', email: 'demo@crmdeep.com', role: 'Owner' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Team</h1>
          <p className="mt-1 text-neutral-600">Manage your team members and their roles</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </div>

      {/* Team Members List */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members ({teamMembers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers.map((member, index) => (
              <div key={index} className="flex items-center justify-between rounded-lg border border-neutral-200 p-4">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>
                      {member.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-neutral-900">{member.name}</p>
                    <p className="text-sm text-neutral-500">{member.email}</p>
                  </div>
                </div>
                <Badge>{member.role}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Invite Section */}
      <Card>
        <CardContent className="flex min-h-[200px] flex-col items-center justify-center">
          <Mail className="h-12 w-12 text-neutral-300" />
          <h3 className="mt-4 text-lg font-semibold text-neutral-900">Grow your team</h3>
          <p className="mt-2 max-w-sm text-center text-sm text-neutral-600">
            Invite team members to collaborate on brands, projects, and tasks. Assign roles and
            permissions to keep everything organized.
          </p>
          <Button className="mt-6">
            <Plus className="mr-2 h-4 w-4" />
            Send Invitation
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
