-- CRMDeep Custom Reports RLS Policies
-- Row Level Security for custom reports and exports

-- ============================================================================
-- ENABLE RLS
-- ============================================================================
ALTER TABLE custom_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_exports ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- CUSTOM_REPORTS POLICIES
-- ============================================================================

-- Users can view reports in their organizations
-- Public reports are visible to all org members, private reports only to creator
CREATE POLICY "Users can view reports in their organizations"
ON custom_reports FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id FROM organization_members
    WHERE user_id = auth.uid()
  )
  AND (is_public = true OR created_by = auth.uid())
);

-- Members can create reports
CREATE POLICY "Members can create reports"
ON custom_reports FOR INSERT
WITH CHECK (
  organization_id IN (
    SELECT organization_id FROM organization_members
    WHERE user_id = auth.uid()
  )
);

-- Users can update their own reports
CREATE POLICY "Users can update their own reports"
ON custom_reports FOR UPDATE
USING (
  created_by = auth.uid()
  AND organization_id IN (
    SELECT organization_id FROM organization_members
    WHERE user_id = auth.uid()
  )
);

-- Users can delete their own reports, admins can delete any
CREATE POLICY "Users can delete reports"
ON custom_reports FOR DELETE
USING (
  created_by = auth.uid()
  OR
  organization_id IN (
    SELECT organization_id FROM organization_members
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
  )
);

-- ============================================================================
-- REPORT_EXPORTS POLICIES
-- ============================================================================

-- Users can view exports in their organizations
CREATE POLICY "Users can view report exports in their organizations"
ON report_exports FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id FROM organization_members
    WHERE user_id = auth.uid()
  )
);

-- Members can create exports
CREATE POLICY "Members can create report exports"
ON report_exports FOR INSERT
WITH CHECK (
  organization_id IN (
    SELECT organization_id FROM organization_members
    WHERE user_id = auth.uid()
  )
);

-- Users can delete their own exports, admins can delete any
CREATE POLICY "Users can delete report exports"
ON report_exports FOR DELETE
USING (
  exported_by = auth.uid()
  OR
  organization_id IN (
    SELECT organization_id FROM organization_members
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
  )
);
