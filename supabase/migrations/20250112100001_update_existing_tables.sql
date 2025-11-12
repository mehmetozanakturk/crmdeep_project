-- ============================================================================
-- MEVCUT TABLOLARI WORKSPACE YAPISI İÇİN GÜNCELLE
-- Bu migration mevcut verileri korur
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- STEP 1: CREATE WORKSPACES TABLE (if not exists)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  domain TEXT NOT NULL,
  color TEXT DEFAULT '#3B82F6',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- STEP 2: CREATE WORKSPACE SETTINGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.workspace_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,

  -- Meta Ads API
  meta_ads_enabled BOOLEAN DEFAULT FALSE,
  meta_ads_access_token TEXT,
  meta_ads_ad_account_id TEXT,
  meta_ads_status TEXT DEFAULT 'disconnected',
  meta_ads_last_sync TIMESTAMPTZ,
  meta_ads_error_message TEXT,

  -- Google Ads API
  google_ads_enabled BOOLEAN DEFAULT FALSE,
  google_ads_client_id TEXT,
  google_ads_client_secret TEXT,
  google_ads_refresh_token TEXT,
  google_ads_customer_id TEXT,
  google_ads_status TEXT DEFAULT 'disconnected',
  google_ads_last_sync TIMESTAMPTZ,
  google_ads_error_message TEXT,

  -- Email SMTP
  email_enabled BOOLEAN DEFAULT FALSE,
  email_smtp_host TEXT,
  email_smtp_port TEXT,
  email_smtp_user TEXT,
  email_smtp_password TEXT,
  email_from_email TEXT,
  email_from_name TEXT,
  email_status TEXT DEFAULT 'disconnected',
  email_error_message TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(workspace_id)
);

-- ============================================================================
-- STEP 3: CREATE WORKSPACE MEMBERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.workspace_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(workspace_id, user_id)
);

-- ============================================================================
-- STEP 4: INSERT DEFAULT WORKSPACES
-- ============================================================================
INSERT INTO public.workspaces (id, name, domain, color, description) VALUES
  ('11111111-1111-1111-1111-111111111111', 'RendxAI', 'rendxai.com', '#3B82F6', 'AI-powered marketing automation'),
  ('22222222-2222-2222-2222-222222222222', 'AllMediaI', 'allmediai.com', '#10B981', 'Full-service media agency'),
  ('33333333-3333-3333-3333-333333333333', 'AutoMexus', 'automexus.com', '#8B5CF6', 'Automotive excellence')
ON CONFLICT (id) DO NOTHING;

-- Insert workspace settings
INSERT INTO public.workspace_settings (workspace_id) VALUES
  ('11111111-1111-1111-1111-111111111111'),
  ('22222222-2222-2222-2222-222222222222'),
  ('33333333-3333-3333-3333-333333333333')
ON CONFLICT (workspace_id) DO NOTHING;

-- ============================================================================
-- STEP 5: ADD workspace_id TO EXISTING TABLES
-- ============================================================================

-- Add workspace_id to profiles (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'workspace_id'
  ) THEN
    ALTER TABLE public.profiles
    ADD COLUMN workspace_id UUID REFERENCES public.workspaces(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Add workspace_id to companies (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'companies' AND column_name = 'workspace_id'
  ) THEN
    ALTER TABLE public.companies
    ADD COLUMN workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE;

    -- Set default workspace for existing companies
    UPDATE public.companies
    SET workspace_id = '11111111-1111-1111-1111-111111111111'
    WHERE workspace_id IS NULL;

    -- Make it NOT NULL after setting defaults
    ALTER TABLE public.companies ALTER COLUMN workspace_id SET NOT NULL;
  END IF;
END $$;

-- Add workspace_id to projects (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'workspace_id'
  ) THEN
    ALTER TABLE public.projects
    ADD COLUMN workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE;

    -- Set default workspace for existing projects
    UPDATE public.projects
    SET workspace_id = '11111111-1111-1111-1111-111111111111'
    WHERE workspace_id IS NULL;

    -- Make it NOT NULL after setting defaults
    ALTER TABLE public.projects ALTER COLUMN workspace_id SET NOT NULL;
  END IF;
END $$;

-- Add workspace_id to tasks (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'workspace_id'
  ) THEN
    ALTER TABLE public.tasks
    ADD COLUMN workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE;

    -- Set default workspace for existing tasks
    UPDATE public.tasks
    SET workspace_id = '11111111-1111-1111-1111-111111111111'
    WHERE workspace_id IS NULL;

    -- Make it NOT NULL after setting defaults
    ALTER TABLE public.tasks ALTER COLUMN workspace_id SET NOT NULL;
  END IF;
END $$;

-- ============================================================================
-- STEP 6: CREATE CAMPAIGNS AND EMAILS TABLES (if not exists)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  platform TEXT NOT NULL,
  status TEXT DEFAULT 'draft',

  budget NUMERIC(12, 2) DEFAULT 0,
  spent NUMERIC(12, 2) DEFAULT 0,
  impressions BIGINT DEFAULT 0,
  clicks BIGINT DEFAULT 0,
  conversions INTEGER DEFAULT 0,

  start_date DATE NOT NULL,
  end_date DATE,

  company TEXT,
  external_id TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.emails (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,

  from_email TEXT NOT NULL,
  from_name TEXT NOT NULL,
  to_email TEXT NOT NULL,

  subject TEXT NOT NULL,
  preview TEXT,
  body TEXT,

  unread BOOLEAN DEFAULT TRUE,
  starred BOOLEAN DEFAULT FALSE,
  archived BOOLEAN DEFAULT FALSE,

  company TEXT,
  time_received TIMESTAMPTZ DEFAULT NOW(),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- STEP 7: CREATE INDEXES
-- ============================================================================

-- Workspaces indexes
CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace ON public.workspace_members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_user ON public.workspace_members(user_id);
CREATE INDEX IF NOT EXISTS idx_workspace_settings_workspace ON public.workspace_settings(workspace_id);

-- Companies indexes
CREATE INDEX IF NOT EXISTS idx_companies_workspace ON public.companies(workspace_id);
CREATE INDEX IF NOT EXISTS idx_companies_status ON public.companies(status);

-- Projects indexes
CREATE INDEX IF NOT EXISTS idx_projects_workspace ON public.projects(workspace_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);

-- Tasks indexes
CREATE INDEX IF NOT EXISTS idx_tasks_workspace ON public.tasks(workspace_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);

-- Campaigns indexes
CREATE INDEX IF NOT EXISTS idx_campaigns_workspace ON public.campaigns(workspace_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_platform ON public.campaigns(platform);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON public.campaigns(status);

-- Emails indexes
CREATE INDEX IF NOT EXISTS idx_emails_workspace ON public.emails(workspace_id);
CREATE INDEX IF NOT EXISTS idx_emails_unread ON public.emails(unread);
CREATE INDEX IF NOT EXISTS idx_emails_starred ON public.emails(starred);

-- ============================================================================
-- STEP 8: ENABLE RLS ON ALL TABLES
-- ============================================================================

ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emails ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 9: DROP OLD POLICIES IF EXIST AND CREATE NEW ONES
-- ============================================================================

-- Drop existing policies (if any)
DROP POLICY IF EXISTS "Users can view their workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Admins can update their workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Users can view workspace companies" ON public.companies;
DROP POLICY IF EXISTS "Users can insert workspace companies" ON public.companies;
DROP POLICY IF EXISTS "Users can update workspace companies" ON public.companies;
DROP POLICY IF EXISTS "Users can view workspace projects" ON public.projects;
DROP POLICY IF EXISTS "Users can insert workspace projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update workspace projects" ON public.projects;
DROP POLICY IF EXISTS "Users can view workspace tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can insert workspace tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can update workspace tasks" ON public.tasks;

-- Workspaces policies
CREATE POLICY "Users can view their workspaces"
  ON public.workspaces FOR SELECT
  USING (
    id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can update their workspaces"
  ON public.workspaces FOR UPDATE
  USING (
    id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Companies policies
CREATE POLICY "Users can view workspace companies"
  ON public.companies FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert workspace companies"
  ON public.companies FOR INSERT
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update workspace companies"
  ON public.companies FOR UPDATE
  USING (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE user_id = auth.uid()
    )
  );

-- Projects policies
CREATE POLICY "Users can view workspace projects"
  ON public.projects FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert workspace projects"
  ON public.projects FOR INSERT
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update workspace projects"
  ON public.projects FOR UPDATE
  USING (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE user_id = auth.uid()
    )
  );

-- Tasks policies
CREATE POLICY "Users can view workspace tasks"
  ON public.tasks FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert workspace tasks"
  ON public.tasks FOR INSERT
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update workspace tasks"
  ON public.tasks FOR UPDATE
  USING (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE user_id = auth.uid()
    )
  );

-- Campaigns policies
CREATE POLICY "Users can view workspace campaigns"
  ON public.campaigns FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert workspace campaigns"
  ON public.campaigns FOR INSERT
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE user_id = auth.uid()
    )
  );

-- Emails policies
CREATE POLICY "Users can view workspace emails"
  ON public.emails FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE user_id = auth.uid()
    )
  );

-- ============================================================================
-- STEP 10: CREATE TRIGGERS FOR UPDATED_AT
-- ============================================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_workspaces_updated_at ON public.workspaces;
CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON public.workspaces
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_companies_updated_at ON public.companies;
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_tasks_updated_at ON public.tasks;
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_campaigns_updated_at ON public.campaigns;
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_emails_updated_at ON public.emails;
CREATE TRIGGER update_emails_updated_at BEFORE UPDATE ON public.emails
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
