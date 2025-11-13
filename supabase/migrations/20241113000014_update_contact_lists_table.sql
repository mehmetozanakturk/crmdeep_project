-- Add missing fields to contact_lists table
ALTER TABLE contact_lists
ADD COLUMN IF NOT EXISTS brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS contact_count INTEGER DEFAULT 0;

-- Create index for brand_id
CREATE INDEX IF NOT EXISTS idx_contact_lists_brand ON contact_lists(brand_id);

-- Update existing records to have contact_count match contact_ids array length
UPDATE contact_lists
SET contact_count = COALESCE(array_length(contact_ids, 1), 0)
WHERE contact_count = 0;

COMMENT ON COLUMN contact_lists.brand_id IS 'Brand association for multi-brand organizations';
COMMENT ON COLUMN contact_lists.tags IS 'Tags for organizing and filtering lists';
COMMENT ON COLUMN contact_lists.contact_count IS 'Cached count of contacts in the list';
