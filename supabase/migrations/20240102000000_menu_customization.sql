-- CRMDeep Menu Customization System
-- This migration adds support for user-customizable menu preferences

-- ============================================================================
-- USER_MENU_PREFERENCES (User's pinned menu items)
-- ============================================================================
CREATE TABLE user_menu_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  module_key TEXT NOT NULL, -- e.g., 'contacts', 'companies', 'deals'
  is_pinned BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, organization_id, module_key)
);

CREATE INDEX idx_menu_prefs_user_org ON user_menu_preferences(user_id, organization_id);
CREATE INDEX idx_menu_prefs_pinned ON user_menu_preferences(is_pinned, display_order);

-- Auto-update trigger
CREATE TRIGGER update_user_menu_preferences_updated_at
  BEFORE UPDATE ON user_menu_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- DEFAULT MENU ITEMS (First-time user experience)
-- ============================================================================
-- Function to initialize default menu for new users
CREATE OR REPLACE FUNCTION initialize_default_menu(
  p_user_id UUID,
  p_organization_id UUID
) RETURNS VOID AS $$
BEGIN
  -- Insert default pinned modules (Core modules everyone needs)
  INSERT INTO user_menu_preferences (user_id, organization_id, module_key, is_pinned, display_order)
  VALUES
    (p_user_id, p_organization_id, 'dashboard', true, 1),
    (p_user_id, p_organization_id, 'contacts', true, 2),
    (p_user_id, p_organization_id, 'companies', true, 3),
    (p_user_id, p_organization_id, 'tasks', true, 4),
    (p_user_id, p_organization_id, 'calendar', true, 5),
    (p_user_id, p_organization_id, 'deals', true, 6)
  ON CONFLICT (user_id, organization_id, module_key) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- RLS POLICIES
-- ============================================================================
ALTER TABLE user_menu_preferences ENABLE ROW LEVEL SECURITY;

-- Users can view their own menu preferences
CREATE POLICY "Users can view their own menu preferences"
ON user_menu_preferences FOR SELECT
USING (user_id = auth.uid());

-- Users can insert their own menu preferences
CREATE POLICY "Users can insert their own menu preferences"
ON user_menu_preferences FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update their own menu preferences
CREATE POLICY "Users can update their own menu preferences"
ON user_menu_preferences FOR UPDATE
USING (user_id = auth.uid());

-- Users can delete their own menu preferences
CREATE POLICY "Users can delete their own menu preferences"
ON user_menu_preferences FOR DELETE
USING (user_id = auth.uid());

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON TABLE user_menu_preferences IS 'Stores user-specific menu customization preferences for pinned modules';
COMMENT ON COLUMN user_menu_preferences.module_key IS 'Unique identifier for each module (e.g., contacts, deals, projects)';
COMMENT ON COLUMN user_menu_preferences.is_pinned IS 'Whether the module is pinned to the sidebar';
COMMENT ON COLUMN user_menu_preferences.display_order IS 'Order in which pinned modules appear (lower = higher)';
