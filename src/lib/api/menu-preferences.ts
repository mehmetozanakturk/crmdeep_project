import { createClient } from '@/lib/supabase/client';
import { getDefaultPinnedModules } from '@/lib/modules';

export interface MenuPreference {
  id: string;
  user_id: string;
  organization_id: string;
  module_key: string;
  is_pinned: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

/**
 * Load user's menu preferences from Supabase
 */
export async function loadMenuPreferences(organizationId: string): Promise<MenuPreference[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('user_menu_preferences')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('is_pinned', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error loading menu preferences:', error);
    return [];
  }

  return data || [];
}

/**
 * Save/update a menu preference
 */
export async function saveMenuPreference(
  organizationId: string,
  moduleKey: string,
  isPinned: boolean,
  displayOrder?: number
): Promise<boolean> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error('No user found');
    return false;
  }

  const { error } = await supabase.from('user_menu_preferences').upsert(
    {
      user_id: user.id,
      organization_id: organizationId,
      module_key: moduleKey,
      is_pinned: isPinned,
      display_order: displayOrder || 0,
    },
    {
      onConflict: 'user_id,organization_id,module_key',
    }
  );

  if (error) {
    console.error('Error saving menu preference:', error);
    return false;
  }

  return true;
}

/**
 * Initialize default menu for a new user
 */
export async function initializeDefaultMenu(organizationId: string): Promise<boolean> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error('No user found');
    return false;
  }

  // Check if user already has preferences
  const { data: existing } = await supabase
    .from('user_menu_preferences')
    .select('id')
    .eq('user_id', user.id)
    .eq('organization_id', organizationId)
    .limit(1);

  if (existing && existing.length > 0) {
    // User already has preferences, don't override
    return true;
  }

  // Insert default pinned modules
  const defaultModules = getDefaultPinnedModules();
  const preferences = defaultModules.map((module, index) => ({
    user_id: user.id,
    organization_id: organizationId,
    module_key: module.key,
    is_pinned: true,
    display_order: index + 1,
  }));

  const { error } = await supabase.from('user_menu_preferences').insert(preferences);

  if (error) {
    console.error('Error initializing default menu:', error);
    return false;
  }

  return true;
}

/**
 * Reset menu to defaults
 */
export async function resetMenuToDefaults(organizationId: string): Promise<boolean> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error('No user found');
    return false;
  }

  // Delete all existing preferences
  const { error: deleteError } = await supabase
    .from('user_menu_preferences')
    .delete()
    .eq('user_id', user.id)
    .eq('organization_id', organizationId);

  if (deleteError) {
    console.error('Error deleting preferences:', deleteError);
    return false;
  }

  // Initialize defaults
  return await initializeDefaultMenu(organizationId);
}

/**
 * Get pinned module keys for a user
 */
export async function getPinnedModuleKeys(organizationId: string): Promise<string[]> {
  const preferences = await loadMenuPreferences(organizationId);
  return preferences.map((pref) => pref.module_key);
}
