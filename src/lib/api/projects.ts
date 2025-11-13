import { createClient } from '@/lib/supabase/client';

export interface Project {
  id: string;
  organization_id: string;
  name: string;
  description: string | null;
  status: 'active' | 'completed' | 'on-hold' | 'at-risk';
  progress: number;
  start_date: string | null;
  end_date: string | null;
  budget: number | null;
  client: string | null;
  team_members: string[] | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
  status?: Project['status'];
  progress?: number;
  start_date?: string;
  end_date?: string;
  budget?: number;
  client?: string;
  team_members?: string[];
  tags?: string[];
}

export interface UpdateProjectInput extends Partial<CreateProjectInput> {
  id: string;
}

export interface ProjectTask {
  id: string;
  title: string;
  status: string;
  priority: string;
  due_date: string | null;
  assignee_name: string | null;
}

/**
 * Load all projects for an organization
 */
export async function loadProjects(organizationId: string): Promise<Project[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading projects:', error);
    return [];
  }

  return data || [];
}

/**
 * Get a single project by ID
 */
export async function getProject(id: string): Promise<Project | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error loading project:', error);
    return null;
  }

  return data;
}

/**
 * Create a new project
 */
export async function createProject(
  organizationId: string,
  input: CreateProjectInput
): Promise<Project | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('projects')
    .insert({
      organization_id: organizationId,
      name: input.name,
      description: input.description || null,
      status: input.status || 'active',
      progress: input.progress || 0,
      start_date: input.start_date || null,
      end_date: input.end_date || null,
      budget: input.budget || null,
      client: input.client || null,
      team_members: input.team_members || [],
      tags: input.tags || [],
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating project:', error);
    return null;
  }

  return data;
}

/**
 * Update an existing project
 */
export async function updateProject(input: UpdateProjectInput): Promise<Project | null> {
  const supabase = createClient();

  const { id, ...updates } = input;

  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating project:', error);
    return null;
  }

  return data;
}

/**
 * Delete a project
 */
export async function deleteProject(id: string): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase.from('projects').delete().eq('id', id);

  if (error) {
    console.error('Error deleting project:', error);
    return false;
  }

  return true;
}

/**
 * Get tasks for a project
 */
export async function getProjectTasks(
  organizationId: string,
  projectName: string
): Promise<ProjectTask[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('tasks')
    .select('id, title, status, priority, due_date, assignee_name')
    .eq('organization_id', organizationId)
    .eq('project', projectName)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading project tasks:', error);
    return [];
  }

  return data || [];
}

/**
 * Get project statistics
 */
export async function getProjectStats(organizationId: string) {
  const projects = await loadProjects(organizationId);

  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === 'active').length;
  const completedProjects = projects.filter((p) => p.status === 'completed').length;
  const atRiskProjects = projects.filter((p) => p.status === 'at-risk').length;
  const onHoldProjects = projects.filter((p) => p.status === 'on-hold').length;

  const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
  const averageProgress = projects.length > 0
    ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)
    : 0;

  return {
    totalProjects,
    activeProjects,
    completedProjects,
    atRiskProjects,
    onHoldProjects,
    totalBudget,
    averageProgress,
  };
}

/**
 * Search projects
 */
export async function searchProjects(
  organizationId: string,
  query: string
): Promise<Project[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('organization_id', organizationId)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%,client.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching projects:', error);
    return [];
  }

  return data || [];
}

/**
 * Get projects by status
 */
export async function getProjectsByStatus(
  organizationId: string,
  status: Project['status']
): Promise<Project[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading projects by status:', error);
    return [];
  }

  return data || [];
}

/**
 * Get projects with upcoming deadlines (next 7 days)
 */
export async function getUpcomingDeadlines(organizationId: string): Promise<Project[]> {
  const supabase = createClient();

  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('organization_id', organizationId)
    .gte('end_date', today.toISOString().split('T')[0])
    .lte('end_date', nextWeek.toISOString().split('T')[0])
    .order('end_date', { ascending: true });

  if (error) {
    console.error('Error loading upcoming deadlines:', error);
    return [];
  }

  return data || [];
}
