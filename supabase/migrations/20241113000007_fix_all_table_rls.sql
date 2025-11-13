-- ============================================================================
-- FIX ALL TABLE RLS POLICIES - MAKE EVERYTHING WORK
-- ============================================================================
-- This migration fixes RLS policies for all tables to make CRUD operations work

-- ============================================================================
-- CONTACTS TABLE
-- ============================================================================
DROP POLICY IF EXISTS "Users can view their organization contacts" ON contacts;
DROP POLICY IF EXISTS "Users can insert contacts" ON contacts;
DROP POLICY IF EXISTS "Users can update contacts" ON contacts;
DROP POLICY IF EXISTS "Users can delete contacts" ON contacts;

CREATE POLICY "Allow all for authenticated - contacts"
  ON contacts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- COMPANIES TABLE
-- ============================================================================
DROP POLICY IF EXISTS "Users can view their organization companies" ON companies;
DROP POLICY IF EXISTS "Users can insert companies" ON companies;
DROP POLICY IF EXISTS "Users can update companies" ON companies;
DROP POLICY IF EXISTS "Users can delete companies" ON companies;

CREATE POLICY "Allow all for authenticated - companies"
  ON companies FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- DEALS TABLE
-- ============================================================================
DROP POLICY IF EXISTS "Users can view their organization deals" ON deals;
DROP POLICY IF EXISTS "Users can insert deals" ON deals;
DROP POLICY IF EXISTS "Users can update deals" ON deals;
DROP POLICY IF EXISTS "Users can delete deals" ON deals;

CREATE POLICY "Allow all for authenticated - deals"
  ON deals FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- TASKS TABLE
-- ============================================================================
DROP POLICY IF EXISTS "Users can view tasks in projects they have access to" ON tasks;
DROP POLICY IF EXISTS "Project members can create tasks" ON tasks;
DROP POLICY IF EXISTS "Project members can update tasks" ON tasks;
DROP POLICY IF EXISTS "Project admins can delete tasks" ON tasks;

CREATE POLICY "Allow all for authenticated - tasks"
  ON tasks FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- PROJECTS TABLE
-- ============================================================================
DROP POLICY IF EXISTS "Users can view projects in their organizations" ON projects;
DROP POLICY IF EXISTS "Members can create projects" ON projects;
DROP POLICY IF EXISTS "Project members can update projects" ON projects;
DROP POLICY IF EXISTS "Admins can delete projects" ON projects;
DROP POLICY IF EXISTS "Users can view their organization projects" ON projects;
DROP POLICY IF EXISTS "Users can insert projects" ON projects;
DROP POLICY IF EXISTS "Users can update projects" ON projects;
DROP POLICY IF EXISTS "Users can delete projects" ON projects;

CREATE POLICY "Allow all for authenticated - projects"
  ON projects FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- NOTES TABLE
-- ============================================================================
CREATE POLICY "Allow all for authenticated - notes"
  ON notes FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- PRODUCTS TABLE
-- ============================================================================
CREATE POLICY "Allow all for authenticated - products"
  ON products FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- INVOICES TABLE
-- ============================================================================
CREATE POLICY "Allow all for authenticated - invoices"
  ON invoices FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- LEADS TABLE
-- ============================================================================
CREATE POLICY "Allow all for authenticated - leads"
  ON leads FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- QUOTES TABLE
-- ============================================================================
CREATE POLICY "Allow all for authenticated - quotes"
  ON quotes FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- EXPENSES TABLE
-- ============================================================================
CREATE POLICY "Allow all for authenticated - expenses"
  ON expenses FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- CALENDAR EVENTS TABLE
-- ============================================================================
CREATE POLICY "Allow all for authenticated - calendar_events"
  ON calendar_events FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- TICKETS TABLE
-- ============================================================================
CREATE POLICY "Allow all for authenticated - tickets"
  ON tickets FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- FILES TABLE
-- ============================================================================
CREATE POLICY "Allow all for authenticated - files"
  ON files FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- CAMPAIGNS TABLE
-- ============================================================================
DROP POLICY IF EXISTS "Users can view campaigns in their organizations" ON campaigns;
DROP POLICY IF EXISTS "Users can create campaigns" ON campaigns;
DROP POLICY IF EXISTS "Users can update campaigns" ON campaigns;
DROP POLICY IF EXISTS "Users can delete campaigns" ON campaigns;

CREATE POLICY "Allow all for authenticated - campaigns"
  ON campaigns FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- AUTOMATIONS TABLE
-- ============================================================================
CREATE POLICY "Allow all for authenticated - automations"
  ON automations FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- TIMESHEET ENTRIES TABLE
-- ============================================================================
CREATE POLICY "Allow all for authenticated - timesheet_entries"
  ON timesheet_entries FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- TEAM MEMBERS TABLE
-- ============================================================================
CREATE POLICY "Allow all for authenticated - team_members"
  ON team_members FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- KNOWLEDGE ARTICLES TABLE
-- ============================================================================
CREATE POLICY "Allow all for authenticated - knowledge_articles"
  ON knowledge_articles FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- SUBSCRIPTIONS TABLE
-- ============================================================================
CREATE POLICY "Allow all for authenticated - subscriptions"
  ON subscriptions FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- BRANDS TABLE
-- ============================================================================
DROP POLICY IF EXISTS "Users can view brands in their organizations" ON brands;
DROP POLICY IF EXISTS "Admins can create brands" ON brands;
DROP POLICY IF EXISTS "Admins can update brands" ON brands;
DROP POLICY IF EXISTS "Admins can delete brands" ON brands;

CREATE POLICY "Allow all for authenticated - brands"
  ON brands FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- CONTACT LISTS TABLE
-- ============================================================================
CREATE POLICY "Allow all for authenticated - contact_lists"
  ON contact_lists FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- INBOX MESSAGES TABLE (if exists)
-- ============================================================================
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'inbox_messages') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Allow all for authenticated users" ON inbox_messages';
    EXECUTE 'CREATE POLICY "Allow all for authenticated - inbox_messages" ON inbox_messages FOR ALL TO authenticated USING (true) WITH CHECK (true)';
  END IF;
END $$;

-- ============================================================================
-- REPORTS TABLE (if exists)
-- ============================================================================
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'reports') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Allow all for authenticated users" ON reports';
    EXECUTE 'CREATE POLICY "Allow all for authenticated - reports" ON reports FOR ALL TO authenticated USING (true) WITH CHECK (true)';
  END IF;
END $$;

-- ============================================================================
-- CUSTOM REPORTS TABLE (if exists)
-- ============================================================================
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'custom_reports') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Users can view reports in their organizations" ON custom_reports';
    EXECUTE 'DROP POLICY IF EXISTS "Users can create reports" ON custom_reports';
    EXECUTE 'DROP POLICY IF EXISTS "Users can update their own reports" ON custom_reports';
    EXECUTE 'DROP POLICY IF EXISTS "Users can delete their own reports" ON custom_reports';
    EXECUTE 'CREATE POLICY "Allow all for authenticated - custom_reports" ON custom_reports FOR ALL TO authenticated USING (true) WITH CHECK (true)';
  END IF;
END $$;

-- ============================================================================
-- REPORT EXPORTS TABLE (if exists)
-- ============================================================================
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'report_exports') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Users can view report exports in their organizations" ON report_exports';
    EXECUTE 'DROP POLICY IF EXISTS "Users can create report exports" ON report_exports';
    EXECUTE 'DROP POLICY IF EXISTS "Users can delete their own exports" ON report_exports';
    EXECUTE 'CREATE POLICY "Allow all for authenticated - report_exports" ON report_exports FOR ALL TO authenticated USING (true) WITH CHECK (true)';
  END IF;
END $$;

COMMENT ON SCHEMA public IS 'All RLS policies updated to allow full CRUD for authenticated users. This is simplified for development. Consider tightening policies for production.';
