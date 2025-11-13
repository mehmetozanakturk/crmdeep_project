-- CRMDeep Campaigns and Emails RLS Policies
-- Row Level Security for marketing campaigns and email management

-- ============================================================================
-- ENABLE RLS
-- ============================================================================
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_performance_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- CAMPAIGNS POLICIES
-- ============================================================================

-- Users can view campaigns in their organizations
CREATE POLICY "Users can view campaigns in their organizations"
ON campaigns FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id FROM organization_members
    WHERE user_id = auth.uid()
  )
);

-- Members can create campaigns
CREATE POLICY "Members can create campaigns"
ON campaigns FOR INSERT
WITH CHECK (
  organization_id IN (
    SELECT organization_id FROM organization_members
    WHERE user_id = auth.uid()
  )
);

-- Members can update campaigns in their organizations
CREATE POLICY "Members can update campaigns"
ON campaigns FOR UPDATE
USING (
  organization_id IN (
    SELECT organization_id FROM organization_members
    WHERE user_id = auth.uid()
  )
);

-- Admins can delete campaigns
CREATE POLICY "Admins can delete campaigns"
ON campaigns FOR DELETE
USING (
  organization_id IN (
    SELECT organization_id FROM organization_members
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
  )
);

-- ============================================================================
-- CAMPAIGN_PERFORMANCE_HISTORY POLICIES
-- ============================================================================

-- Users can view performance history for campaigns they have access to
CREATE POLICY "Users can view campaign performance history"
ON campaign_performance_history FOR SELECT
USING (
  campaign_id IN (
    SELECT c.id FROM campaigns c
    INNER JOIN organization_members om ON om.organization_id = c.organization_id
    WHERE om.user_id = auth.uid()
  )
);

-- System/Members can insert performance history
CREATE POLICY "Members can insert campaign performance history"
ON campaign_performance_history FOR INSERT
WITH CHECK (
  campaign_id IN (
    SELECT c.id FROM campaigns c
    INNER JOIN organization_members om ON om.organization_id = c.organization_id
    WHERE om.user_id = auth.uid()
  )
);

-- Members can update performance history
CREATE POLICY "Members can update campaign performance history"
ON campaign_performance_history FOR UPDATE
USING (
  campaign_id IN (
    SELECT c.id FROM campaigns c
    INNER JOIN organization_members om ON om.organization_id = c.organization_id
    WHERE om.user_id = auth.uid()
  )
);

-- ============================================================================
-- EMAILS POLICIES
-- ============================================================================

-- Users can view emails in their organizations
CREATE POLICY "Users can view emails in their organizations"
ON emails FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id FROM organization_members
    WHERE user_id = auth.uid()
  )
);

-- Members can create emails
CREATE POLICY "Members can create emails"
ON emails FOR INSERT
WITH CHECK (
  organization_id IN (
    SELECT organization_id FROM organization_members
    WHERE user_id = auth.uid()
  )
);

-- Members can update emails (mark as read, starred, etc.)
CREATE POLICY "Members can update emails"
ON emails FOR UPDATE
USING (
  organization_id IN (
    SELECT organization_id FROM organization_members
    WHERE user_id = auth.uid()
  )
);

-- Members can delete their own emails or admins can delete any
CREATE POLICY "Members can delete emails"
ON emails FOR DELETE
USING (
  created_by = auth.uid()
  OR
  organization_id IN (
    SELECT organization_id FROM organization_members
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
  )
);
