-- ============================================================================
-- EMAILS TABLE (Inbox)
-- ============================================================================
CREATE TABLE public.emails (
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

  company TEXT, -- Associated company name
  time_received TIMESTAMPTZ DEFAULT NOW(),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX idx_emails_workspace ON public.emails(workspace_id);
CREATE INDEX idx_emails_unread ON public.emails(unread);
CREATE INDEX idx_emails_starred ON public.emails(starred);
CREATE INDEX idx_emails_archived ON public.emails(archived);
CREATE INDEX idx_emails_time_received ON public.emails(time_received DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================
ALTER TABLE public.emails ENABLE ROW LEVEL SECURITY;

-- Users can view emails in their workspaces
CREATE POLICY "Users can view workspace emails"
  ON public.emails FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE user_id = auth.uid()
    )
  );

-- Users can insert emails in their workspaces
CREATE POLICY "Users can insert workspace emails"
  ON public.emails FOR INSERT
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE user_id = auth.uid()
    )
  );

-- Users can update emails in their workspaces
CREATE POLICY "Users can update workspace emails"
  ON public.emails FOR UPDATE
  USING (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE user_id = auth.uid()
    )
  );

-- Users can delete emails in their workspaces
CREATE POLICY "Users can delete workspace emails"
  ON public.emails FOR DELETE
  USING (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE user_id = auth.uid()
    )
  );

-- ============================================================================
-- TRIGGERS
-- ============================================================================
CREATE TRIGGER update_emails_updated_at BEFORE UPDATE ON public.emails
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
