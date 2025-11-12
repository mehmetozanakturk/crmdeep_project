-- ============================================================================
-- COMPANIES TABLE
-- ============================================================================
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  logo TEXT,
  industry TEXT,
  size TEXT, -- e.g., "10-50", "100-500"
  revenue TEXT, -- e.g., "₺1M - ₺5M"
  location TEXT,
  website TEXT,
  email TEXT,
  phone TEXT,

  contacts INTEGER DEFAULT 0,
  deals INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active', -- active, prospect, inactive
  tags TEXT[], -- Array of tags

  agreement_date TIMESTAMPTZ,
  priority TEXT DEFAULT 'medium', -- low, medium, high, critical
  last_activity_date TIMESTAMPTZ,
  total_revenue TEXT,
  description TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX idx_companies_workspace ON public.companies(workspace_id);
CREATE INDEX idx_companies_status ON public.companies(status);
CREATE INDEX idx_companies_priority ON public.companies(priority);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Users can view companies in their workspaces
CREATE POLICY "Users can view workspace companies"
  ON public.companies FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE user_id = auth.uid()
    )
  );

-- Users can insert companies in their workspaces
CREATE POLICY "Users can insert workspace companies"
  ON public.companies FOR INSERT
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE user_id = auth.uid()
    )
  );

-- Users can update companies in their workspaces
CREATE POLICY "Users can update workspace companies"
  ON public.companies FOR UPDATE
  USING (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE user_id = auth.uid()
    )
  );

-- Admins can delete companies
CREATE POLICY "Admins can delete workspace companies"
  ON public.companies FOR DELETE
  USING (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- TRIGGERS
-- ============================================================================
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
