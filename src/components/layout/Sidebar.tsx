'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  CRM_MODULES,
  getDefaultPinnedModules,
  type CRMModule,
  getModuleByKey,
  MODULE_CATEGORIES,
  type ModuleCategory
} from '@/lib/modules';
import { Settings, Menu, ChevronDown, ChevronRight } from 'lucide-react';
import { loadMenuPreferences, initializeDefaultMenu } from '@/lib/api/menu-preferences';

export function Sidebar() {
  const pathname = usePathname();
  const [pinnedModules, setPinnedModules] = useState<CRMModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [collapsedCategories, setCollapsedCategories] = useState<Set<ModuleCategory>>(new Set());

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

  const toggleCategory = (category: ModuleCategory) => {
    const newCollapsed = new Set(collapsedCategories);
    if (newCollapsed.has(category)) {
      newCollapsed.delete(category);
    } else {
      newCollapsed.add(category);
    }
    setCollapsedCategories(newCollapsed);
  };

  // Group modules by category
  const modulesByCategory = pinnedModules.reduce((acc, module) => {
    if (!acc[module.category]) {
      acc[module.category] = [];
    }
    acc[module.category].push(module);
    return acc;
  }, {} as Record<ModuleCategory, CRMModule[]>);

  return (
    <aside className="flex h-full w-64 flex-col border-r border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        {/* Grouped Menu by Category */}
        <div className="space-y-1">
          {Object.entries(modulesByCategory).map(([category, modules]) => {
            const categoryInfo = MODULE_CATEGORIES[category as ModuleCategory];
            const isCollapsed = collapsedCategories.has(category as ModuleCategory);
            const hasActiveModule = modules.some(
              (m) => pathname === m.href || pathname.startsWith(m.href + '/')
            );

            return (
              <div key={category}>
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category as ModuleCategory)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-colors',
                    hasActiveModule
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'
                  )}
                >
                  <span>{categoryInfo?.name || category}</span>
                  {isCollapsed ? (
                    <ChevronRight className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </button>

                {/* Category Modules */}
                {!isCollapsed && (
                  <div className="ml-2 mt-1 space-y-1 border-l-2 border-neutral-200 pl-2 dark:border-neutral-700">
                    {modules.map((module) => {
                      const isActive =
                        pathname === module.href || pathname.startsWith(module.href + '/');
                      const Icon = module.icon;

                      return (
                        <Link
                          key={module.key}
                          href={module.href}
                          className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                            isActive
                              ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                              : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100'
                          )}
                        >
                          <Icon className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{module.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Divider */}
        <div className="my-4 border-t border-neutral-200 dark:border-neutral-700" />

        {/* Settings Link */}
        <Link
          href="/dashboard/settings"
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
            pathname.startsWith('/dashboard/settings')
              ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
              : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100'
          )}
        >
          <Settings className="h-5 w-5" />
          Ayarlar
        </Link>

        {/* Customize Menu Button */}
        <Link
          href="/dashboard/settings/menu"
          className="mt-2 flex items-center justify-center gap-2 rounded-lg border border-dashed border-neutral-300 py-2 text-sm font-medium text-neutral-600 transition-colors hover:border-primary-500 hover:bg-primary-50 hover:text-primary-600 dark:border-neutral-600 dark:text-neutral-400 dark:hover:border-primary-500 dark:hover:bg-primary-900/20 dark:hover:text-primary-400"
        >
          <Menu className="h-4 w-4" />
          Menüyü Özelleştir
        </Link>
      </nav>

      {/* Organization Selector (Bottom) */}
      <div className="border-t border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900">
        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-700 dark:bg-neutral-800">
          <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
            ORGANİZASYON
          </p>
          <p className="mt-1 text-sm font-medium text-neutral-900 dark:text-neutral-100">
            My Company
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">Free Plan</p>
        </div>
      </div>
    </aside>
  );
}
