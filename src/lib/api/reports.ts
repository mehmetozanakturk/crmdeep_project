import { createClient } from '@/lib/supabase/client';

export interface ReportConfig {
  dataSource: 'deals' | 'contacts' | 'companies' | 'campaigns' | 'tasks' | 'projects';
  chartType: 'bar' | 'line' | 'area' | 'pie';
  metric: 'revenue' | 'count' | 'average' | 'conversion-rate';
  groupBy: 'day' | 'week' | 'month' | 'quarter' | 'year' | 'status' | 'assignee';
  dateRange: string;
  filters: Array<{
    field: string;
    operator: string;
    value: any;
  }>;
  customDateStart?: string;
  customDateEnd?: string;
}

export interface CustomReport {
  id: string;
  organization_id: string;
  name: string;
  description?: string;
  config: ReportConfig;
  is_scheduled: boolean;
  schedule_frequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  schedule_time?: string;
  schedule_recipients?: string[];
  last_generated_at?: string;
  next_scheduled_at?: string;
  is_public: boolean;
  created_by: string;
  view_count: number;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateReportInput {
  name: string;
  description?: string;
  config: ReportConfig;
  is_scheduled?: boolean;
  schedule_frequency?: CustomReport['schedule_frequency'];
  schedule_time?: string;
  schedule_recipients?: string[];
  is_public?: boolean;
  tags?: string[];
}

export interface UpdateReportInput extends Partial<CreateReportInput> {
  id: string;
}

/**
 * Load all custom reports for an organization
 */
export async function loadCustomReports(organizationId: string): Promise<CustomReport[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('custom_reports')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading custom reports:', error);
    return [];
  }

  return data || [];
}

/**
 * Get a single custom report by ID
 */
export async function getCustomReport(id: string): Promise<CustomReport | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('custom_reports')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error loading custom report:', error);
    return null;
  }

  // Increment view count
  await supabase.rpc('increment_report_views', { report_uuid: id });

  return data;
}

/**
 * Create a new custom report
 */
export async function createCustomReport(
  organizationId: string,
  input: CreateReportInput
): Promise<CustomReport | null> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error('No user found');
    return null;
  }

  // Calculate next scheduled time if scheduled
  let next_scheduled_at = null;
  if (input.is_scheduled && input.schedule_frequency) {
    const now = new Date();
    next_scheduled_at = await calculateNextSchedule(input.schedule_frequency, now);
  }

  const { data, error } = await supabase
    .from('custom_reports')
    .insert({
      organization_id: organizationId,
      ...input,
      next_scheduled_at,
      created_by: user.id,
      view_count: 0,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating custom report:', error);
    return null;
  }

  return data;
}

/**
 * Update an existing custom report
 */
export async function updateCustomReport(input: UpdateReportInput): Promise<CustomReport | null> {
  const supabase = createClient();

  const { id, ...updates } = input;

  // Recalculate next scheduled time if schedule changed
  if (updates.is_scheduled && updates.schedule_frequency) {
    const now = new Date();
    const next_scheduled_at = await calculateNextSchedule(updates.schedule_frequency, now);
    (updates as any).next_scheduled_at = next_scheduled_at;
  }

  const { data, error } = await supabase
    .from('custom_reports')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating custom report:', error);
    return null;
  }

  return data;
}

/**
 * Delete a custom report
 */
export async function deleteCustomReport(id: string): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase.from('custom_reports').delete().eq('id', id);

  if (error) {
    console.error('Error deleting custom report:', error);
    return false;
  }

  return true;
}

/**
 * Search custom reports
 */
export async function searchCustomReports(
  organizationId: string,
  query: string
): Promise<CustomReport[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('custom_reports')
    .select('*')
    .eq('organization_id', organizationId)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching custom reports:', error);
    return [];
  }

  return data || [];
}

/**
 * Get reports by creator
 */
export async function getReportsByCreator(
  organizationId: string,
  userId: string
): Promise<CustomReport[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('custom_reports')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('created_by', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading reports by creator:', error);
    return [];
  }

  return data || [];
}

/**
 * Get scheduled reports due for generation
 */
export async function getScheduledReports(organizationId: string): Promise<CustomReport[]> {
  const supabase = createClient();

  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('custom_reports')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('is_scheduled', true)
    .lte('next_scheduled_at', now)
    .order('next_scheduled_at', { ascending: true });

  if (error) {
    console.error('Error loading scheduled reports:', error);
    return [];
  }

  return data || [];
}

/**
 * Generate report data based on configuration
 */
export async function generateReportData(
  organizationId: string,
  config: ReportConfig
): Promise<any[]> {
  const supabase = createClient();

  // Build date filter
  const dateFilter = getDateRangeFilter(config.dateRange, config.customDateStart, config.customDateEnd);

  let query = supabase
    .from(config.dataSource)
    .select('*')
    .eq('organization_id', organizationId);

  // Apply date filter
  if (dateFilter.start && dateFilter.end) {
    query = query.gte('created_at', dateFilter.start).lte('created_at', dateFilter.end);
  }

  // Apply custom filters
  config.filters.forEach((filter) => {
    switch (filter.operator) {
      case 'equals':
        query = query.eq(filter.field, filter.value);
        break;
      case 'not-equals':
        query = query.neq(filter.field, filter.value);
        break;
      case 'contains':
        query = query.ilike(filter.field, `%${filter.value}%`);
        break;
      case 'greater-than':
        query = query.gt(filter.field, filter.value);
        break;
      case 'less-than':
        query = query.lt(filter.field, filter.value);
        break;
    }
  });

  const { data, error } = await query;

  if (error) {
    console.error('Error generating report data:', error);
    return [];
  }

  // Group and aggregate data based on groupBy and metric
  return aggregateData(data || [], config);
}

/**
 * Helper: Get date range filter
 */
function getDateRangeFilter(
  dateRange: string,
  customStart?: string,
  customEnd?: string
): { start: string | null; end: string | null } {
  const now = new Date();
  let start: Date | null = null;
  let end: Date = now;

  switch (dateRange) {
    case 'today':
      start = new Date(now.setHours(0, 0, 0, 0));
      break;
    case 'yesterday':
      start = new Date(now.setDate(now.getDate() - 1));
      start.setHours(0, 0, 0, 0);
      end = new Date(start);
      end.setHours(23, 59, 59, 999);
      break;
    case 'last-7-days':
      start = new Date(now.setDate(now.getDate() - 7));
      break;
    case 'last-30-days':
      start = new Date(now.setDate(now.getDate() - 30));
      break;
    case 'last-90-days':
      start = new Date(now.setDate(now.getDate() - 90));
      break;
    case 'this-month':
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'last-month':
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      break;
    case 'this-quarter':
      const quarter = Math.floor(now.getMonth() / 3);
      start = new Date(now.getFullYear(), quarter * 3, 1);
      break;
    case 'this-year':
      start = new Date(now.getFullYear(), 0, 1);
      break;
    case 'custom':
      if (customStart && customEnd) {
        start = new Date(customStart);
        end = new Date(customEnd);
      }
      break;
  }

  return {
    start: start ? start.toISOString() : null,
    end: end.toISOString(),
  };
}

/**
 * Helper: Aggregate data based on groupBy and metric
 */
function aggregateData(data: any[], config: ReportConfig): any[] {
  if (data.length === 0) return [];

  // Group data
  const groups: Map<string, any[]> = new Map();

  data.forEach((item) => {
    let key: string;

    switch (config.groupBy) {
      case 'day':
        key = new Date(item.created_at).toLocaleDateString();
        break;
      case 'week':
        const weekDate = new Date(item.created_at);
        const weekStart = new Date(weekDate.setDate(weekDate.getDate() - weekDate.getDay()));
        key = weekStart.toLocaleDateString();
        break;
      case 'month':
        const monthDate = new Date(item.created_at);
        key = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`;
        break;
      case 'quarter':
        const quarterDate = new Date(item.created_at);
        const quarter = Math.floor(quarterDate.getMonth() / 3) + 1;
        key = `${quarterDate.getFullYear()}-Q${quarter}`;
        break;
      case 'year':
        key = new Date(item.created_at).getFullYear().toString();
        break;
      case 'status':
        key = item.status || 'Unknown';
        break;
      case 'assignee':
        key = item.assigned_to || 'Unassigned';
        break;
      default:
        key = 'All';
    }

    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(item);
  });

  // Calculate metrics for each group
  const result: any[] = [];

  groups.forEach((items, key) => {
    let value: number;

    switch (config.metric) {
      case 'count':
        value = items.length;
        break;
      case 'revenue':
        value = items.reduce((sum, item) => sum + (item.value || item.amount || 0), 0);
        break;
      case 'average':
        const total = items.reduce((sum, item) => sum + (item.value || item.amount || 0), 0);
        value = items.length > 0 ? total / items.length : 0;
        break;
      case 'conversion-rate':
        const converted = items.filter((item) => item.status === 'won' || item.status === 'completed');
        value = items.length > 0 ? (converted.length / items.length) * 100 : 0;
        break;
      default:
        value = items.length;
    }

    result.push({
      name: key,
      value: Math.round(value * 100) / 100,
      count: items.length,
    });
  });

  return result.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Helper: Calculate next schedule time
 */
async function calculateNextSchedule(
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly',
  currentTime: Date
): Promise<string> {
  const next = new Date(currentTime);

  switch (frequency) {
    case 'daily':
      next.setDate(next.getDate() + 1);
      break;
    case 'weekly':
      next.setDate(next.getDate() + 7);
      break;
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      break;
    case 'quarterly':
      next.setMonth(next.getMonth() + 3);
      break;
  }

  return next.toISOString();
}

/**
 * Get report statistics
 */
export async function getReportStats(organizationId: string) {
  const reports = await loadCustomReports(organizationId);

  const totalReports = reports.length;
  const scheduledReports = reports.filter((r) => r.is_scheduled).length;
  const publicReports = reports.filter((r) => r.is_public).length;

  const thisMonth = new Date();
  thisMonth.setDate(1);
  thisMonth.setHours(0, 0, 0, 0);

  const reportsThisMonth = reports.filter((r) => new Date(r.created_at) >= thisMonth).length;

  const totalViews = reports.reduce((sum, r) => sum + r.view_count, 0);

  return {
    totalReports,
    scheduledReports,
    publicReports,
    reportsThisMonth,
    totalViews,
  };
}
