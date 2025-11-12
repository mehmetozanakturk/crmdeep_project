-- ============================================================================
-- GÜVENLİ WORKSPACE MİGRATION - Mevcut Yapıyı Bozmadan Ekler
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- STEP 1: CREATE WORKSPACES TABLE
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

  meta_ads_enabled BOOLEAN DEFAULT FALSE,
  meta_ads_access_token TEXT,
  meta_ads_ad_account_id TEXT,
  meta_ads_status TEXT DEFAULT 'disconnected',
  meta_ads_last_sync TIMESTAMPTZ,
  meta_ads_error_message TEXT,

  google_ads_enabled BOOLEAN DEFAULT FALSE,
  google_ads_client_id TEXT,
  google_ads_client_secret TEXT,
  google_ads_refresh_token TEXT,
  google_ads_customer_id TEXT,
  google_ads_status TEXT DEFAULT 'disconnected',
  google_ads_last_sync TIMESTAMPTZ,
  google_ads_error_message TEXT,

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

INSERT INTO public.workspace_settings (workspace_id) VALUES
  ('11111111-1111-1111-1111-111111111111'),
  ('22222222-2222-2222-2222-222222222222'),
  ('33333333-3333-3333-3333-333333333333')
ON CONFLICT (workspace_id) DO NOTHING;

-- ============================================================================
-- STEP 5: ADD MISSING COLUMNS TO PROFILES
-- ============================================================================
DO $$
BEGIN
  -- Add default_workspace_id if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'default_workspace_id'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN default_workspace_id UUID REFERENCES public.workspaces(id) ON DELETE SET NULL;
  END IF;
END $$;

-- ============================================================================
-- STEP 6: ADD WORKSPACE_ID TO COMPANIES
-- ============================================================================
DO $$
BEGIN
  -- Add workspace_id
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'companies' AND column_name = 'workspace_id'
  ) THEN
    ALTER TABLE public.companies ADD COLUMN workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE;
    UPDATE public.companies SET workspace_id = '11111111-1111-1111-1111-111111111111' WHERE workspace_id IS NULL;
    ALTER TABLE public.companies ALTER COLUMN workspace_id SET NOT NULL;
  END IF;

  -- Add status if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'companies' AND column_name = 'status'
  ) THEN
    ALTER TABLE public.companies ADD COLUMN status TEXT DEFAULT 'active';
  END IF;

  -- Add priority if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'companies' AND column_name = 'priority'
  ) THEN
    ALTER TABLE public.companies ADD COLUMN priority TEXT DEFAULT 'medium';
  END IF;

  -- Add tags if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'companies' AND column_name = 'tags'
  ) THEN
    ALTER TABLE public.companies ADD COLUMN tags TEXT[];
  END IF;

  -- Add agreement_date if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'companies' AND column_name = 'agreement_date'
  ) THEN
    ALTER TABLE public.companies ADD COLUMN agreement_date TIMESTAMPTZ;
  END IF;

  -- Add last_activity_date if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'companies' AND column_name = 'last_activity_date'
  ) THEN
    ALTER TABLE public.companies ADD COLUMN last_activity_date TIMESTAMPTZ;
  END IF;

  -- Add total_revenue if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'companies' AND column_name = 'total_revenue'
  ) THEN
    ALTER TABLE public.companies ADD COLUMN total_revenue TEXT;
  END IF;
END $$;

-- ============================================================================
-- STEP 7: ADD WORKSPACE_ID TO PROJECTS
-- ============================================================================
DO $$
BEGIN
  -- Add workspace_id
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'workspace_id'
  ) THEN
    ALTER TABLE public.projects ADD COLUMN workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE;
    UPDATE public.projects SET workspace_id = '11111111-1111-1111-1111-111111111111' WHERE workspace_id IS NULL;
    ALTER TABLE public.projects ALTER COLUMN workspace_id SET NOT NULL;
  END IF;

  -- Add status if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'status'
  ) THEN
    ALTER TABLE public.projects ADD COLUMN status TEXT DEFAULT 'active';
  END IF;

  -- Add priority if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'priority'
  ) THEN
    ALTER TABLE public.projects ADD COLUMN priority TEXT DEFAULT 'medium';
  END IF;

  -- Add progress if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'progress'
  ) THEN
    ALTER TABLE public.projects ADD COLUMN progress INTEGER DEFAULT 0;
  END IF;

  -- Add tasks_total if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'tasks_total'
  ) THEN
    ALTER TABLE public.projects ADD COLUMN tasks_total INTEGER DEFAULT 0;
  END IF;

  -- Add tasks_completed if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'tasks_completed'
  ) THEN
    ALTER TABLE public.projects ADD COLUMN tasks_completed INTEGER DEFAULT 0;
  END IF;

  -- Add team_members if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'team_members'
  ) THEN
    ALTER TABLE public.projects ADD COLUMN team_members JSONB DEFAULT '[]'::jsonb;
  END IF;

  -- Add brand if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'brand'
  ) THEN
    ALTER TABLE public.projects ADD COLUMN brand TEXT;
  END IF;

  -- Add company_id if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'company_id'
  ) THEN
    ALTER TABLE public.projects ADD COLUMN company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL;
  END IF;
END $$;

-- ============================================================================
-- STEP 8: ADD WORKSPACE_ID TO TASKS
-- ============================================================================
DO $$
BEGIN
  -- Add workspace_id
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'workspace_id'
  ) THEN
    ALTER TABLE public.tasks ADD COLUMN workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE;
    UPDATE public.tasks SET workspace_id = '11111111-1111-1111-1111-111111111111' WHERE workspace_id IS NULL;
    ALTER TABLE public.tasks ALTER COLUMN workspace_id SET NOT NULL;
  END IF;

  -- Add status if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'status'
  ) THEN
    ALTER TABLE public.tasks ADD COLUMN status TEXT DEFAULT 'todo';
  END IF;

  -- Add priority if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'priority'
  ) THEN
    ALTER TABLE public.tasks ADD COLUMN priority TEXT DEFAULT 'medium';
  END IF;

  -- Add assignee if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'assignee'
  ) THEN
    ALTER TABLE public.tasks ADD COLUMN assignee JSONB;
  END IF;

  -- Add tags if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'tags'
  ) THEN
    ALTER TABLE public.tasks ADD COLUMN tags TEXT[];
  END IF;

  -- Add attachments if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'attachments'
  ) THEN
    ALTER TABLE public.tasks ADD COLUMN attachments INTEGER DEFAULT 0;
  END IF;

  -- Add comments if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'comments'
  ) THEN
    ALTER TABLE public.tasks ADD COLUMN comments INTEGER DEFAULT 0;
  END IF;

  -- Add in_calendar if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'in_calendar'
  ) THEN
    ALTER TABLE public.tasks ADD COLUMN in_calendar BOOLEAN DEFAULT FALSE;
  END IF;

  -- Add project if not exists (legacy field)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'project'
  ) THEN
    ALTER TABLE public.tasks ADD COLUMN project TEXT;
  END IF;

  -- Add project_id if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'project_id'
  ) THEN
    ALTER TABLE public.tasks ADD COLUMN project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL;
  END IF;
END $$;

-- ============================================================================
-- STEP 9: CREATE CAMPAIGNS TABLE
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

-- ============================================================================
-- STEP 10: CREATE EMAILS TABLE
-- ============================================================================
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
-- STEP 11: CREATE INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace ON public.workspace_members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_user ON public.workspace_members(user_id);
CREATE INDEX IF NOT EXISTS idx_workspace_settings_workspace ON public.workspace_settings(workspace_id);
CREATE INDEX IF NOT EXISTS idx_companies_workspace ON public.companies(workspace_id);
CREATE INDEX IF NOT EXISTS idx_projects_workspace ON public.projects(workspace_id);
CREATE INDEX IF NOT EXISTS idx_projects_company ON public.projects(company_id);
CREATE INDEX IF NOT EXISTS idx_tasks_workspace ON public.tasks(workspace_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project ON public.tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_workspace ON public.campaigns(workspace_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_platform ON public.campaigns(platform);
CREATE INDEX IF NOT EXISTS idx_emails_workspace ON public.emails(workspace_id);
CREATE INDEX IF NOT EXISTS idx_emails_unread ON public.emails(unread);

-- ============================================================================
-- STEP 12: ENABLE RLS
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
-- STEP 13: CREATE RLS POLICIES
-- ============================================================================

-- Drop old policies if exist
DROP POLICY IF EXISTS "Users can view their workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Admins can update their workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Admins can view workspace settings" ON public.workspace_settings;
DROP POLICY IF EXISTS "Admins can update workspace settings" ON public.workspace_settings;
DROP POLICY IF EXISTS "Admins can insert workspace settings" ON public.workspace_settings;
DROP POLICY IF EXISTS "Members can view workspace members" ON public.workspace_members;
DROP POLICY IF EXISTS "Admins can insert workspace members" ON public.workspace_members;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view workspace companies" ON public.companies;
DROP POLICY IF EXISTS "Users can insert workspace companies" ON public.companies;
DROP POLICY IF EXISTS "Users can update workspace companies" ON public.companies;
DROP POLICY IF EXISTS "Users can view workspace projects" ON public.projects;
DROP POLICY IF EXISTS "Users can insert workspace projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update workspace projects" ON public.projects;
DROP POLICY IF EXISTS "Users can view workspace tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can insert workspace tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can update workspace tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can view workspace campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Users can insert workspace campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Users can view workspace emails" ON public.emails;

-- Workspaces
CREATE POLICY "Users can view their workspaces"
  ON public.workspaces FOR SELECT
  USING (id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Admins can update their workspaces"
  ON public.workspaces FOR UPDATE
  USING (id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid() AND role = 'admin'));

-- Workspace Settings
CREATE POLICY "Admins can view workspace settings"
  ON public.workspace_settings FOR SELECT
  USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update workspace settings"
  ON public.workspace_settings FOR UPDATE
  USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can insert workspace settings"
  ON public.workspace_settings FOR INSERT
  WITH CHECK (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid() AND role = 'admin'));

-- Workspace Members
CREATE POLICY "Members can view workspace members"
  ON public.workspace_members FOR SELECT
  USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Admins can insert workspace members"
  ON public.workspace_members FOR INSERT
  WITH CHECK (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid() AND role = 'admin'));

-- Profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Companies
CREATE POLICY "Users can view workspace companies"
  ON public.companies FOR SELECT
  USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert workspace companies"
  ON public.companies FOR INSERT
  WITH CHECK (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can update workspace companies"
  ON public.companies FOR UPDATE
  USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

-- Projects
CREATE POLICY "Users can view workspace projects"
  ON public.projects FOR SELECT
  USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert workspace projects"
  ON public.projects FOR INSERT
  WITH CHECK (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can update workspace projects"
  ON public.projects FOR UPDATE
  USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

-- Tasks
CREATE POLICY "Users can view workspace tasks"
  ON public.tasks FOR SELECT
  USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert workspace tasks"
  ON public.tasks FOR INSERT
  WITH CHECK (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can update workspace tasks"
  ON public.tasks FOR UPDATE
  USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

-- Campaigns
CREATE POLICY "Users can view workspace campaigns"
  ON public.campaigns FOR SELECT
  USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert workspace campaigns"
  ON public.campaigns FOR INSERT
  WITH CHECK (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

-- Emails
CREATE POLICY "Users can view workspace emails"
  ON public.emails FOR SELECT
  USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

-- ============================================================================
-- STEP 14: CREATE TRIGGERS
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
