-- CRMDeep Marketing Campaigns and Email Management Migration
-- This migration creates tables for marketing campaigns (Ads) and email inbox

-- ============================================================================
-- CAMPAIGNS (Marketing/Advertising Campaigns)
-- ============================================================================
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('meta', 'google', 'linkedin', 'twitter', 'other')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'archived')),
  campaign_type TEXT CHECK (campaign_type IN ('awareness', 'consideration', 'conversion', 'remarketing')),

  -- Budget & Spend
  budget DECIMAL(12, 2) DEFAULT 0,
  spent DECIMAL(12, 2) DEFAULT 0,
  currency TEXT DEFAULT 'TRY',

  -- Performance Metrics
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  reach INTEGER DEFAULT 0,

  -- Date Management
  start_date DATE,
  end_date DATE,

  -- Targeting & Creative
  target_audience JSONB, -- Flexible JSON for demographic, geographic, interest targeting
  creative_assets TEXT[], -- Array of image/video URLs
  ad_copy TEXT,
  call_to_action TEXT,
  landing_page_url TEXT,

  -- Tracking
  tags TEXT[],
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_campaigns_org_id ON campaigns(organization_id);
CREATE INDEX idx_campaigns_platform ON campaigns(platform);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_created_by ON campaigns(created_by);
CREATE INDEX idx_campaigns_start_date ON campaigns(start_date);
CREATE INDEX idx_campaigns_tags ON campaigns USING GIN (tags);

-- Full-text search for campaigns
ALTER TABLE campaigns ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('english',
      coalesce(name, '') || ' ' ||
      coalesce(ad_copy, '') || ' ' ||
      coalesce(notes, '')
    )
  ) STORED;

CREATE INDEX idx_campaigns_search ON campaigns USING GIN (search_vector);

-- ============================================================================
-- CAMPAIGN_PERFORMANCE_HISTORY (Daily metrics tracking)
-- ============================================================================
CREATE TABLE campaign_performance_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  spent DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(campaign_id, date)
);

CREATE INDEX idx_campaign_history_campaign_id ON campaign_performance_history(campaign_id);
CREATE INDEX idx_campaign_history_date ON campaign_performance_history(date DESC);

-- ============================================================================
-- EMAILS (Unified Inbox / Email Management)
-- ============================================================================
CREATE TABLE emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,

  -- Email Details
  from_email TEXT NOT NULL,
  from_name TEXT,
  to_email TEXT NOT NULL,
  cc_emails TEXT[],
  bcc_emails TEXT[],

  subject TEXT NOT NULL,
  body TEXT,
  html_body TEXT,

  -- Status & Flags
  status TEXT DEFAULT 'inbox' CHECK (status IN ('inbox', 'sent', 'draft', 'trash', 'spam', 'archived')),
  is_read BOOLEAN DEFAULT false,
  is_starred BOOLEAN DEFAULT false,
  is_important BOOLEAN DEFAULT false,

  -- Threading
  thread_id UUID, -- For grouping related emails
  in_reply_to UUID REFERENCES emails(id) ON DELETE SET NULL,

  -- Metadata
  sent_at TIMESTAMPTZ,
  received_at TIMESTAMPTZ DEFAULT NOW(),

  -- Attachments
  has_attachments BOOLEAN DEFAULT false,
  attachment_count INTEGER DEFAULT 0,

  -- Tracking
  tags TEXT[],
  labels TEXT[],

  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_emails_org_id ON emails(organization_id);
CREATE INDEX idx_emails_from_email ON emails(from_email);
CREATE INDEX idx_emails_to_email ON emails(to_email);
CREATE INDEX idx_emails_status ON emails(status);
CREATE INDEX idx_emails_is_read ON emails(is_read);
CREATE INDEX idx_emails_is_starred ON emails(is_starred);
CREATE INDEX idx_emails_thread_id ON emails(thread_id);
CREATE INDEX idx_emails_sent_at ON emails(sent_at DESC);
CREATE INDEX idx_emails_received_at ON emails(received_at DESC);
CREATE INDEX idx_emails_tags ON emails USING GIN (tags);

-- Full-text search for emails
ALTER TABLE emails ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('english',
      coalesce(from_email, '') || ' ' ||
      coalesce(from_name, '') || ' ' ||
      coalesce(subject, '') || ' ' ||
      coalesce(body, '')
    )
  ) STORED;

CREATE INDEX idx_emails_search ON emails USING GIN (search_vector);

-- ============================================================================
-- TRIGGERS: Auto-update updated_at timestamps
-- ============================================================================
CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_emails_updated_at
  BEFORE UPDATE ON emails
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to calculate campaign ROI
CREATE OR REPLACE FUNCTION calculate_campaign_roi(campaign_uuid UUID)
RETURNS DECIMAL AS $$
DECLARE
  total_spent DECIMAL;
  total_conversions INTEGER;
  avg_conversion_value DECIMAL := 100.00; -- Default value, can be customized
  total_revenue DECIMAL;
  roi DECIMAL;
BEGIN
  SELECT spent, conversions INTO total_spent, total_conversions
  FROM campaigns
  WHERE id = campaign_uuid;

  IF total_spent = 0 OR total_spent IS NULL THEN
    RETURN 0;
  END IF;

  total_revenue := total_conversions * avg_conversion_value;
  roi := ((total_revenue - total_spent) / total_spent) * 100;

  RETURN roi;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate CTR (Click-Through Rate)
CREATE OR REPLACE FUNCTION calculate_campaign_ctr(campaign_uuid UUID)
RETURNS DECIMAL AS $$
DECLARE
  total_impressions INTEGER;
  total_clicks INTEGER;
  ctr DECIMAL;
BEGIN
  SELECT impressions, clicks INTO total_impressions, total_clicks
  FROM campaigns
  WHERE id = campaign_uuid;

  IF total_impressions = 0 OR total_impressions IS NULL THEN
    RETURN 0;
  END IF;

  ctr := (total_clicks::DECIMAL / total_impressions) * 100;

  RETURN ctr;
END;
$$ LANGUAGE plpgsql;
