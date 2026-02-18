-- Additional table for direct revenue data (from subnet dashboards like Chutes)
-- Run this in Supabase SQL Editor

-- Create direct_revenue table for actual revenue figures
CREATE TABLE IF NOT EXISTS direct_revenue (
  id SERIAL PRIMARY KEY,
  subnet_id INTEGER REFERENCES subnets(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  revenue_1d_usd DECIMAL(30, 2),
  revenue_7d_usd DECIMAL(30, 2),
  revenue_30d_usd DECIMAL(30, 2),
  revenue_all_time_usd DECIMAL(30, 2),
  source_url VARCHAR(500),
  UNIQUE(subnet_id)
);

CREATE INDEX IF NOT EXISTS idx_direct_revenue_subnet ON direct_revenue(subnet_id);

ALTER TABLE direct_revenue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read direct_revenue" ON direct_revenue FOR SELECT USING (true);
CREATE POLICY "Allow insert direct_revenue" ON direct_revenue FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update direct_revenue" ON direct_revenue FOR UPDATE USING (true);

-- Add revenue_source column to subnets for non-dashboard sources
ALTER TABLE subnets ADD COLUMN IF NOT EXISTS revenue_source_url VARCHAR(500);
ALTER TABLE subnets ADD COLUMN IF NOT EXISTS revenue_notes TEXT;
