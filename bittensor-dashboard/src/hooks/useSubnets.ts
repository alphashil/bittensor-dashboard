import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Subnet, SubnetMetrics, SubnetRevenue, DirectRevenue } from '@/types/database'

// Static subnet data (will be synced to Supabase)
export const SUBNET_DATA: Partial<Subnet>[] = [
  { id: 1, name: 'Apex', team: 'Macrocosmos', description: 'LLM inference optimization', website: 'https://apex.macrocosmos.ai/', has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 2, name: 'Omron', team: 'Inference Labs', description: 'Decentralized AI with zkML', website: 'https://omron.ai/', has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 3, name: 'Templar', team: 'Covenant AI', description: 'Decentralized AI training', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 4, name: 'Targon', team: 'Manifold Labs', description: 'Multimodal AI processing', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 5, name: 'Hone', team: 'Manifold Labs & Latent Holdings', description: 'Hierarchical AI model training', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 6, name: 'Numinous', team: 'Numinous Labs', description: 'Decentralized forecasting', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 7, name: 'SubVortex', team: 'SubVortex', description: 'Distributed subtensor nodes', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 8, name: 'Vanta', team: 'Taoshi', description: 'Decentralized prop trading', website: 'https://www.taoshi.io/', has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 9, name: 'IOTA', team: 'Macrocosmos', description: 'Pre-training LLMs', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 10, name: 'Swap', team: 'TaoFi', description: 'Cross-chain DEX', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 11, name: 'Dippy Studio', team: 'Impel Intelligence', description: 'Generative media platform', website: 'https://dippy.studio/', has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 12, name: 'ComputeHorde', team: 'Backend Developers', description: 'Decentralized GPU compute', website: 'https://computehorde.io/', has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 13, name: 'Data Universe', team: 'Macrocosmos', description: 'Decentralized data storage', website: 'https://datauniverse.macrocosmos.ai/', has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 14, name: 'TAO Hash', team: 'Latent Holdings', description: 'Bitcoin mining rewards', website: 'https://taohash.com/', has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 15, name: 'BitQuant', team: 'OpenGradient', description: 'Crypto market analysis', website: 'https://www.bitquant.io/', has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 16, name: 'BitAds', team: 'BitAds', description: 'Pay-per-sale advertising', website: 'https://bitads.ai/', has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 17, name: 'Gen 404', team: '404', description: '3D world creation', website: 'https://www.404.xyz/', has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 18, name: 'Zeus', team: 'Orpheus AI', description: 'Environmental forecasting', website: 'https://www.zeussubnet.com/', has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 19, name: 'Nineteen', team: 'Rayon Labs', description: 'AI subnet', website: 'https://nineteen.ai/', has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 20, name: 'Bounty Hunter', team: 'Team Rizzo', description: 'AI bounty competitions', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 21, name: 'Any-to-Any', team: 'Omega Labs', description: 'Multimodal AI models', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 22, name: 'Desearch', team: 'Datura AI', description: 'Decentralized search', website: 'https://desearch.ai/', has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 23, name: 'Nuance', team: 'Nuance Network', description: 'Factual discourse rewards', website: 'https://www.nuance.info/', has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 24, name: 'Omega', team: 'OMEGA Labs', description: 'Multimodal dataset', website: 'https://omega-labs.ai/', has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 25, name: 'Mainframe', team: 'Macrocosmos', description: 'Protein folding research', website: 'https://www.macrocosmos.ai/', has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 26, name: 'Kinitro', team: 'ThreeTau', description: 'Robotic intelligence', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 27, name: 'Nodexo', team: 'Nodexo', description: 'GPU cloud marketplace', website: 'https://nodexo.ai/', has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 28, name: 'Subnet 28', team: 'Unknown', description: null, website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 29, name: 'AI-ASSeSS', team: 'AI-ASSeSS', description: 'Model training collaboration', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 30, name: 'Bettensor', team: 'Bettensor', description: 'Sports prediction', website: 'https://www.bettensor.com/', has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 31, name: 'Candles', team: 'Candles', description: 'Crypto sentiment predictions', website: 'https://candlestao.com/', has_revenue_dashboard: true, revenue_dashboard_url: 'https://candlestao.com/' },
  { id: 32, name: "It's AI", team: "It's AI", description: 'AI content detection', website: 'https://its-ai.org', has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 33, name: 'ReadyAI', team: 'Afterparty', description: 'Dialogue dataset', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 34, name: 'BitMind', team: 'BitMind', description: 'AI image detection', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 35, name: 'Cartha', team: '0xMarkets', description: 'Decentralized liquidity', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 36, name: 'Web Agents', team: 'Autoppia', description: 'AI web automation', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 37, name: 'Aurelius', team: 'Aurelius Labs', description: 'AI alignment network', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 38, name: 'Distributed Training', team: 'Distributed Training', description: 'LLM distributed training', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 39, name: 'Basilica', team: 'Covenant AI', description: 'GPU compute marketplace', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 40, name: 'Chunking', team: 'Inference', description: 'RAG chunking solutions', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 41, name: 'Sportstensor', team: 'Sportstensor', description: 'Sports predictions', website: 'https://sportstensor.com/', has_revenue_dashboard: true, revenue_dashboard_url: 'https://sportstensor.com/' },
  { id: 42, name: 'Gopher', team: 'Gopher Lab', description: 'Real-time data scraping', website: null, has_revenue_dashboard: true, revenue_dashboard_url: null },
  { id: 43, name: 'Graphite', team: 'Graphite AI', description: 'Graphical problems', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 44, name: 'Score', team: 'Score Technologies', description: 'Football predictions', website: null, has_revenue_dashboard: true, revenue_dashboard_url: null },
  { id: 45, name: 'Talisman AI', team: 'Team Rizzo', description: 'Crypto trading signals', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 46, name: 'RESI', team: 'Resi Labs', description: 'Real estate database', website: 'https://resilabs.ai/', has_revenue_dashboard: true, revenue_dashboard_url: 'https://resilabs.ai/dashboard' },
  { id: 47, name: 'Reboot', team: 'Reboot', description: 'Robotics AI', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 48, name: 'Quantum Compute', team: 'qBittensor Labs', description: 'Quantum computing', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 49, name: 'Nepher', team: 'Unknown', description: null, website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 50, name: 'Synth', team: 'Mode Network', description: 'Synthetic price data', website: 'https://www.synthdata.co/', has_revenue_dashboard: true, revenue_dashboard_url: null },
  { id: 51, name: 'Lium', team: 'Datura', description: 'GPU rental platform', website: null, has_revenue_dashboard: true, revenue_dashboard_url: 'https://grafana.lium.io' },
  { id: 52, name: 'Dojo', team: 'Tensorplex', description: 'AI training data', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 53, name: 'Efficient Frontier', team: 'SignalPlus', description: 'Crypto trading strategies', website: 'https://t.signalplus.com', has_revenue_dashboard: true, revenue_dashboard_url: 'https://backprop.finance/dtao/subnets/53-efficient-frontier' },
  { id: 54, name: 'MIID', team: 'Yanez', description: 'Synthetic identities', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 55, name: 'Precog', team: 'Coin Metrics', description: 'Bitcoin forecasting', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 56, name: 'Gradients', team: 'Rayon Labs', description: 'AI training simplification', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 57, name: 'Gaia', team: 'Nickel 5', description: 'Geospatial intelligence', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 58, name: 'Dippy Speech', team: 'Impel', description: 'Speech model', website: null, has_revenue_dashboard: true, revenue_dashboard_url: null },
  { id: 59, name: 'BabelBit', team: 'BabelBit Ltd', description: 'Speech translator', website: null, has_revenue_dashboard: true, revenue_dashboard_url: null },
  { id: 60, name: 'Bitsec', team: 'Bitsec', description: 'Code vulnerability detection', website: null, has_revenue_dashboard: true, revenue_dashboard_url: null },
  { id: 61, name: 'RedTeam', team: 'Innerworks', description: 'Cybersecurity challenges', website: null, has_revenue_dashboard: true, revenue_dashboard_url: null },
  { id: 62, name: 'Ridges AI', team: 'Ridges AI', description: 'AI agent marketplace', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 63, name: 'Quantum Innovate', team: 'qBittensor Labs', description: 'Quantum circuit simulation', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 64, name: 'Chutes', team: 'Rayon Labs', description: 'Serverless AI Compute', website: 'https://chutes.ai/', has_revenue_dashboard: true, revenue_dashboard_url: 'https://chutes.ai/app/research/payments' },
  { id: 65, name: 'TAO Private Network', team: 'Taofu', description: 'Decentralized VPN', website: 'https://tpn.taofu.xyz/', has_revenue_dashboard: true, revenue_dashboard_url: null },
  { id: 66, name: 'AlphaCore', team: 'AlphaCore', description: 'DevOps automation', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 67, name: 'Tenex', team: 'Tenexium', description: 'Margin trading', website: null, has_revenue_dashboard: true, revenue_dashboard_url: null },
  { id: 68, name: 'NOVA', team: 'Metanova Labs', description: 'Drug discovery', website: 'https://www.metanova-labs.com/', has_revenue_dashboard: true, revenue_dashboard_url: null },
  { id: 69, name: 'Subnet 69', team: 'Unknown', description: null, website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 70, name: 'Vericore', team: 'dFusion AI', description: 'Fact-checking', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 71, name: 'Leadpoet', team: 'Leadpoet', description: 'Sales lead generation', website: null, has_revenue_dashboard: true, revenue_dashboard_url: null },
  { id: 72, name: 'StreetVision', team: 'NATIX', description: 'Street imagery AI', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 73, name: 'MetaHash', team: 'Fxintegral', description: 'Alpha token swaps', website: 'https://metahash73.com/', has_revenue_dashboard: true, revenue_dashboard_url: 'https://metahash73.com/treasury' },
  { id: 74, name: 'Gittensor', team: 'Gittensor', description: 'Developer rewards', website: null, has_revenue_dashboard: true, revenue_dashboard_url: null },
  { id: 75, name: 'Hippius', team: 'The Nerve Lab', description: 'Cloud storage', website: 'https://hippius.com/', has_revenue_dashboard: true, revenue_dashboard_url: null },
  { id: 76, name: 'Safe Scan', team: 'Safe Scan AI', description: 'Cancer screening', website: 'https://safe-scan.ai/', has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 77, name: 'Liquidity', team: 'Creative Builds', description: 'Liquidity provisioning', website: null, has_revenue_dashboard: true, revenue_dashboard_url: null },
  { id: 78, name: 'Subnet 78', team: 'Unknown', description: null, website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 79, name: 'τaos', team: 'τaos', description: 'Financial market simulation', website: 'https://taos.im/', has_revenue_dashboard: true, revenue_dashboard_url: null },
  { id: 80, name: 'Agent Builder', team: 'Agent Builder', description: 'Custom AI agents', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 81, name: 'Grail', team: 'Covenant AI', description: 'Distributed AI training', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 82, name: 'Subnet 82', team: 'Unknown', description: null, website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 83, name: 'CliqueAI', team: 'TopTensor', description: 'Graph problem solver', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 84, name: 'ChipForge', team: 'Tatsu', description: 'AI chip design', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 85, name: 'Vidaio', team: 'VIDAIO', description: 'Video upscaling', website: null, has_revenue_dashboard: true, revenue_dashboard_url: null },
  { id: 86, name: 'The Alpha Arena', team: 'Unknown', description: null, website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 87, name: 'CheckerChain', team: 'CheckerChain', description: 'Crypto reviews', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 88, name: 'Investing', team: 'Mobius Fund', description: 'Staking optimization', website: 'https://investing88.ai/', has_revenue_dashboard: true, revenue_dashboard_url: 'https://db.investing88.ai/' },
  { id: 89, name: 'InfiniteHash', team: 'Backend Developers Ltd', description: 'Bitcoin mining pool', website: 'https://infinitehash.xyz/', has_revenue_dashboard: true, revenue_dashboard_url: 'https://infinitehash.xyz/' },
  { id: 90, name: 'Brain', team: 'Brain', description: 'Truth oracle', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 91, name: 'Tensorprox', team: 'Shugo', description: 'DDoS protection', website: 'https://tensorprox.io/', has_revenue_dashboard: true, revenue_dashboard_url: null },
  { id: 92, name: 'ReinforcedAI', team: 'Reinforced AI Limited', description: 'Smart contract auditing', website: null, has_revenue_dashboard: true, revenue_dashboard_url: null },
  { id: 93, name: 'Bitcast', team: 'Bitcast Network', description: 'Creator rewards', website: 'https://bitcast.network/', has_revenue_dashboard: true, revenue_dashboard_url: 'https://dashboard.bitcast.network' },
  { id: 94, name: 'Bitsota', team: 'Unknown', description: null, website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 95, name: 'Subnet 95', team: 'Unknown', description: null, website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 96, name: 'FLOCK OFF', team: 'FLock.io', description: 'Edge AI training data', website: 'https://www.flock.io/', has_revenue_dashboard: true, revenue_dashboard_url: null },
  { id: 97, name: 'FlameWire', team: 'UnitOne Labs', description: 'Multi-chain RPC', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 98, name: 'Forever Money', team: 'Unknown', description: null, website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 99, name: 'Neza', team: 'Neza', description: 'AI video generation', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 100, name: 'Platform', team: 'Cortex Foundation', description: 'AI research challenges', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 101, name: 'Subnet 101', team: 'Unknown', description: null, website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 102, name: 'BetterTherapy', team: 'BetterTherapy', description: 'AI mental healthcare', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 103, name: 'HappyAI', team: 'Smile', description: 'Mental health companion', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 104, name: 'Subnet 104', team: 'Unknown', description: null, website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 105, name: 'Subnet 105', team: 'Unknown', description: null, website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 106, name: 'Liquidity Provisioning', team: 'VoidAI', description: 'Cross-chain liquidity', website: null, has_revenue_dashboard: true, revenue_dashboard_url: 'https://backprop.finance/dtao/subnets/106' },
  { id: 107, name: 'Tiger Alpha', team: 'Tiger Royalties', description: 'Crypto market data', website: null, has_revenue_dashboard: true, revenue_dashboard_url: 'https://taostats.io/subnets/107/chart' },
  { id: 108, name: 'Internet of Intelligence', team: 'Atreides Labs', description: 'AI agent launchpad', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 109, name: 'Dogelayer', team: 'Dogelayer', description: 'Doge/Litecoin mining', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 110, name: 'Rich Kids of TAO', team: 'Unknown', description: null, website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 111, name: 'oneoneone', team: 'oneoneone', description: 'User-generated web content', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 112, name: 'minotaur', team: 'Unknown', description: 'DEX aggregator', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 113, name: 'Taonado', team: 'Taonado', description: 'TAO mixer', website: 'https://taonado.cash/', has_revenue_dashboard: true, revenue_dashboard_url: 'https://taonado.cash/' },
  { id: 114, name: 'Level 114', team: 'Level 114', description: 'Gaming hub', website: 'https://level114.io/', has_revenue_dashboard: true, revenue_dashboard_url: 'https://level114.io/network' },
  { id: 115, name: 'SoulX', team: 'Unknown', description: null, website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 116, name: 'TaoLend', team: 'XpenLab', description: 'TAO lending', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 117, name: 'BrainPlay', team: 'ShiftLayer', description: 'AI game benchmarks', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 118, name: 'HODL ETF', team: 'TrustedStake', description: 'TAO staking ETF', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 119, name: 'Akihabara', team: 'Akihabara', description: 'Manga story generation', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 120, name: 'Affine', team: 'Affine', description: 'Decentralized RL', website: 'https://affine.network/', has_revenue_dashboard: true, revenue_dashboard_url: 'https://backprop.finance/dtao/subnets/120-affine' },
  { id: 121, name: 'sundae_bar', team: 'sundae_bar', description: 'AI agent marketplace', website: 'https://www.sundaebar.ai/', has_revenue_dashboard: true, revenue_dashboard_url: 'https://corporate.sundaebar.ai/news-updates' },
  { id: 122, name: 'Bitrecs', team: 'Bitrecs', description: 'E-commerce recommendations', website: 'https://www.bitrecs.ai/', has_revenue_dashboard: true, revenue_dashboard_url: null },
  { id: 123, name: 'MANTIS', team: 'Barbarian', description: 'Financial predictions', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 124, name: 'Swarm', team: 'Swarm', description: 'Autonomous drone AI', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 125, name: '8 Ball', team: 'Unknown', description: null, website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
  { id: 126, name: 'Tiger Beta', team: 'Unknown', description: null, website: null, has_revenue_dashboard: true, revenue_dashboard_url: null },
  { id: 127, name: 'SigmaArena', team: 'Unknown', description: null, website: null, has_revenue_dashboard: true, revenue_dashboard_url: null },
  { id: 128, name: 'ByteLeap', team: 'ByteLeap', description: 'Cloud AI platform', website: null, has_revenue_dashboard: false, revenue_dashboard_url: null },
]

// Combined metrics type for dashboard display
export interface SubnetWithMetrics {
  subnet: Partial<Subnet>
  metrics: Partial<SubnetMetrics> | null
  revenue: Partial<SubnetRevenue> | null
  directRevenue: Partial<DirectRevenue> | null
}

// Hook to fetch all subnet data
export function useSubnets() {
  const [data, setData] = useState<SubnetWithMetrics[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)

      // Try to fetch from Supabase first
      const { data: subnetsData, error: subnetsError } = await supabase
        .from('subnets')
        .select('*')
        .order('id')

      if (subnetsError || !subnetsData || subnetsData.length === 0) {
        // Use static data if Supabase is empty/error
        const staticData: SubnetWithMetrics[] = SUBNET_DATA.map(subnet => ({
          subnet,
          metrics: null,
          revenue: null,
          directRevenue: null,
        }))
        setData(staticData)
        return
      }

      // Cast to proper types
      const subnets = subnetsData as Subnet[]

      // Fetch latest metrics for each subnet
      const { data: metricsData } = await supabase
        .from('subnet_metrics')
        .select('*')
        .order('timestamp', { ascending: false })

      // Fetch latest revenue for each subnet
      const { data: revenueData } = await supabase
        .from('subnet_revenue')
        .select('*')
        .eq('period', '30d')
        .order('timestamp', { ascending: false })

      // Fetch direct revenue data
      const { data: directRevenueData } = await supabase
        .from('direct_revenue')
        .select('*')

      const metricsArray = (metricsData || []) as SubnetMetrics[]
      const revenueArray = (revenueData || []) as SubnetRevenue[]
      const directRevenueArray = (directRevenueData || []) as DirectRevenue[]

      // Combine data
      const combined: SubnetWithMetrics[] = subnets.map(subnet => {
        const latestMetrics = metricsArray.find(m => m.subnet_id === subnet.id)
        const latestRevenue = revenueArray.find(r => r.subnet_id === subnet.id)
        const directRevenue = directRevenueArray.find(dr => dr.subnet_id === subnet.id)
        return {
          subnet,
          metrics: latestMetrics || null,
          revenue: latestRevenue || null,
          directRevenue: directRevenue || null,
        }
      })

      setData(combined)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
      // Fallback to static data
      const staticData: SubnetWithMetrics[] = SUBNET_DATA.map(subnet => ({
        subnet,
        metrics: null,
        revenue: null,
        directRevenue: null,
      }))
      setData(staticData)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

// Hook to fetch historical data for charts
export function useSubnetHistory(subnetId: number) {
  const [metrics, setMetrics] = useState<SubnetMetrics[]>([])
  const [emissions, setEmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchHistory() {
      try {
        const [metricsRes, emissionsRes] = await Promise.all([
          supabase
            .from('subnet_metrics')
            .select('*')
            .eq('subnet_id', subnetId)
            .order('timestamp', { ascending: true })
            .limit(90),
          supabase
            .from('emission_history')
            .select('*')
            .eq('subnet_id', subnetId)
            .order('timestamp', { ascending: true })
            .limit(90),
        ])

        setMetrics(metricsRes.data || [])
        setEmissions(emissionsRes.data || [])
      } catch (err) {
        console.error('Failed to fetch history:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [subnetId])

  return { metrics, emissions, loading }
}
