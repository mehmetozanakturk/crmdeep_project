-- ============================================================================
-- TASKS TABLE
-- ============================================================================
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,

  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo', -- todo, in-progress, review, done
  priority TEXT DEFAULT 'medium', -- low, medium, high

  assignee JSONB, -- Object with name, initials, color
  due_date DATE NOT NULL,

  project TEXT, -- Project name (legacy)
  tags TEXT[], -- Array of tags

  attachments INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  in_calendar BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX idx_tasks_workspace ON public.tasks(workspace_id);
CREATE INDEX idx_tasks_project ON public.tasks(project_id);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_tasks_priority ON public.tasks(priority);
CREATE INDEX idx_tasks_due_date ON public.tasks(due_date);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Users can view tasks in their workspaces
CREATE POLICY "Users can view workspace tasks"
  ON public.tasks FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE user_id = auth.uid()
    )
  );

-- Users can insert tasks in their workspaces
CREATE POLICY "Users can insert workspace tasks"
  ON public.tasks FOR INSERT
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE user_id = auth.uid()
    )
  );

-- Users can update tasks in their workspaces
CREATE POLICY "Users can update workspace tasks"
  ON public.tasks FOR UPDATE
  USING (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE user_id = auth.uid()
    )
  );

-- Users can delete tasks in their workspaces
CREATE POLICY "Users can delete workspace tasks"
  ON public.tasks FOR DELETE
  USING (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE user_id = auth.uid()
    )
  );

-- ============================================================================
-- TRIGGERS
-- ============================================================================
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
