-- CRMDeep Custom Reports System
-- Allows users to create, save, and share custom reports

-- ============================================================================
-- CUSTOM_REPORTS TABLE
-- ============================================================================
CREATE TABLE custom_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,

  -- Report Configuration
  name TEXT NOT NULL,
  description TEXT,

  -- Report Settings (stored as JSONB for flexibility)
  config JSONB NOT NULL,
  -- config structure:
  -- {
  --   dataSource: 'deals' | 'contacts' | 'companies' | 'campaigns' | 'tasks' | 'projects',
  --   chartType: 'bar' | 'line' | 'area' | 'pie',
  --   metric: 'revenue' | 'count' | 'average' | 'conversion-rate',
  --   groupBy: 'day' | 'week' | 'month' | 'quarter' | 'year' | 'status' | 'assignee',
  --   dateRange: 'today' | 'yesterday' | 'last-7-days' | 'last-30-days' | etc.,
  --   filters: [{field: string, operator: string, value: any}],
  --   customDateStart?: string,
  --   customDateEnd?: string
  -- }

  -- Scheduling
  is_scheduled BOOLEAN DEFAULT false,
  schedule_frequency TEXT CHECK (schedule_frequency IN ('daily', 'weekly', 'monthly', 'quarterly')),
  schedule_time TIME,
  schedule_recipients TEXT[], -- email addresses
  last_generated_at TIMESTAMPTZ,
  next_scheduled_at TIMESTAMPTZ,

  -- Sharing & Permissions
  is_public BOOLEAN DEFAULT false, -- visible to all org members
  created_by UUID REFERENCES auth.users(id),

  -- Metadata
  view_count INTEGER DEFAULT 0,
  tags TEXT[],

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_custom_reports_org_id ON custom_reports(organization_id);
CREATE INDEX idx_custom_reports_created_by ON custom_reports(created_by);
CREATE INDEX idx_custom_reports_is_scheduled ON custom_reports(is_scheduled);
CREATE INDEX idx_custom_reports_next_scheduled_at ON custom_reports(next_scheduled_at);
CREATE INDEX idx_custom_reports_tags ON custom_reports USING GIN (tags);

-- Full-text search
ALTER TABLE custom_reports ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('english',
      coalesce(name, '') || ' ' ||
      coalesce(description, '')
    )
  ) STORED;

CREATE INDEX idx_custom_reports_search ON custom_reports USING GIN (search_vector);

-- ============================================================================
-- REPORT_EXPORTS TABLE (Track export history)
-- ============================================================================
CREATE TABLE report_exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES custom_reports(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,

  export_format TEXT NOT NULL CHECK (export_format IN ('pdf', 'csv', 'excel')),
  file_url TEXT, -- S3 or Supabase Storage URL
  file_size INTEGER, -- bytes

  exported_by UUID REFERENCES auth.users(id),
  exported_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_report_exports_report_id ON report_exports(report_id);
CREATE INDEX idx_report_exports_org_id ON report_exports(organization_id);
CREATE INDEX idx_report_exports_exported_at ON report_exports(exported_at DESC);

-- ============================================================================
-- TRIGGERS
-- ============================================================================
CREATE TRIGGER update_custom_reports_updated_at
  BEFORE UPDATE ON custom_reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Increment view count when a report is viewed
CREATE OR REPLACE FUNCTION increment_report_views(report_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE custom_reports
  SET view_count = view_count + 1
  WHERE id = report_uuid;
END;
$$ LANGUAGE plpgsql;

-- Calculate next scheduled run time
CREATE OR REPLACE FUNCTION calculate_next_schedule(
  frequency TEXT,
  current_time TIMESTAMPTZ
)
RETURNS TIMESTAMPTZ AS $$
BEGIN
  CASE frequency
    WHEN 'daily' THEN
      RETURN current_time + INTERVAL '1 day';
    WHEN 'weekly' THEN
      RETURN current_time + INTERVAL '1 week';
    WHEN 'monthly' THEN
      RETURN current_time + INTERVAL '1 month';
    WHEN 'quarterly' THEN
      RETURN current_time + INTERVAL '3 months';
    ELSE
      RETURN NULL;
  END CASE;
END;
$$ LANGUAGE plpgsql;
