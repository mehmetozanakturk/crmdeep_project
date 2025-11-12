import { createClient } from '@/lib/supabase/client';

export interface Project {
  id: string;
  workspace_id: string;
  company_id: string | null;
  name: string;
  description: string | null;
  status: 'active' | 'completed' | 'on-hold' | 'at-risk';
  priority: 'low' | 'medium' | 'high';
  progress: number;
  start_date: string | null;
  end_date: string | null;
  budget: number | null;
  team_members: any[];
  tags: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectInput {
  company_id?: string;
  name: string;
  description?: string;
  status?: 'active' | 'completed' | 'on-hold' | 'at-risk';
  priority?: 'low' | 'medium' | 'high';
  progress?: number;
  start_date?: string;
  end_date?: string;
  budget?: number;
  team_members?: any[];
  tags?: string[];
}

export interface UpdateProjectInput extends Partial<CreateProjectInput> {
  id: string;
}

/**
 * Load all projects for a workspace
 */
export async function loadProjects(workspaceId: string): Promise<Project[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('workspace_id', workspaceId)
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
  workspaceId: string,
  input: CreateProjectInput
): Promise<Project | null> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error('No user found');
    return null;
  }

  const { data, error } = await supabase
    .from('projects')
    .insert({
      workspace_id: workspaceId,
      ...input,
      status: input.status || 'active',
      priority: input.priority || 'medium',
      progress: input.progress || 0,
      team_members: input.team_members || [],
      tags: input.tags || [],
      created_by: user.id,
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
 * Search projects
 */
export async function searchProjects(
  workspaceId: string,
  query: string
): Promise<Project[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('workspace_id', workspaceId)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching projects:', error);
    return [];
  }

  return data || [];
}

/**
 * Get projects by company
 */
export async function getProjectsByCompany(
  workspaceId: string,
  companyId: string
): Promise<Project[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('workspace_id', workspaceId)
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading company projects:', error);
    return [];
  }

  return data || [];
}

/**
 * Get project statistics
 */
export async function getProjectStats(workspaceId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('projects')
    .select('status, priority')
    .eq('workspace_id', workspaceId);

  if (error) {
    console.error('Error loading project stats:', error);
    return {
      total: 0,
      active: 0,
      completed: 0,
      onHold: 0,
      atRisk: 0,
    };
  }

  const stats = {
    total: data.length,
    active: data.filter(p => p.status === 'active').length,
    completed: data.filter(p => p.status === 'completed').length,
    onHold: data.filter(p => p.status === 'on-hold').length,
    atRisk: data.filter(p => p.status === 'at-risk').length,
  };

  return stats;
}
