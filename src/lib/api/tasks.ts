import { createClient } from '@/lib/supabase/client';

export interface Task {
  id: string;
  workspace_id: string;
  project_id: string | null;
  title: string;
  description: string | null;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee: any | null;
  due_date: string | null;
  tags: string[];
  attachments: number;
  comments: number;
  in_calendar: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskInput {
  project_id?: string;
  title: string;
  description?: string;
  status?: 'todo' | 'in-progress' | 'review' | 'done';
  priority?: 'low' | 'medium' | 'high';
  assignee?: any;
  due_date?: string;
  tags?: string[];
  attachments?: number;
  comments?: number;
  in_calendar?: boolean;
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {
  id: string;
}

/**
 * Load all tasks for a workspace
 */
export async function loadTasks(workspaceId: string): Promise<Task[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading tasks:', error);
    return [];
  }

  return data || [];
}

/**
 * Get a single task by ID
 */
export async function getTask(id: string): Promise<Task | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error loading task:', error);
    return null;
  }

  return data;
}

/**
 * Create a new task
 */
export async function createTask(
  workspaceId: string,
  input: CreateTaskInput
): Promise<Task | null> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error('No user found');
    return null;
  }

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      workspace_id: workspaceId,
      ...input,
      status: input.status || 'todo',
      priority: input.priority || 'medium',
      tags: input.tags || [],
      attachments: input.attachments || 0,
      comments: input.comments || 0,
      in_calendar: input.in_calendar || false,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating task:', error);
    return null;
  }

  return data;
}

/**
 * Update an existing task
 */
export async function updateTask(input: UpdateTaskInput): Promise<Task | null> {
  const supabase = createClient();

  const { id, ...updates } = input;

  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating task:', error);
    return null;
  }

  return data;
}

/**
 * Delete a task
 */
export async function deleteTask(id: string): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase.from('tasks').delete().eq('id', id);

  if (error) {
    console.error('Error deleting task:', error);
    return false;
  }

  return true;
}

/**
 * Search tasks
 */
export async function searchTasks(
  workspaceId: string,
  query: string
): Promise<Task[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('workspace_id', workspaceId)
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching tasks:', error);
    return [];
  }

  return data || [];
}

/**
 * Get tasks by project
 */
export async function getTasksByProject(
  workspaceId: string,
  projectId: string
): Promise<Task[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('workspace_id', workspaceId)
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading project tasks:', error);
    return [];
  }

  return data || [];
}

/**
 * Get overdue tasks
 */
export async function getOverdueTasks(workspaceId: string): Promise<Task[]> {
  const supabase = createClient();
  const today = new Date().toISOString();

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('workspace_id', workspaceId)
    .lt('due_date', today)
    .neq('status', 'done')
    .order('due_date', { ascending: true });

  if (error) {
    console.error('Error loading overdue tasks:', error);
    return [];
  }

  return data || [];
}

/**
 * Get task statistics
 */
export async function getTaskStats(workspaceId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('tasks')
    .select('status, priority')
    .eq('workspace_id', workspaceId);

  if (error) {
    console.error('Error loading task stats:', error);
    return {
      total: 0,
      todo: 0,
      inProgress: 0,
      review: 0,
      done: 0,
    };
  }

  const stats = {
    total: data.length,
    todo: data.filter(t => t.status === 'todo').length,
    inProgress: data.filter(t => t.status === 'in-progress').length,
    review: data.filter(t => t.status === 'review').length,
    done: data.filter(t => t.status === 'done').length,
  };

  return stats;
}
