-- CRMDeep Row Level Security (RLS) Policies
-- This migration enables RLS and creates security policies for all tables

-- ============================================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_checklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PROFILES POLICIES
-- ============================================================================
CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- ============================================================================
-- ORGANIZATIONS POLICIES
-- ============================================================================
CREATE POLICY "Users can view organizations they are members of"
ON organizations FOR SELECT
USING (
  id IN (
    SELECT organization_id FROM organization_members
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can create organizations"
ON organizations FOR INSERT
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Organization owners can update their organizations"
ON organizations FOR UPDATE
USING (
  id IN (
    SELECT organization_id FROM organization_members
    WHERE user_id = auth.uid() AND role = 'owner'
  )
);

CREATE POLICY "Organization owners can delete their organizations"
ON organizations FOR DELETE
USING (auth.uid() = owner_id);

-- ============================================================================
-- ORGANIZATION_MEMBERS POLICIES
-- ============================================================================
CREATE POLICY "Users can view members of their organizations"
ON organization_members FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id FROM organization_members
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Owners and admins can add members"
ON organization_members FOR INSERT
WITH CHECK (
  organization_id IN (
    SELECT organization_id FROM organization_members
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
  )
);

CREATE POLICY "Owners and admins can update member roles"
ON organization_members FOR UPDATE
USING (
  organization_id IN (
    SELECT organization_id FROM organization_members
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
  )
);

CREATE POLICY "Owners and admins can remove members"
ON organization_members FOR DELETE
USING (
  organization_id IN (
    SELECT organization_id FROM organization_members
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
  )
);

-- ============================================================================
-- BRANDS POLICIES
-- ============================================================================
CREATE POLICY "Users can view brands in their organizations"
ON brands FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id FROM organization_members
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins can create brands"
ON brands FOR INSERT
WITH CHECK (
  organization_id IN (
    SELECT organization_id FROM organization_members
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
  )
);

CREATE POLICY "Admins can update brands"
ON brands FOR UPDATE
USING (
  organization_id IN (
    SELECT organization_id FROM organization_members
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
  )
);

CREATE POLICY "Admins can delete brands"
ON brands FOR DELETE
USING (
  organization_id IN (
    SELECT organization_id FROM organization_members
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
  )
);

-- ============================================================================
-- PROJECTS POLICIES
-- ============================================================================
CREATE POLICY "Users can view projects in their organizations"
ON projects FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id FROM organization_members
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Members can create projects"
ON projects FOR INSERT
WITH CHECK (
  organization_id IN (
    SELECT organization_id FROM organization_members
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Project members can update projects"
ON projects FOR UPDATE
USING (
  id IN (
    SELECT project_id FROM project_members
    WHERE user_id = auth.uid()
  )
  OR
  organization_id IN (
    SELECT organization_id FROM organization_members
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
  )
);

CREATE POLICY "Admins can delete projects"
ON projects FOR DELETE
USING (
  organization_id IN (
    SELECT organization_id FROM organization_members
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
  )
);

-- ============================================================================
-- PROJECT_MEMBERS POLICIES
-- ============================================================================
CREATE POLICY "Users can view project members if they have access to the project"
ON project_members FOR SELECT
USING (
  project_id IN (
    SELECT project_id FROM project_members
    WHERE user_id = auth.uid()
  )
  OR
  project_id IN (
    SELECT p.id FROM projects p
    INNER JOIN organization_members om ON om.organization_id = p.organization_id
    WHERE om.user_id = auth.uid() AND om.role IN ('owner', 'admin')
  )
);

CREATE POLICY "Project admins can add members"
ON project_members FOR INSERT
WITH CHECK (
  project_id IN (
    SELECT project_id FROM project_members
    WHERE user_id = auth.uid() AND role = 'admin'
  )
  OR
  project_id IN (
    SELECT p.id FROM projects p
    INNER JOIN organization_members om ON om.organization_id = p.organization_id
    WHERE om.user_id = auth.uid() AND om.role IN ('owner', 'admin')
  )
);

-- ============================================================================
-- TASKS POLICIES
-- ============================================================================
CREATE POLICY "Users can view tasks in projects they have access to"
ON tasks FOR SELECT
USING (
  project_id IN (
    SELECT project_id FROM project_members
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Project members can create tasks"
ON tasks FOR INSERT
WITH CHECK (
  project_id IN (
    SELECT project_id FROM project_members
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Project members can update tasks"
ON tasks FOR UPDATE
USING (
  project_id IN (
    SELECT project_id FROM project_members
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Project admins can delete tasks"
ON tasks FOR DELETE
USING (
  project_id IN (
    SELECT project_id FROM project_members
    WHERE user_id = auth.uid() AND role = 'admin'
  )
  OR
  project_id IN (
    SELECT p.id FROM projects p
    INNER JOIN organization_members om ON om.organization_id = p.organization_id
    WHERE om.user_id = auth.uid() AND om.role IN ('owner', 'admin')
  )
);

-- ============================================================================
-- TASK_CHECKLIST POLICIES
-- ============================================================================
CREATE POLICY "Users can manage checklist items for accessible tasks"
ON task_checklist FOR ALL
USING (
  task_id IN (
    SELECT t.id FROM tasks t
    INNER JOIN project_members pm ON pm.project_id = t.project_id
    WHERE pm.user_id = auth.uid()
  )
);

-- ============================================================================
-- TASK_LABELS POLICIES
-- ============================================================================
CREATE POLICY "Users can manage labels for accessible tasks"
ON task_labels FOR ALL
USING (
  task_id IN (
    SELECT t.id FROM tasks t
    INNER JOIN project_members pm ON pm.project_id = t.project_id
    WHERE pm.user_id = auth.uid()
  )
);

-- ============================================================================
-- ATTACHMENTS POLICIES
-- ============================================================================
CREATE POLICY "Users can view attachments in their organizations"
ON attachments FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id FROM organization_members
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can upload attachments to their organizations"
ON attachments FOR INSERT
WITH CHECK (
  organization_id IN (
    SELECT organization_id FROM organization_members
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their own attachments"
ON attachments FOR DELETE
USING (uploaded_by = auth.uid());

-- ============================================================================
-- ACTIVITY_LOGS POLICIES
-- ============================================================================
CREATE POLICY "Users can view activity logs in their organizations"
ON activity_logs FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id FROM organization_members
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "System can insert activity logs"
ON activity_logs FOR INSERT
WITH CHECK (true);
