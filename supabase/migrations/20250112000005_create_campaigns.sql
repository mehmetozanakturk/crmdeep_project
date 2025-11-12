-- ============================================================================
-- CAMPAIGNS TABLE
-- ============================================================================
CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  platform TEXT NOT NULL, -- meta, google, linkedin, twitter
  status TEXT DEFAULT 'draft', -- active, paused, completed, draft

  budget NUMERIC(12, 2) DEFAULT 0,
  spent NUMERIC(12, 2) DEFAULT 0,
  impressions BIGINT DEFAULT 0,
  clicks BIGINT DEFAULT 0,
  conversions INTEGER DEFAULT 0,

  start_date DATE NOT NULL,
  end_date DATE,

  company TEXT, -- Company name (optional)
  external_id TEXT, -- ID from Meta/Google Ads API

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX idx_campaigns_workspace ON public.campaigns(workspace_id);
CREATE INDEX idx_campaigns_platform ON public.campaigns(platform);
CREATE INDEX idx_campaigns_status ON public.campaigns(status);
CREATE INDEX idx_campaigns_external_id ON public.campaigns(external_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- Users can view campaigns in their workspaces
CREATE POLICY "Users can view workspace campaigns"
  ON public.campaigns FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE user_id = auth.uid()
    )
  );

-- Users can insert campaigns in their workspaces
CREATE POLICY "Users can insert workspace campaigns"
  ON public.campaigns FOR INSERT
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE user_id = auth.uid()
    )
  );

-- Users can update campaigns in their workspaces
CREATE POLICY "Users can update workspace campaigns"
  ON public.campaigns FOR UPDATE
  USING (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE user_id = auth.uid()
    )
  );

-- Users can delete campaigns in their workspaces
CREATE POLICY "Users can delete workspace campaigns"
  ON public.campaigns FOR DELETE
  USING (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE user_id = auth.uid()
    )
  );

-- ============================================================================
-- TRIGGERS
-- ============================================================================
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
