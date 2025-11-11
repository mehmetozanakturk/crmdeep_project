'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { CRM_MODULES, getDefaultPinnedModules, type CRMModule, getModuleByKey } from '@/lib/modules';
import { Settings, Menu } from 'lucide-react';
import { loadMenuPreferences, initializeDefaultMenu } from '@/lib/api/menu-preferences';

export function Sidebar() {
  const pathname = usePathname();
  const [pinnedModules, setPinnedModules] = useState<CRMModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMenu() {
      try {
        // TODO: Get actual organization ID from context/props
        const organizationId = 'temp-org-id'; // Temporary mock

        // Load preferences from Supabase
        const preferences = await loadMenuPreferences(organizationId);

        if (preferences.length === 0) {
          // No preferences found, initialize defaults
          await initializeDefaultMenu(organizationId);
          // Use default modules
          setPinnedModules(getDefaultPinnedModules());
        } else {
          // Map preferences to modules
          const modules = preferences
            .map((pref) => getModuleByKey(pref.module_key))
            .filter((m): m is CRMModule => m !== undefined);
          setPinnedModules(modules);
        }
      } catch (error) {
        console.error('Error loading menu:', error);
        // Fallback to defaults
        setPinnedModules(getDefaultPinnedModules());
      } finally {
        setIsLoading(false);
      }
    }

    loadMenu();
  }, []);

  return (
    <aside className="flex h-full w-64 flex-col border-r border-neutral-200 bg-white">
      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col gap-1">
          {pinnedModules.map((module) => {
            const isActive = pathname === module.href || pathname.startsWith(module.href + '/');
            const Icon = module.icon;

            return (
              <Link
                key={module.key}
                href={module.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="truncate">{module.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="my-4 border-t border-neutral-200" />

        {/* Settings Link */}
        <Link
          href="/dashboard/settings"
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
            pathname.startsWith('/dashboard/settings')
              ? 'bg-primary-50 text-primary-600'
              : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
          )}
        >
          <Settings className="h-5 w-5" />
          Ayarlar
        </Link>

        {/* Customize Menu Button */}
        <Link
          href="/dashboard/settings/menu"
          className="mt-2 flex items-center justify-center gap-2 rounded-lg border border-dashed border-neutral-300 py-2 text-sm font-medium text-neutral-600 transition-colors hover:border-primary-500 hover:bg-primary-50 hover:text-primary-600"
        >
          <Menu className="h-4 w-4" />
          Menüyü Özelleştir
        </Link>
      </nav>

      {/* Organization Selector (Bottom) */}
      <div className="border-t border-neutral-200 bg-white p-4">
        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
          <p className="text-xs font-semibold text-neutral-500">ORGANİZASYON</p>
          <p className="mt-1 text-sm font-medium text-neutral-900">My Company</p>
          <p className="text-xs text-neutral-500">Free Plan</p>
        </div>
      </div>
    </aside>
  );
}
