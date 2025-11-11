-- RLS Policies for CRM Modules (Companies, Contacts, Deals)

-- ============================================================================
-- COMPANIES RLS
-- ============================================================================
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Users can view companies from their organization
CREATE POLICY "Users can view companies from their organization"
  ON companies FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

-- Users can create companies in their organization
CREATE POLICY "Users can create companies in their organization"
  ON companies FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

-- Users can update companies in their organization
CREATE POLICY "Users can update companies in their organization"
  ON companies FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

-- Only admins and owners can delete companies
CREATE POLICY "Only admins and owners can delete companies"
  ON companies FOR DELETE
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin')
    )
  );

-- ============================================================================
-- CONTACTS RLS
-- ============================================================================
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Users can view contacts from their organization
CREATE POLICY "Users can view contacts from their organization"
  ON contacts FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

-- Users can create contacts in their organization
CREATE POLICY "Users can create contacts in their organization"
  ON contacts FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

-- Users can update contacts in their organization
CREATE POLICY "Users can update contacts in their organization"
  ON contacts FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

-- Only admins and owners can delete contacts
CREATE POLICY "Only admins and owners can delete contacts"
  ON contacts FOR DELETE
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin')
    )
  );

-- ============================================================================
-- DEALS RLS
-- ============================================================================
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

-- Users can view deals from their organization
CREATE POLICY "Users can view deals from their organization"
  ON deals FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

-- Users can create deals in their organization
CREATE POLICY "Users can create deals in their organization"
  ON deals FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

-- Users can update deals in their organization
CREATE POLICY "Users can update deals in their organization"
  ON deals FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

-- Only admins and owners can delete deals
CREATE POLICY "Only admins and owners can delete deals"
  ON deals FOR DELETE
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin')
    )
  );

-- ============================================================================
-- CONTACT_INTERACTIONS RLS
-- ============================================================================
ALTER TABLE contact_interactions ENABLE ROW LEVEL SECURITY;

-- Users can view interactions from their organization
CREATE POLICY "Users can view interactions from their organization"
  ON contact_interactions FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

-- Users can create interactions in their organization
CREATE POLICY "Users can create interactions in their organization"
  ON contact_interactions FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

-- Users can update their own interactions
CREATE POLICY "Users can update their own interactions"
  ON contact_interactions FOR UPDATE
  USING (
    created_by = auth.uid() AND
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

-- Users can delete their own interactions, admins can delete all
CREATE POLICY "Users can delete their own interactions"
  ON contact_interactions FOR DELETE
  USING (
    (created_by = auth.uid() OR
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin')
    ))
  );
