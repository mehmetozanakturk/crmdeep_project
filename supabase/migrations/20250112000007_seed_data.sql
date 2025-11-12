-- ============================================================================
-- SEED DATA FOR DEVELOPMENT/TESTING
-- ============================================================================

-- Note: This seed data is for development only
-- In production, workspaces will be created when users register

-- Insert default workspaces
INSERT INTO public.workspaces (id, name, domain, color, description) VALUES
  ('11111111-1111-1111-1111-111111111111', 'RendxAI', 'rendxai.com', '#3B82F6', 'AI-powered marketing automation'),
  ('22222222-2222-2222-2222-222222222222', 'AllMediaI', 'allmediai.com', '#10B981', 'Full-service media agency'),
  ('33333333-3333-3333-3333-333333333333', 'AutoMexus', 'automexus.com', '#8B5CF6', 'Automotive excellence');

-- Insert workspace settings (initially empty - will be configured via UI)
INSERT INTO public.workspace_settings (workspace_id) VALUES
  ('11111111-1111-1111-1111-111111111111'),
  ('22222222-2222-2222-2222-222222222222'),
  ('33333333-3333-3333-3333-333333333333');

-- Note: workspace_members will be created automatically when users sign up
-- and select/create their workspace

-- The following commented example shows how to assign a user to a workspace:
-- INSERT INTO public.workspace_members (workspace_id, user_id, role) VALUES
--   ('11111111-1111-1111-1111-111111111111', 'USER_UUID_HERE', 'admin');
