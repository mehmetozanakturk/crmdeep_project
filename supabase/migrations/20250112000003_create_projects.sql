-- ============================================================================
-- PROJECTS TABLE
-- ============================================================================
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,

  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active', -- active, completed, on-hold, at-risk
  priority TEXT DEFAULT 'medium', -- low, medium, high

  progress INTEGER DEFAULT 0, -- 0-100
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,

  tasks_total INTEGER DEFAULT 0,
  tasks_completed INTEGER DEFAULT 0,

  brand TEXT, -- Legacy field for workspace name
  team_members JSONB DEFAULT '[]'::jsonb, -- Array of team member objects

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX idx_projects_workspace ON public.projects(workspace_id);
CREATE INDEX idx_projects_company ON public.projects(company_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_priority ON public.projects(priority);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Users can view projects in their workspaces
CREATE POLICY "Users can view workspace projects"
  ON public.projects FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE user_id = auth.uid()
    )
  );

-- Users can insert projects in their workspaces
CREATE POLICY "Users can insert workspace projects"
  ON public.projects FOR INSERT
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE user_id = auth.uid()
    )
  );

-- Users can update projects in their workspaces
CREATE POLICY "Users can update workspace projects"
  ON public.projects FOR UPDATE
  USING (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE user_id = auth.uid()
    )
  );

-- Users can delete projects in their workspaces
CREATE POLICY "Users can delete workspace projects"
  ON public.projects FOR DELETE
  USING (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE user_id = auth.uid()
    )
  );

-- ============================================================================
-- TRIGGERS
-- ============================================================================
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
