-- Bittensor Subnet Dashboard Database Schema
-- Run this in your Supabase SQL Editor to initialize the database

-- Create subnets table
CREATE TABLE IF NOT EXISTS subnets (
  id INTEGER PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  website VARCHAR(500),
  team VARCHAR(255),
  has_revenue_dashboard BOOLEAN DEFAULT FALSE,
  revenue_dashboard_url VARCHAR(500),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create subnet_metrics table for price/market cap tracking
CREATE TABLE IF NOT EXISTS subnet_metrics (
  id SERIAL PRIMARY KEY,
  subnet_id INTEGER REFERENCES subnets(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  price_tao DECIMAL(20, 10),
  price_usd DECIMAL(20, 10),
  market_cap_usd DECIMAL(30, 2),
  fdv_usd DECIMAL(30, 2),
  emission_percent DECIMAL(10, 6),
  volume_24h_usd DECIMAL(30, 2),
  price_change_1h DECIMAL(10, 4),
  price_change_24h DECIMAL(10, 4),
  price_change_7d DECIMAL(10, 4),
  circulating_supply DECIMAL(30, 10)
);

-- Create subnet_revenue table
CREATE TABLE IF NOT EXISTS subnet_revenue (
  id SERIAL PRIMARY KEY,
  subnet_id INTEGER REFERENCES subnets(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  inflow_tao DECIMAL(20, 10),
  inflow_usd DECIMAL(30, 2),
  burn_tao DECIMAL(20, 10),
  burn_usd DECIMAL(30, 2),
  outflow_tao DECIMAL(20, 10),
  outflow_usd DECIMAL(30, 2),
  coverage_percent DECIMAL(10, 4),
  surplus_tao DECIMAL(20, 10),
  period VARCHAR(10) DEFAULT '30d'
);

-- Create emission_history table
CREATE TABLE IF NOT EXISTS emission_history (
  id SERIAL PRIMARY KEY,
  subnet_id INTEGER REFERENCES subnets(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  emission_tao DECIMAL(20, 10),
  emission_usd DECIMAL(30, 2)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_subnet_metrics_subnet_timestamp ON subnet_metrics(subnet_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_subnet_revenue_subnet_period ON subnet_revenue(subnet_id, period, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_emission_history_subnet_timestamp ON emission_history(subnet_id, timestamp DESC);

-- Enable RLS and create public read policies
ALTER TABLE subnets ENABLE ROW LEVEL SECURITY;
ALTER TABLE subnet_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE subnet_revenue ENABLE ROW LEVEL SECURITY;
ALTER TABLE emission_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read subnets" ON subnets FOR SELECT USING (true);
CREATE POLICY "Public read subnet_metrics" ON subnet_metrics FOR SELECT USING (true);
CREATE POLICY "Public read subnet_revenue" ON subnet_revenue FOR SELECT USING (true);
CREATE POLICY "Public read emission_history" ON emission_history FOR SELECT USING (true);

CREATE POLICY "Allow insert subnets" ON subnets FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert subnet_metrics" ON subnet_metrics FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert subnet_revenue" ON subnet_revenue FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert emission_history" ON emission_history FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update subnets" ON subnets FOR UPDATE USING (true);
