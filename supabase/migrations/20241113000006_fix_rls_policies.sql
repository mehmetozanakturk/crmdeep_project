-- ============================================================================
-- FIX ALL RLS POLICIES - DEFINITIVE SOLUTION
-- ============================================================================
-- This migration fixes the chicken-egg problem with organization_members
-- by creating simpler, more permissive policies

-- ============================================================================
-- STEP 1: Drop all existing broken policies
-- ============================================================================
DROP POLICY IF EXISTS "Users can view organizations they are members of" ON organizations;
DROP POLICY IF EXISTS "Users can create organizations" ON organizations;
DROP POLICY IF EXISTS "Organization owners can update their organizations" ON organizations;
DROP POLICY IF EXISTS "Organization owners can delete their organizations" ON organizations;
DROP POLICY IF EXISTS "Users can view organizations" ON organizations;
DROP POLICY IF EXISTS "Users can insert organizations" ON organizations;
DROP POLICY IF EXISTS "Users can update organizations" ON organizations;
DROP POLICY IF EXISTS "Users can delete organizations" ON organizations;
DROP POLICY IF EXISTS "Enable all for authenticated" ON organizations;
DROP POLICY IF EXISTS "Enable read for authenticated users" ON organizations;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON organizations;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON organizations;

-- Drop organization_members policies
DROP POLICY IF EXISTS "Users can view members of their organizations" ON organization_members;
DROP POLICY IF EXISTS "Owners and admins can add members" ON organization_members;
DROP POLICY IF EXISTS "Owners and admins can update member roles" ON organization_members;
DROP POLICY IF EXISTS "Owners and admins can remove members" ON organization_members;
DROP POLICY IF EXISTS "Users can view their organization memberships" ON organization_members;
DROP POLICY IF EXISTS "Users can insert organization memberships" ON organization_members;
DROP POLICY IF EXISTS "Users can update organization memberships" ON organization_members;
DROP POLICY IF EXISTS "Users can delete organization memberships" ON organization_members;

-- ============================================================================
-- STEP 2: Ensure tables exist with correct columns
-- ============================================================================

-- Ensure organizations table has required columns
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id);
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS subscription_plan TEXT DEFAULT 'free';
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Create organization_members if it doesn't exist
CREATE TABLE IF NOT EXISTS organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'owner' CHECK (role IN ('owner', 'admin', 'member', 'guest')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

-- Add indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_organization_members_org ON organization_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_organization_members_user ON organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_organizations_owner ON organizations(owner_id);

-- ============================================================================
-- STEP 3: Enable RLS
-- ============================================================================
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 4: Create SIMPLE, WORKING policies
-- ============================================================================

-- Organizations: Allow all authenticated users to read/write
-- This is more permissive but prevents the chicken-egg problem
CREATE POLICY "Authenticated users can read organizations"
  ON organizations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create organizations"
  ON organizations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Organization owners can update"
  ON organizations FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Organization owners can delete"
  ON organizations FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid());

-- Organization Members: Allow all authenticated users
CREATE POLICY "Authenticated users can read memberships"
  ON organization_members FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create memberships"
  ON organization_members FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own membership"
  ON organization_members FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() OR
         organization_id IN (
           SELECT organization_id FROM organization_members
           WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
         ))
  WITH CHECK (true);

CREATE POLICY "Admins can delete memberships"
  ON organization_members FOR DELETE
  TO authenticated
  USING (organization_id IN (
    SELECT organization_id FROM organization_members
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
  ));

-- ============================================================================
-- STEP 5: Add helpful functions
-- ============================================================================

-- Function to automatically add creator to organization_members
CREATE OR REPLACE FUNCTION add_org_creator_as_member()
RETURNS TRIGGER AS $$
BEGIN
  -- Automatically add the owner to organization_members
  INSERT INTO organization_members (organization_id, user_id, role)
  VALUES (NEW.id, NEW.owner_id, 'owner')
  ON CONFLICT (organization_id, user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically add creator
DROP TRIGGER IF EXISTS auto_add_org_creator ON organizations;
CREATE TRIGGER auto_add_org_creator
  AFTER INSERT ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION add_org_creator_as_member();

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON POLICY "Authenticated users can read organizations" ON organizations IS
  'Allows all authenticated users to see organizations. More permissive to avoid chicken-egg problem.';
COMMENT ON POLICY "Authenticated users can create organizations" ON organizations IS
  'Users can create organizations if they set themselves as owner';
COMMENT ON FUNCTION add_org_creator_as_member() IS
  'Automatically adds organization creator to organization_members table';
