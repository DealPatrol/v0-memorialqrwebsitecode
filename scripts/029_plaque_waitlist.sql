-- Waitlist for keepsakes that are listed but not for sale yet. Additive only.
CREATE TABLE IF NOT EXISTS plaque_waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  product_id TEXT NOT NULL,
  source_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  notified_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS plaque_waitlist_email_product_key ON plaque_waitlist (lower(email), product_id);

-- Only the server (service role) reads or writes this table.
ALTER TABLE plaque_waitlist ENABLE ROW LEVEL SECURITY;
