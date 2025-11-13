-- ============================================================================
-- Fix Organizations and Add Organization Members Table
-- ============================================================================
-- This migration adds missing columns to organizations and creates the
-- organization_members junction table

-- Add missing columns to organizations table
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id);
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS subscription_plan TEXT DEFAULT 'free';
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Add CHECK constraint for subscription_plan
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'organizations_subscription_plan_check'
  ) THEN
    ALTER TABLE organizations
    ADD CONSTRAINT organizations_subscription_plan_check
    CHECK (subscription_plan IN ('free', 'pro', 'enterprise'));
  END IF;
END $$;

-- Create organization_members junction table
CREATE TABLE IF NOT EXISTS organization_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

-- Add CHECK constraint for role
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'organization_members_role_check'
  ) THEN
    ALTER TABLE organization_members
    ADD CONSTRAINT organization_members_role_check
    CHECK (role IN ('owner', 'admin', 'member'));
  END IF;
END $$;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_organization_members_org ON organization_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_organization_members_user ON organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_organizations_owner ON organizations(owner_id);

-- Add updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers
DROP TRIGGER IF EXISTS update_organizations_updated_at ON organizations;
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_organization_members_updated_at ON organization_members;
CREATE TRIGGER update_organization_members_updated_at
  BEFORE UPDATE ON organization_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their organization memberships" ON organization_members;
DROP POLICY IF EXISTS "Users can insert organization memberships" ON organization_members;
DROP POLICY IF EXISTS "Users can update organization memberships" ON organization_members;
DROP POLICY IF EXISTS "Users can delete organization memberships" ON organization_members;

DROP POLICY IF EXISTS "Users can view organizations" ON organizations;
DROP POLICY IF EXISTS "Users can insert organizations" ON organizations;
DROP POLICY IF EXISTS "Users can update organizations" ON organizations;
DROP POLICY IF EXISTS "Users can delete organizations" ON organizations;

-- Create RLS policies for organization_members
CREATE POLICY "Users can view their organization memberships"
  ON organization_members FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert organization memberships"
  ON organization_members FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update organization memberships"
  ON organization_members FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can delete organization memberships"
  ON organization_members FOR DELETE
  USING (auth.role() = 'authenticated');

-- Create RLS policies for organizations
CREATE POLICY "Users can view organizations"
  ON organizations FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert organizations"
  ON organizations FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update organizations"
  ON organizations FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can delete organizations"
  ON organizations FOR DELETE
  USING (auth.role() = 'authenticated');

-- Add comments to tables
COMMENT ON TABLE organization_members IS 'Junction table linking users to organizations with their roles';
COMMENT ON TABLE organizations IS 'Organizations/workspaces for multi-tenancy';

-- Add comments to important columns
COMMENT ON COLUMN organizations.owner_id IS 'User ID of the organization owner';
COMMENT ON COLUMN organizations.subscription_plan IS 'Subscription tier: free, pro, enterprise';
COMMENT ON COLUMN organization_members.role IS 'User role in organization: owner, admin, member';
