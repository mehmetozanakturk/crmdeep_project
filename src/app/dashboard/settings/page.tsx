import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">Settings</h1>
        <p className="mt-1 text-neutral-600 dark:text-neutral-400">Manage your account and organization settings</p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Profile Settings */}
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardHeader>
            <CardTitle className="text-neutral-900 dark:text-neutral-100">Profile</CardTitle>
            <CardDescription className="text-neutral-600 dark:text-neutral-400">Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">DU</AvatarFallback>
              </Avatar>
              <Button variant="outline">Change Avatar</Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="name" className="text-neutral-700 dark:text-neutral-300">Full Name</Label>
                <Input id="name" defaultValue="Demo User" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="email" className="text-neutral-700 dark:text-neutral-300">Email</Label>
                <Input id="email" type="email" defaultValue="demo@crmdeep.com" className="mt-1" />
              </div>
            </div>

            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        {/* Organization Settings */}
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardHeader>
            <CardTitle className="text-neutral-900 dark:text-neutral-100">Organization</CardTitle>
            <CardDescription className="text-neutral-600 dark:text-neutral-400">Manage your organization details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="org-name" className="text-neutral-700 dark:text-neutral-300">Organization Name</Label>
              <Input id="org-name" defaultValue="My Company" className="mt-1" />
            </div>

            <div>
              <Label htmlFor="org-slug" className="text-neutral-700 dark:text-neutral-300">Organization Slug</Label>
              <Input id="org-slug" defaultValue="my-company" className="mt-1" />
              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                Used in URLs: crmdeep.com/org/my-company
              </p>
            </div>

            <Button>Update Organization</Button>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="border-neutral-200 dark:border-neutral-700">
          <CardHeader>
            <CardTitle className="text-neutral-900 dark:text-neutral-100">Security</CardTitle>
            <CardDescription className="text-neutral-600 dark:text-neutral-400">Manage your password and security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="current-password" className="text-neutral-700 dark:text-neutral-300">Current Password</Label>
              <Input id="current-password" type="password" className="mt-1" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="new-password" className="text-neutral-700 dark:text-neutral-300">New Password</Label>
                <Input id="new-password" type="password" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="confirm-password" className="text-neutral-700 dark:text-neutral-300">Confirm Password</Label>
                <Input id="confirm-password" type="password" className="mt-1" />
              </div>
            </div>

            <Button>Change Password</Button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-danger-200 dark:border-danger-800">
          <CardHeader>
            <CardTitle className="text-danger-600 dark:text-danger-400">Danger Zone</CardTitle>
            <CardDescription className="text-neutral-600 dark:text-neutral-400">Irreversible actions</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive">Delete Account</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
