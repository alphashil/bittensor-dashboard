export interface Subnet {
  id: number
  name: string
  description: string | null
  website: string | null
  team: string | null
  has_revenue_dashboard: boolean
  revenue_dashboard_url: string | null
  revenue_source_url: string | null
  revenue_notes: string | null
  created_at: string
  updated_at: string
}

export interface DirectRevenue {
  id: number
  subnet_id: number
  timestamp: string
  revenue_1d_usd: number | null
  revenue_7d_usd: number | null
  revenue_30d_usd: number | null
  revenue_all_time_usd: number | null
  source_url: string | null
}

export interface SubnetMetrics {
  id: number
  subnet_id: number
  timestamp: string
  price_tao: number | null
  price_usd: number | null
  market_cap_usd: number | null
  fdv_usd: number | null
  emission_percent: number | null
  volume_24h_usd: number | null
  price_change_1h: number | null
  price_change_24h: number | null
  price_change_7d: number | null
  circulating_supply: number | null
}

export interface SubnetRevenue {
  id: number
  subnet_id: number
  timestamp: string
  inflow_tao: number | null
  inflow_usd: number | null
  burn_tao: number | null
  burn_usd: number | null
  outflow_tao: number | null
  outflow_usd: number | null
  coverage_percent: number | null
  surplus_tao: number | null
  period: '24h' | '7d' | '30d'
}

export interface EmissionHistory {
  id: number
  subnet_id: number
  timestamp: string
  emission_tao: number
  emission_usd: number | null
}

export interface Database {
  public: {
    Tables: {
      subnets: {
        Row: Subnet
        Insert: Omit<Subnet, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Subnet, 'id'>>
      }
      subnet_metrics: {
        Row: SubnetMetrics
        Insert: Omit<SubnetMetrics, 'id'>
        Update: Partial<Omit<SubnetMetrics, 'id'>>
      }
      subnet_revenue: {
        Row: SubnetRevenue
        Insert: Omit<SubnetRevenue, 'id'>
        Update: Partial<Omit<SubnetRevenue, 'id'>>
      }
      emission_history: {
        Row: EmissionHistory
        Insert: Omit<EmissionHistory, 'id'>
        Update: Partial<Omit<EmissionHistory, 'id'>>
      }
    }
  }
}
