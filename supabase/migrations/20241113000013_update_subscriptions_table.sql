-- Add missing fields to subscriptions table to match AddSubscriptionModal
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS brand_id UUID REFERENCES brands(id) ON DELETE SET NULL;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS service_name TEXT;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS client_name TEXT;

-- Create index for brand_id
CREATE INDEX IF NOT EXISTS idx_subscriptions_brand ON subscriptions(brand_id);

-- Update existing records to have service_name from plan_name if null
UPDATE subscriptions SET service_name = plan_name WHERE service_name IS NULL;

COMMENT ON COLUMN subscriptions.brand_id IS 'Brand associated with the subscription';
COMMENT ON COLUMN subscriptions.service_name IS 'Name of the service/product being subscribed to';
COMMENT ON COLUMN subscriptions.client_name IS 'Client/customer name for the subscription';
