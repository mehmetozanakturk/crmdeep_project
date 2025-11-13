-- ============================================================================
-- UPDATE TICKETS TABLE
-- ============================================================================
-- Add missing columns to tickets table for better functionality

-- Add brand_id column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tickets' AND column_name = 'brand_id'
  ) THEN
    ALTER TABLE tickets ADD COLUMN brand_id UUID REFERENCES brands(id) ON DELETE SET NULL;
    CREATE INDEX IF NOT EXISTS idx_tickets_brand ON tickets(brand_id);
  END IF;
END $$;

-- Add client_name column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tickets' AND column_name = 'client_name'
  ) THEN
    ALTER TABLE tickets ADD COLUMN client_name TEXT;
  END IF;
END $$;

-- Add client_email column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tickets' AND column_name = 'client_email'
  ) THEN
    ALTER TABLE tickets ADD COLUMN client_email TEXT;
  END IF;
END $$;

-- Ensure tickets table has RLS enabled
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Recreate RLS policy for tickets
DROP POLICY IF EXISTS "Allow all - tickets" ON tickets;
CREATE POLICY "Allow all - tickets" ON tickets
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

COMMENT ON TABLE tickets IS 'Support tickets table with brand filtering and client information';
