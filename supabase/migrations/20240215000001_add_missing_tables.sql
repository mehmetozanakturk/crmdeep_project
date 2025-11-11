-- ============================================
-- Add Missing Tables (Safe - uses IF NOT EXISTS)
-- ============================================

-- INBOX TABLE
CREATE TABLE IF NOT EXISTS inbox_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    sender_name TEXT,
    sender_email TEXT,
    content TEXT,
    status TEXT DEFAULT 'unread',
    priority TEXT DEFAULT 'normal',
    folder TEXT DEFAULT 'inbox',
    has_attachments BOOLEAN DEFAULT FALSE,
    received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inbox_organization ON inbox_messages(organization_id);
CREATE INDEX IF NOT EXISTS idx_inbox_status ON inbox_messages(status);

-- REPORTS TABLE
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT,
    description TEXT,
    data JSONB,
    created_by TEXT,
    is_scheduled BOOLEAN DEFAULT FALSE,
    schedule_frequency TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reports_organization ON reports(organization_id);

-- Enable RLS
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'inbox_messages') THEN
        ALTER TABLE inbox_messages ENABLE ROW LEVEL SECURITY;
    END IF;
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'reports') THEN
        ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Add Policies (Drop first to avoid conflicts)
DROP POLICY IF EXISTS "Allow all for authenticated users" ON inbox_messages;
CREATE POLICY "Allow all for authenticated users" ON inbox_messages FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow all for authenticated users" ON reports;
CREATE POLICY "Allow all for authenticated users" ON reports FOR ALL USING (auth.role() = 'authenticated');
