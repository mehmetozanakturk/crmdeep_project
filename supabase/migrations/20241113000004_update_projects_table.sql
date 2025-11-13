-- ============================================================================
-- Projects Table Updates
-- ============================================================================
-- This migration adds constraints, indexes, and RLS policies for projects

-- Add CHECK constraint for status field (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'projects_status_check'
  ) THEN
    ALTER TABLE projects
    ADD CONSTRAINT projects_status_check
    CHECK (status IN ('active', 'completed', 'on-hold', 'at-risk'));
  END IF;
END $$;

-- Update default status if needed
ALTER TABLE projects ALTER COLUMN status SET DEFAULT 'active';

-- Add updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for projects table
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_client ON projects(client);
CREATE INDEX IF NOT EXISTS idx_projects_start_date ON projects(start_date);
CREATE INDEX IF NOT EXISTS idx_projects_end_date ON projects(end_date);
CREATE INDEX IF NOT EXISTS idx_projects_team_members ON projects USING GIN (team_members);
CREATE INDEX IF NOT EXISTS idx_projects_tags ON projects USING GIN (tags);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their organization projects" ON projects;
DROP POLICY IF EXISTS "Users can insert projects" ON projects;
DROP POLICY IF EXISTS "Users can update projects" ON projects;
DROP POLICY IF EXISTS "Users can delete projects" ON projects;

-- Create RLS policies for projects
CREATE POLICY "Users can view their organization projects"
  ON projects FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert projects"
  ON projects FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update projects"
  ON projects FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can delete projects"
  ON projects FOR DELETE
  USING (auth.role() = 'authenticated');

-- Add comment to table
COMMENT ON TABLE projects IS 'Projects with team members, tasks, and budget tracking';

-- Add comments to important columns
COMMENT ON COLUMN projects.status IS 'Project status: active, completed, on-hold, at-risk';
COMMENT ON COLUMN projects.progress IS 'Project completion percentage (0-100)';
COMMENT ON COLUMN projects.team_members IS 'Array of team member names';
COMMENT ON COLUMN projects.tags IS 'Array of project tags for categorization';
COMMENT ON COLUMN projects.client IS 'Client or customer name for the project';
COMMENT ON COLUMN projects.budget IS 'Project budget in dollars';
