'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, Search, Sun, Moon, Menu, Building2, ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTheme } from '@/components/theme-provider';

interface HeaderProps {
  onMobileSidebarToggle: () => void;
}

interface Workspace {
  id: string;
  name: string;
  domain: string;
  color: string;
}

export function Header({ onMobileSidebarToggle }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspace, setActiveWorkspace] = useState<string>('');

  // Load workspaces from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('crmdeep_workspaces');
    if (stored) {
      const ws = JSON.parse(stored);
      setWorkspaces(ws);
    } else {
      // Default workspaces
      const defaultWorkspaces: Workspace[] = [
        { id: '1', name: 'RendxAI', domain: 'rendxai.com', color: '#3B82F6' },
        { id: '2', name: 'AllMediaI', domain: 'allmediai.com', color: '#10B981' },
        { id: '3', name: 'AutoMexus', domain: 'automexus.com', color: '#8B5CF6' },
      ];
      setWorkspaces(defaultWorkspaces);
      localStorage.setItem('crmdeep_workspaces', JSON.stringify(defaultWorkspaces));
    }

    // Load active workspace
    const active = localStorage.getItem('crmdeep_active_workspace');
    if (active) {
      setActiveWorkspace(active);
    } else {
      setActiveWorkspace('1'); // Default to first workspace
      localStorage.setItem('crmdeep_active_workspace', '1');
    }
  }, []);

  const handleWorkspaceChange = (workspaceId: string) => {
    setActiveWorkspace(workspaceId);
    localStorage.setItem('crmdeep_active_workspace', workspaceId);
    // Trigger global event for other components to reload
    window.dispatchEvent(new Event('workspaceChanged'));
    // Reload page to refresh all data
    window.location.reload();
  };

  // TODO: Replace with real user data from Supabase
  const user = {
    name: 'Demo User',
    email: 'demo@crmdeep.com',
    avatar: '',
  };

  const handleLogout = () => {
    // TODO: Implement Supabase logout
    console.log('Logout');
    window.location.href = '/login';
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const currentWorkspace = workspaces.find(w => w.id === activeWorkspace);

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Left: Hamburger Menu (Mobile) + Logo + Search */}
        <div className="flex items-center gap-3 lg:gap-6">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileSidebarToggle}
            className="lg:hidden text-neutral-700 dark:text-neutral-300"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <Link href="/dashboard" className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">CRMDeep</h1>
          </Link>

          {/* Workspace Switcher */}
          {currentWorkspace && (
            <div className="hidden lg:block">
              <Select value={activeWorkspace} onValueChange={handleWorkspaceChange}>
                <SelectTrigger className="w-[200px] h-9 border-neutral-300 dark:border-neutral-600">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: currentWorkspace.color }}
                    />
                    <div className="flex flex-col items-start">
                      <span className="text-xs font-semibold">{currentWorkspace.name}</span>
                      <span className="text-[10px] text-neutral-500 dark:text-neutral-400">{currentWorkspace.domain}</span>
                    </div>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {workspaces.map((workspace) => (
                    <SelectItem key={workspace.id} value={workspace.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: workspace.color }}
                        />
                        <div className="flex flex-col">
                          <span className="font-medium">{workspace.name}</span>
                          <span className="text-xs text-neutral-500">{workspace.domain}</span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                  <DropdownMenuSeparator />
                  <SelectItem value="manage" disabled>
                    <Link href="/dashboard/workspaces" className="text-primary-600 dark:text-primary-400">
                      ⚙️ Manage Workspaces
                    </Link>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Search Bar */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-64 pl-10"
            />
          </div>
        </div>

        {/* Right: Theme Toggle, Notifications and User Menu */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative text-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800">
            <Bell className="h-5 w-5" />
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
              3
            </Badge>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex cursor-pointer items-center gap-2 lg:gap-3 rounded-lg px-2 lg:px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>
                    {user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden text-left lg:block">
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{user.name}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{user.email}</p>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => (window.location.href = '/dashboard/settings')}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => (window.location.href = '/dashboard/team')}>
                Team
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-danger-600">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
