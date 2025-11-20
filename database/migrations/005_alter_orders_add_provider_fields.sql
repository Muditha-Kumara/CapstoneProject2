-- Add provider_id, estimated_time, photo_url, and cancellation_reason to orders table
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS provider_id UUID REFERENCES users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS estimated_time TEXT,
  ADD COLUMN IF NOT EXISTS photo_url TEXT,
  ADD COLUMN IF NOT EXISTS cancellation_reason TEXT;

-- Add index for provider queries
CREATE INDEX IF NOT EXISTS idx_orders_provider_id ON orders(provider_id);
