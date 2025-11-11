'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  CRM_MODULES,
  MODULE_CATEGORIES,
  getAllCategories,
  getModulesByCategory,
  getDefaultPinnedModules,
  type ModuleCategory,
} from '@/lib/modules';
import { Settings, Pin, PinOff, RotateCcw, Loader2, Check } from 'lucide-react';
import {
  loadMenuPreferences,
  saveMenuPreference,
  resetMenuToDefaults,
} from '@/lib/api/menu-preferences';

export default function MenuCustomizationPage() {
  const [pinnedModules, setPinnedModules] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // TODO: Get actual organization ID
  const organizationId = 'temp-org-id';

  // Load preferences on mount
  useEffect(() => {
    async function loadPrefs() {
      try {
        const preferences = await loadMenuPreferences(organizationId);
        const pinned = new Set(preferences.map((p) => p.module_key));

        if (pinned.size === 0) {
          // No preferences, use defaults
          const defaults = getDefaultPinnedModules().map((m) => m.key);
          setPinnedModules(new Set(defaults));
        } else {
          setPinnedModules(pinned);
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadPrefs();
  }, [organizationId]);

  const togglePin = async (moduleKey: string) => {
    const wasPinned = pinnedModules.has(moduleKey);
    const newPinned = new Set(pinnedModules);

    if (wasPinned) {
      newPinned.delete(moduleKey);
    } else {
      newPinned.add(moduleKey);
    }

    setPinnedModules(newPinned);
    setIsSaving(true);

    // Save to Supabase
    const success = await saveMenuPreference(organizationId, moduleKey, !wasPinned);

    if (success) {
      setSaveMessage('✓ Kaydedildi');
      setTimeout(() => setSaveMessage(null), 2000);
    } else {
      setSaveMessage('Hata! Tekrar deneyin.');
      // Revert on error
      setPinnedModules(new Set(wasPinned ? [...newPinned, moduleKey] : [...newPinned].filter(k => k !== moduleKey)));
    }

    setIsSaving(false);
  };

  const resetToDefault = async () => {
    setIsSaving(true);
    const success = await resetMenuToDefaults(organizationId);

    if (success) {
      const defaults = getDefaultPinnedModules().map((m) => m.key);
      setPinnedModules(new Set(defaults));
      setSaveMessage('✓ Varsayılana döndürüldü');
      setTimeout(() => setSaveMessage(null), 2000);
    } else {
      setSaveMessage('Hata! Tekrar deneyin.');
    }

    setIsSaving(false);
  };

  const pinnedCount = pinnedModules.size;

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Menü Özelleştirme</h1>
          <p className="mt-1 text-neutral-600">
            Sol menünüzde görmek istediğiniz modülleri seçin ve sabitleyin
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saveMessage && (
            <Badge variant={saveMessage.includes('✓') ? 'default' : 'destructive'}>
              {saveMessage}
            </Badge>
          )}
          <Button variant="outline" onClick={resetToDefault} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RotateCcw className="mr-2 h-4 w-4" />
            )}
            Varsayılana Dön
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Toplam Modül</p>
                <p className="mt-1 text-3xl font-bold text-neutral-900">{CRM_MODULES.length}</p>
              </div>
              <div className="rounded-lg bg-primary-100 p-3">
                <Settings className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Sabitlenen</p>
                <p className="mt-1 text-3xl font-bold text-success-600">{pinnedCount}</p>
              </div>
              <div className="rounded-lg bg-success-100 p-3">
                <Pin className="h-6 w-6 text-success-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">Gizlenen</p>
                <p className="mt-1 text-3xl font-bold text-neutral-500">
                  {CRM_MODULES.length - pinnedCount}
                </p>
              </div>
              <div className="rounded-lg bg-neutral-100 p-3">
                <PinOff className="h-6 w-6 text-neutral-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Module Categories */}
      <div className="space-y-6">
        {getAllCategories().map((categoryKey) => {
          const category = MODULE_CATEGORIES[categoryKey];
          const modules = getModulesByCategory(categoryKey);

          return (
            <Card key={categoryKey}>
              <CardHeader>
                <CardTitle>{category.name}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {modules.map((module) => {
                    const isPinned = pinnedModules.has(module.key);
                    const Icon = module.icon;

                    return (
                      <button
                        key={module.key}
                        onClick={() => togglePin(module.key)}
                        className={`flex items-start gap-3 rounded-lg border-2 p-4 text-left transition-all ${
                          isPinned
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-neutral-200 bg-white hover:border-neutral-300'
                        }`}
                      >
                        <div
                          className={`rounded-lg p-2 ${
                            isPinned ? 'bg-primary-100' : 'bg-neutral-100'
                          }`}
                        >
                          <Icon
                            className={`h-5 w-5 ${
                              isPinned ? 'text-primary-600' : 'text-neutral-600'
                            }`}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3
                              className={`font-medium ${
                                isPinned ? 'text-primary-900' : 'text-neutral-900'
                              }`}
                            >
                              {module.name}
                            </h3>
                            {isPinned && (
                              <Pin className="h-3 w-3 text-primary-600" fill="currentColor" />
                            )}
                          </div>
                          <p className="mt-1 text-xs text-neutral-600">{module.description}</p>
                          {module.defaultPinned && (
                            <Badge variant="secondary" className="mt-2 text-xs">
                              Varsayılan
                            </Badge>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-4">
        <div>
          <p className="font-medium text-neutral-900">Değişiklikler otomatik kaydedilir</p>
          <p className="text-sm text-neutral-600">
            Menünüz anında güncellenir, herhangi bir işlem yapmanıza gerek yok
          </p>
        </div>
        <Badge variant="default" className="h-fit">
          {pinnedCount} Modül Sabitlendi
        </Badge>
      </div>
    </div>
  );
}
