'use client';

import Link from 'next/link';
import { Bell, Search, Sun, Moon, Menu } from 'lucide-react';
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
import { useTheme } from '@/components/theme-provider';
import { BrandSwitcher } from './BrandSwitcher';

interface HeaderProps {
  onMobileSidebarToggle: () => void;
}

export function Header({ onMobileSidebarToggle }: HeaderProps) {
  const { theme, setTheme } = useTheme();

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

          {/* Brand Switcher */}
          <div className="hidden lg:block">
            <BrandSwitcher />
          </div>

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
