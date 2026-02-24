import { useState, useMemo } from 'react'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  ExternalLink,
  Search,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  Activity,
  HelpCircle
} from 'lucide-react'
import { useSubnets, SubnetWithMetrics } from '@/hooks/useSubnets'

// Subnet descriptions from backprop.finance and other sources
const SUBNET_DESCRIPTIONS: Record<number, string> = {
  1: "Apex Subnet (Subnet 1) is designed to advance decentralized intelligence by leveraging collective reasoning and computational capacity of distributed networks. Its primary purpose is to solve complex algorithmic and agentic optimization problems that were once too large or intricate for any single entity to handle. The subnet aims to translate mathematical and algorithmic solutions into real-world impact. Miners participate by solving algorithmic challenges while validators evaluate submissions based on competition metrics. Successful solutions are incentivized through emission distribution and open-sourced to benefit the broader developer and research community.",
  2: "Omron is a decentralized AI project focused on zero-knowledge machine learning (zkML). It aims to provide verifiable AI inference where the correctness of computations can be proven without revealing the underlying data or model. This enables privacy-preserving AI applications and trustless verification of AI outputs.",
  3: "Templar is a decentralized AI training subnet focused on collaborative machine learning. It enables multiple parties to contribute to training AI models without sharing their raw data, creating a marketplace for training resources and model improvements.",
  4: "Targon is a multimodal AI processing subnet that enables the evaluation and verification of AI models across different modalities including text, images, audio, and video. It provides a competitive marketplace for multimodal AI services.",
  5: "Hone is a hierarchical AI model training subnet focused on breaking down complex AI training tasks into smaller, manageable pieces. It enables distributed training across multiple nodes with incentive mechanisms for contributing compute and improving model quality.",
  6: "Numinous is a decentralized forecasting subnet that enables the creation of prediction markets and forecasting services. It incentivizes miners to provide accurate predictions across various domains including crypto, sports, and real-world events.",
  7: "SubVortex is a distributed network of subtensor nodes that provides infrastructure for the Bittensor network. Miners contribute to the network's decentralization and reliability by running validation and relay nodes.",
  8: "Vanta (formerly Proprietary Trading Network or PTN) is a decentralized proprietary trading network built on Bittensor. Its core purpose is to crowdsource advanced trading strategies from a global pool of quantitative traders and data scientists, transforming these strategies into high-quality trading signals through competitive evaluation. Miners run ML models that generate predictions for financial markets while validators evaluate outputs using advanced financial metrics like returns, drawdown, Sharpe ratio, and Omega ratio.",
  9: "IOTA is a subnet focused on pre-training large language models. It enables decentralized collaboration on foundational AI model training, creating a marketplace for compute resources and training data.",
  10: "Swap is a cross-chain decentralized exchange (DEX) subnet that enables atomic swaps and liquidity provision across different blockchain networks. It provides decentralized trading infrastructure for the Bittensor ecosystem.",
  11: "Dippy Studio is a generative media platform subnet focused on AI-generated content including images, videos, and audio. It enables creators to generate and monetize AI-generated media through a decentralized marketplace.",
  12: "ComputeHorde is a decentralized GPU compute marketplace that allows users to rent out or purchase GPU computing power for AI training and inference tasks. It creates a competitive market for compute resources.",
  13: "Data Universe is a decentralized data storage and retrieval subnet that enables the storage and retrieval of large datasets for AI training. It provides incentives for data providers and ensures data quality through cryptographic verification.",
  14: "TAO Hash is a Bitcoin mining rewards subnet that tracks and distributes mining rewards across the Bittensor ecosystem. It connects Bitcoin mining with AI incentives.",
  15: "BitQuant is a crypto market analysis subnet that provides data and analytics for cryptocurrency markets. It offers trading signals, market insights, and quantitative analysis tools.",
  16: "BitAds is a pay-per-sale advertising subnet that enables decentralized advertising with verifiable conversions. It creates a marketplace for advertisers and publishers with built-in fraud prevention.",
  17: "Gen 404 is a 3D world creation subnet focused on generating immersive 3D environments using AI. It enables the creation of virtual worlds, game environments, and spatial computing experiences.",
  18: "Zeus is a decentralized weather forecasting subnet that uses advanced AI models to forecast environmental data. It tackles climate forecasting with implications across transportation, agriculture, energy, and public safety. Validators challenge miners with real forecasting tasks for specific geographic areas and time windows, using ERA5 reanalysis data from the EU's Copernicus program. The system has achieved nearly 40% reduction in temperature prediction error compared to state-of-the-art models.",
  19: "Nineteen is an AI subnet focused on general-purpose AI services and model deployment. It provides a marketplace for various AI capabilities including inference, training, and model hosting.",
  20: "Bounty Hunter is an AI bounty competition subnet that enables the creation and completion of AI-related challenges. It provides a platform for solving complex AI problems through competitive crowdsourcing.",
  21: "OMEGA (Any-to-Any) is a multimodal AI models subnet that enables the conversion between different data modalities. It supports tasks like image-to-text, text-to-speech, and other cross-modal AI transformations.",
  22: "Desearch is a decentralized search subnet that enables the creation of AI-powered search engines. It rewards miners for providing relevant search results and indexing quality data.",
  23: "Nuance is a factual discourse rewards subnet focused on promoting accurate and truthful information. It incentivizes miners to provide factually correct responses and penalizes misinformation.",
  24: "Quasar is a decentralized AI subnet designed to overcome the long-context limitation in AI models. It enables efficient reasoning across millions of tokens using a novel Continuous-Time Attention Transformer architecture with linear complexity attention (O(N) instead of O(N²)). Doubling context length no longer quadruples compute cost - it achieves 99.9% recall over massive sequences while inference costs are ~1/10th of standard dense-attention methods.",
  25: "Mainframe is a protein folding research subnet focused on computational biology and drug discovery. It enables the analysis of protein structures and the identification of potential therapeutic targets.",
  26: "Kinitro is a robotic intelligence subnet focused on enabling AI for robotics and automation. It provides a marketplace for robotic perception, planning, and control algorithms.",
  27: "Nodexo is a GPU cloud marketplace that enables the rental and sale of GPU computing resources. It creates a decentralized market for AI compute with verifiable hardware specifications.",
  28: "Subnet 28 is an emerging AI subnet with development in progress. Further details will be available as the subnet launches and develops its incentive mechanism.",
  29: "AI-ASSeSS is a model training collaboration subnet focused on federated learning and collaborative AI model development. It enables multiple parties to train models without sharing raw data.",
  30: "Bettensor is a sports prediction subnet that enables decentralized sports betting and prediction markets. It provides incentives for accurate sports outcome predictions.",
  31: "Candles is a crypto sentiment predictions subnet that analyzes market sentiment from various sources including social media, news, and on-chain data. It provides sentiment indicators for crypto trading.",
  32: "It's AI is an AI content detection subnet focused on identifying AI-generated content. It helps distinguish between human-created and AI-generated text, images, and audio.",
  33: "ReadyAI is a dialogue dataset subnet focused on collecting and curating conversational AI training data. It enables the creation of high-quality dialogue datasets through distributed contribution.",
  34: "BitMind is an AI image detection subnet focused on identifying AI-generated images and deepfakes. It provides verification services for image authenticity.",
  35: "Cartha is a decentralized liquidity subnet focused on providing liquidity across DeFi protocols. It enables automated market making and liquidity provision strategies.",
  36: "Web Agents is an AI web automation subnet that enables AI agents to perform web tasks autonomously. It provides a marketplace for web automation services including data extraction, form filling, and workflow automation.",
  37: "Aurelius is an AI alignment network focused on ensuring AI systems behave safely and align with human values. It provides research and tooling for AI safety.",
  38: "Distributed Training is a subnet focused on LLM distributed training infrastructure. It enables the parallel training of large language models across multiple nodes with efficient communication.",
  39: "Basilica is a GPU compute marketplace subnet focused on providing compute resources for religious and philosophical AI research. It supports academic and research computing needs.",
  40: "Chunking is a RAG (Retrieval-Augmented Generation) chunking solutions subnet focused on optimizing how information is retrieved and processed for AI systems. It provides tools for efficient context management.",
  41: "Sportstensor is a sports predictions subnet focused on generating predictions for various sports. It incentivizes accurate prediction models through competitive scoring.",
  42: "Gopher is a real-time data scraping subnet that enables the collection of real-time data from various web sources. It provides data feeds for AI training and analysis.",
  43: "Graphite is a graphical problems subnet focused on solving graph-based optimization problems. It enables applications in social network analysis, logistics, and network design.",
  44: "Score is a football predictions subnet focused on soccer match outcomes. It provides AI-powered predictions for football games through competitive miner evaluation.",
  45: "Talisman AI is a crypto trading signals subnet that provides trading signals and alpha for cryptocurrency markets. It aggregates analysis from multiple sources.",
  46: "RESI is a real estate database subnet focused on property data and analytics. It provides real estate market intelligence, valuation models, and property search capabilities.",
  47: "Reboot is a robotics AI subnet focused on enabling autonomous robotics through AI. It provides a marketplace for robotics algorithms including perception, planning, and control.",
  48: "Quantum Compute is a quantum computing subnet focused on quantum algorithm development and verification. It enables research into quantum machine learning and optimization.",
  49: "Nepher is an emerging AI subnet with development in progress. Further details will be available as the subnet launches.",
  50: "Synth is a synthetic price data subnet that generates realistic synthetic market data for backtesting trading strategies. It enables risk-free strategy testing without using real funds.",
  51: "Lium is a GPU rental platform subnet focused on providing GPU compute for AI workloads. It enables flexible access to GPU resources with verifiable hardware specifications.",
  52: "Dojo is an AI training data subnet focused on curating and processing training data for AI models. It provides high-quality datasets for various AI applications.",
  53: "Efficient Frontier is a crypto trading strategies subnet focused on optimizing portfolio allocations and trading strategies. It provides algorithmic trading services and strategy optimization.",
  54: "MIID is a synthetic identities subnet focused on generating and managing synthetic identity data for testing and development purposes.",
  55: "Precog is a Bitcoin forecasting subnet focused on predicting Bitcoin price movements and market dynamics. It provides long-term and short-term crypto forecasts.",
  56: "Gradients is an AI training simplification subnet focused on making AI model training more accessible. It provides tools and infrastructure for simplified model development.",
  57: "Gaia is a geospatial intelligence subnet focused on geographic data analysis and mapping. It enables AI-powered geospatial applications and location-based services.",
  58: "Dippy Speech is a speech model subnet focused on text-to-speech and speech-to-text AI services. It provides high-quality voice synthesis and recognition capabilities.",
  59: "BabelBit is a speech translator subnet focused on real-time speech translation between languages. It enables cross-language communication through AI-powered translation.",
  60: "Bitsec is a code vulnerability detection subnet focused on identifying security vulnerabilities in code. It provides automated security scanning and vulnerability assessment.",
  61: "RedTeam is a cybersecurity challenges subnet that enables penetration testing and security assessments. It provides a marketplace for security researchers to find and report vulnerabilities.",
  62: "Ridges AI is an AI agent marketplace subnet that enables the deployment and composition of AI agents. It allows developers to build complex AI applications by combining different agent capabilities.",
  63: "Quantum Innovate is a quantum circuit simulation subnet focused on quantum computing research. It enables simulation and testing of quantum algorithms.",
  64: "Chutes is a breakthrough serverless AI compute platform that is powering trillions of tokens per month. It is the leading open-source, decentralized compute provider for deploying, scaling, and running open-source models in production. Users simply bring the code and Chutes handles servers, GPUs, load balancing, and scaling. It supports SOTA open-source LLMs, image models, video models, speech models, music models, embedding models, content moderation, 3D generation, and custom models. It offers AI model inference, long jobs (batch processing), TEE/secure compute, and consumer apps.",
  65: "TAO Private Network is a decentralized VPN subnet focused on providing privacy and security services. It enables anonymous and encrypted network connections.",
  66: "AlphaCore is a DevOps automation subnet focused on automating software development and deployment workflows. It provides AI-powered DevOps tools and infrastructure management.",
  67: "Tenex is a margin trading subnet focused on providing leveraged trading services. It enables users to trade with borrowed funds with proper risk management.",
  68: "NOVA is a drug discovery subnet focused on accelerating pharmaceutical research through AI. It enables molecular modeling, drug candidate screening, and therapeutic target identification.",
  69: "Subnet 69 is an emerging AI subnet with development in progress. Further details will be available as the subnet launches.",
  70: "Vericore (Subnet 70) is a specialized subnet focused on large-scale semantic verification and fact-checking. It aims to preserve the integrity of knowledge by processing natural language statements and retrieving precise supporting evidence. It returns quotes or data from credible sources to justify conclusions, with every answer including traceable source attributions. The subnet provides both corroborating evidence AND contradictory evidence when available, offering a balanced view of the claim's factual landscape.",
  71: "Leadpoet is a sales lead generation subnet focused on identifying and qualifying potential customers. It provides AI-powered lead scoring and enrichment services.",
  72: "StreetVision is a decentralized computer vision subnet focused on extracting information from street-level imagery. It enables applications in urban planning, mapping, and infrastructure monitoring.",
  73: "MetaHash is an alpha token swaps subnet focused on optimizing token swaps and DeFi strategies. It provides liquidity optimization and cross-exchange arbitrage.",
  74: "Gittensor is a developer rewards subnet that enables open-source developers to earn rewards for their contributions to the Bittensor ecosystem and other projects.",
  75: "Hippius is a cloud storage subnet focused on decentralized file storage. It provides distributed storage solutions with redundancy and availability guarantees.",
  76: "Safe Scan is a cancer screening subnet focused on medical imaging analysis. It provides AI-powered diagnostics for early cancer detection from various imaging modalities.",
  77: "Liquidity is a liquidity provisioning subnet focused on providing liquidity to DeFi protocols. It enables automated market making and liquidity management strategies.",
  78: "Subnet 78 is an emerging AI subnet with development in progress. Further details will be available as the subnet launches.",
  79: "Tauos is a financial market simulation subnet focused on backtesting and strategy simulation. It enables risk-free testing of trading strategies using historical and synthetic data.",
  80: "Agent Builder is a custom AI agents subnet focused on enabling the creation and deployment of custom AI agents. It provides tools for building, training, and deploying specialized AI assistants.",
  81: "Grail is a distributed AI training subnet focused on collaborative model development. It enables multiple parties to contribute to AI training without sharing raw data.",
  82: "Subnet 82 is an emerging AI subnet with development in progress. Further details will be available as the subnet launches.",
  83: "CliqueAI is a graph problem solver subnet focused on solving complex graph-based optimization problems. It enables applications in social networks, logistics, and network design.",
  84: "ChipForge is an AI chip design subnet focused on accelerating semiconductor design through AI. It enables automated chip architecture exploration and optimization.",
  85: "Vidaio is a video upscaling subnet focused on enhancing video quality using AI. It provides super-resolution and quality improvement for video content.",
  86: "The Alpha Arena is an emerging AI subnet focused on competitive AI challenges. Further details will be available as the subnet launches.",
  87: "CheckerChain is a crypto reviews subnet focused on providing verified reviews and ratings for crypto projects. It enables informed decision-making through community-driven verification.",
  88: "Investing is a staking optimization subnet focused on maximizing staking rewards for TAO holders. It provides automated staking strategies and portfolio optimization.",
  89: "InfiniteHash is a Bitcoin mining pool subnet focused on collective Bitcoin mining. It enables distributed mining with shared rewards and reduced variance.",
  90: "Brain is a truth oracle subnet focused on providing verified answers to factual questions. It incentivizes accurate information through cryptographic verification.",
  91: "Tensorprox is a DDoS protection subnet focused on providing distributed denial-of-service mitigation. It enables scalable security services for web applications.",
  92: "ReinforcedAI is a smart contract auditing subnet focused on identifying vulnerabilities in blockchain code. It provides automated security analysis for smart contracts.",
  93: "Bitcast is a creator rewards subnet focused on enabling content creators to monetize their work. It provides tools for content distribution and revenue generation.",
  94: "Bitsota is an emerging AI subnet with development in progress. Further details will be available as the subnet launches.",
  95: "Subnet 95 is an emerging AI subnet with development in progress. Further details will be available as the subnet launches.",
  96: "FLOCK OFF is an edge AI training data subnet focused on aggregating training data from edge devices. It enables privacy-preserving machine learning through federated approaches.",
  97: "FlameWire is a multi-chain RPC subnet focused on providing reliable blockchain connectivity. It enables applications to interact with multiple blockchains through a unified interface.",
  98: "Forever Money is an emerging AI subnet focused on financial services. Further details will be available as the subnet launches.",
  99: "Neza is an AI video generation subnet focused on creating video content through AI. It enables automated video production and editing.",
  100: "Platform is an AI research challenges subnet focused on crowdsourcing solutions to difficult AI problems. It enables collaborative research through competitive challenges.",
  101: "Subnet 101 is an emerging AI subnet with development in progress. Further details will be available as the subnet launches.",
  102: "BetterTherapy is an AI mental healthcare subnet focused on providing mental health support through AI. It enables accessible mental health resources and anonymous support.",
  103: "HappyAI is a mental health companion subnet focused on emotional support and wellness. It provides AI-powered mental health assistance and resources.",
  104: "Subnet 104 is an emerging AI subnet with development in progress. Further details will be available as the subnet launches.",
  105: "Subnet 105 is an emerging AI subnet with development in progress. Further details will be available as the subnet launches.",
  106: "Liquidity Provisioning is a cross-chain liquidity subnet focused on providing liquidity across different blockchain networks. It enables efficient capital allocation across DeFi protocols.",
  107: "Tiger Alpha is a crypto market data subnet focused on providing high-quality market data and analytics. It enables informed trading decisions through comprehensive data services.",
  108: "Internet of Intelligence is an AI agent launchpad subnet focused on enabling the deployment and composition of AI agents. It provides infrastructure for building complex AI applications.",
  109: "Dogelayer is a Dogecoin/Litecoin mining subnet focused on supporting alternative mining activities. It provides distributed mining infrastructure.",
  110: "Rich Kids of TAO is an emerging AI subnet with development in progress. Further details will be available as the subnet launches.",
  111: "oneoneone is a user-generated web content subnet focused on enabling content creation and monetization. It provides tools for creators to build and monetize web experiences.",
  112: "minotaur is a DEX aggregator subnet focused on optimizing trades across multiple decentralized exchanges. It enables best price execution and reduced slippage.",
  113: "Taonado is a TAO mixer subnet focused on providing privacy for TAO transactions. It enables anonymous transfers through cryptographic mixing.",
  114: "Level 114 is a gaming hub subnet focused on AI-powered gaming applications. It provides tools for game development and player engagement.",
  115: "SoulX is an emerging AI subnet with development in progress. Further details will be available as the subnet launches.",
  116: "TaoLend is a TAO lending subnet focused on providing lending services for TAO holders. It enables users to earn interest or borrow against their TAO holdings.",
  117: "BrainPlay is an AI game benchmarks subnet focused on evaluating AI performance in gaming scenarios. It provides standardized testing for AI gaming capabilities.",
  118: "HODL ETF is a TAO staking ETF subnet focused on providing automated staking strategies. It enables users to earn staking rewards through diversified exposure.",
  119: "Akihabara is a manga story generation subnet focused on AI-powered creative writing. It enables the generation of manga-style stories and narratives.",
  120: "Affine is an incentivized RL (reinforcement learning) environment which pays miners who make incremental improvements on a set of tasks (for instance, program abduction or coding). The mechanism is sybil-proof (you can't cheat by deploying multiple miners), decoy-proof (you can't cheat by packing models into certain environments), copy-proof (you can't win by simply stealing the best model), overfitting-proof (you can't cheat by overfitting to a single benchmark). Affine validators incentivize miners to submit models to Subnet 64 on Bittensor (a.k.a Chutes) where they are inference load balanced and publicly available. These models are evaluated on a set of RL-environments with validators looking for the model which dominates the pareto frontier. The network is winners-take-all where miners are forced to copy, download and improve the pareto frontier model. Directed incentives for RL have never been achieved. The ability to direct intelligence and aggregate the work-effort of a large non-permissioned group of individuals on RL tasks will unlock fast advancement in intelligence.",
  121: "sundae_bar is an AI agent marketplace subnet focused on enabling the discovery and deployment of AI agents. It provides a marketplace for various AI agent services.",
  122: "Bitrecs is an e-commerce recommendations subnet focused on providing personalized product recommendations. It enables AI-powered recommendation engines for online retail.",
  123: "MANTIS is a financial predictions subnet focused on generating trading signals that can be packaged and sold as alpha to investors. It offers a decentralized alternative to legacy quant firms and taps into the global hedge fund industry.",
  124: "Swarm is an autonomous drone AI subnet focused on enabling coordinated drone operations. It provides AI for swarm robotics and autonomous flight.",
  125: "8 Ball is an emerging AI subnet with development in progress. Further details will be available as the subnet launches.",
  126: "Tiger Beta is an emerging AI subnet focused on financial analytics. Further details will be available as the subnet launches.",
  127: "SigmaArena is an emerging AI subnet with development in progress. Further details will be available as the subnet launches.",
  128: "ByteLeap is a cloud AI platform subnet focused on providing scalable AI services. It enables the deployment and scaling of AI applications with minimal infrastructure management.",
}

// Simple tooltip component
function Tooltip({ content, children }: { content: string; children: React.ReactNode }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-50">
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
        </div>
      )}
    </div>
  )
}

type SortField = 'id' | 'name' | 'emission' | 'marketCap' | 'fdv' | 'price' | 'priceChange' | 'revenue'
type SortDirection = 'asc' | 'desc'
type RevenuePeriod = '1d' | '7d' | '30d' | 'all'
type PriceChangePeriod = '1h' | '24h' | '7d'

export function Dashboard() {
  const { data, loading, error, refetch } = useSubnets()
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState<SortField>('id')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [showRevenueOnly, setShowRevenueOnly] = useState(false)
  const [revenuePeriod, setRevenuePeriod] = useState<RevenuePeriod>('1d')
  const [priceChangePeriod, setPriceChangePeriod] = useState<PriceChangePeriod>('24h')
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())

  // Toggle row expansion
  const toggleRow = (id: number) => {
    setExpandedRows(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  // Get revenue value based on period
  const getRevenueValue = (item: SubnetWithMetrics): number | null => {
    if (!item.directRevenue) return null
    switch (revenuePeriod) {
      case '1d': return item.directRevenue.revenue_1d_usd || null
      case '7d': return item.directRevenue.revenue_7d_usd || null
      case '30d': return item.directRevenue.revenue_30d_usd || null
      case 'all': return item.directRevenue.revenue_all_time_usd || null
      default: return null
    }
  }

  // Get price change value based on period
  const getPriceChangeValue = (item: SubnetWithMetrics): number | null => {
    if (!item.metrics) return null
    switch (priceChangePeriod) {
      case '1h': return item.metrics.price_change_1h || null
      case '24h': return item.metrics.price_change_24h || null
      case '7d': return item.metrics.price_change_7d || null
      default: return null
    }
  }

  // Filter and sort data
  const filteredData = useMemo(() => {
    let filtered = data.filter(item => {
      const matchesSearch =
        item.subnet.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.subnet.team?.toLowerCase().includes(search.toLowerCase()) ||
        item.subnet.id?.toString().includes(search)

      const matchesRevenue = !showRevenueOnly || item.subnet.has_revenue_dashboard || item.directRevenue

      return matchesSearch && matchesRevenue
    })

    // Sort
    filtered.sort((a, b) => {
      let aVal: number | string = 0
      let bVal: number | string = 0

      switch (sortField) {
        case 'id':
          aVal = a.subnet.id || 0
          bVal = b.subnet.id || 0
          break
        case 'name':
          aVal = a.subnet.name || ''
          bVal = b.subnet.name || ''
          break
        case 'emission':
          aVal = a.metrics?.emission_percent || 0
          bVal = b.metrics?.emission_percent || 0
          break
        case 'marketCap':
          aVal = a.metrics?.market_cap_usd || 0
          bVal = b.metrics?.market_cap_usd || 0
          break
        case 'fdv':
          aVal = a.metrics?.fdv_usd || 0
          bVal = b.metrics?.fdv_usd || 0
          break
        case 'price':
          aVal = a.metrics?.price_usd || 0
          bVal = b.metrics?.price_usd || 0
          break
        case 'priceChange':
          aVal = getPriceChangeValue(a) || 0
          bVal = getPriceChangeValue(b) || 0
          break
        case 'revenue':
          aVal = getRevenueValue(a) || 0
          bVal = getRevenueValue(b) || 0
          break
      }

      if (typeof aVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal)
      }

      return sortDirection === 'asc' ? aVal - (bVal as number) : (bVal as number) - aVal
    })

    return filtered
  }, [data, search, sortField, sortDirection, showRevenueOnly, revenuePeriod, priceChangePeriod])

  // Calculate totals
  const totals = useMemo(() => {
    const totalMarketCap = data.reduce((sum, item) => sum + (item.metrics?.market_cap_usd || 0), 0)
    const totalFDV = data.reduce((sum, item) => sum + (item.metrics?.fdv_usd || 0), 0)
    const subnetsWithRevenue = data.filter(item => item.directRevenue).length
    const subnetsWithRevenueLinks = data.filter(item => item.subnet.has_revenue_dashboard && !item.directRevenue).length
    const totalRevenue1d = data.reduce((sum, item) => sum + (item.directRevenue?.revenue_1d_usd || 0), 0)

    return { totalMarketCap, totalFDV, subnetsWithRevenue, subnetsWithRevenueLinks, totalRevenue1d }
  }, [data])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 opacity-40" />
    return sortDirection === 'asc'
      ? <ChevronUp className="w-4 h-4" />
      : <ChevronDown className="w-4 h-4" />
  }

  const formatCurrency = (value: number | null | undefined) => {
    if (!value) return '-'
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`
    return `$${value.toFixed(2)}`
  }

  const formatPercent = (value: number | null | undefined) => {
    if (value === null || value === undefined) return '-'
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 text-cyan-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-400">Loading subnet data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Bittensor Subnet Dashboard
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Tracking all 128 subnets - Emissions - Market Cap - Revenue
              </p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://taorevenue.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-400 hover:text-cyan-400 flex items-center gap-1"
              >
                TaoRevenue <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://taostats.io/subnets"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-400 hover:text-cyan-400 flex items-center gap-1"
              >
                Taostats <ExternalLink className="w-3 h-3" />
              </a>
              <button
                onClick={refetch}
                className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 rounded text-sm font-medium transition"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <BarChart3 className="w-5 h-5 text-cyan-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Subnets</p>
                <p className="text-2xl font-bold">128</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Market Cap</p>
                <p className="text-2xl font-bold">{formatCurrency(totals.totalMarketCap)}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total FDV</p>
                <p className="text-2xl font-bold">{formatCurrency(totals.totalFDV)}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Activity className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Revenue Tracked</p>
                <p className="text-2xl font-bold">{totals.subnetsWithRevenue}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <DollarSign className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Daily Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(totals.totalRevenue1d)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search subnets by name, team, or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:border-cyan-500 transition"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showRevenueOnly}
              onChange={(e) => setShowRevenueOnly(e.target.checked)}
              className="w-4 h-4 rounded border-gray-600 bg-gray-900 text-cyan-500 focus:ring-cyan-500"
            />
            <span className="text-sm text-gray-400">Show only subnets with revenue data</span>
          </label>

        </div>

        {/* Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800 text-left">
                  <th className="px-4 py-3 text-sm font-medium text-gray-400 w-10"></th>
                  <th
                    className="px-4 py-3 text-sm font-medium text-gray-400 cursor-pointer hover:text-white transition"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center gap-1">
                      # <SortIcon field="id" />
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-sm font-medium text-gray-400 cursor-pointer hover:text-white transition"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      Subnet <SortIcon field="name" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-400">Team</th>
                  <th
                    className="px-4 py-3 text-sm font-medium text-gray-400 cursor-pointer hover:text-white transition"
                    onClick={() => handleSort('emission')}
                  >
                    <div className="flex items-center gap-1">
                      Tao Emission % <SortIcon field="emission" />
                      <Tooltip content="These are the subnet's current share of daily TAO emissions">
                        <HelpCircle className="w-3.5 h-3.5 text-gray-500 hover:text-gray-400 cursor-help" />
                      </Tooltip>
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-sm font-medium text-gray-400 cursor-pointer hover:text-white transition"
                    onClick={() => handleSort('price')}
                  >
                    <div className="flex items-center gap-1">
                      Price <SortIcon field="price" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-400">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5 bg-gray-800 rounded p-0.5">
                        {(['1h', '24h', '7d'] as PriceChangePeriod[]).map(period => (
                          <button
                            key={period}
                            onClick={(e) => { e.stopPropagation(); setPriceChangePeriod(period) }}
                            className={`px-2 py-1 text-xs font-medium rounded transition ${
                              priceChangePeriod === period
                                ? 'bg-purple-600 text-white'
                                : 'text-gray-500 hover:text-white hover:bg-gray-700'
                            }`}
                          >
                            {period.toUpperCase()}
                          </button>
                        ))}
                      </div>
                      <button onClick={() => handleSort('priceChange')} className="hover:text-white transition">
                        <SortIcon field="priceChange" />
                      </button>
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-sm font-medium text-gray-400 cursor-pointer hover:text-white transition"
                    onClick={() => handleSort('marketCap')}
                  >
                    <div className="flex items-center gap-1">
                      Market Cap <SortIcon field="marketCap" />
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-sm font-medium text-gray-400 cursor-pointer hover:text-white transition"
                    onClick={() => handleSort('fdv')}
                  >
                    <div className="flex items-center gap-1">
                      FDV <SortIcon field="fdv" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-400">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5 bg-gray-800 rounded p-0.5">
                        {(['1d', '7d', '30d', 'all'] as RevenuePeriod[]).map(period => (
                          <button
                            key={period}
                            onClick={(e) => { e.stopPropagation(); setRevenuePeriod(period) }}
                            className={`px-2 py-1 text-xs font-medium rounded transition ${
                              revenuePeriod === period
                                ? 'bg-cyan-600 text-white'
                                : 'text-gray-500 hover:text-white hover:bg-gray-700'
                            }`}
                          >
                            {period === 'all' ? 'ALL' : period.toUpperCase()}
                          </button>
                        ))}
                      </div>
                      <button onClick={() => handleSort('revenue')} className="hover:text-white transition">
                        <SortIcon field="revenue" />
                      </button>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <SubnetRow
                    key={item.subnet.id}
                    item={item}
                    formatCurrency={formatCurrency}
                    formatPercent={formatPercent}
                    revenuePeriod={revenuePeriod}
                    getRevenueValue={getRevenueValue}
                    priceChangePeriod={priceChangePeriod}
                    getPriceChangeValue={getPriceChangeValue}
                    isExpanded={expandedRows.has(item.subnet.id)}
                    onToggle={() => toggleRow(item.subnet.id)}
                    description={SUBNET_DESCRIPTIONS[item.subnet.id] || null}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Data Sources */}
        <div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Data Sources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="https://taorevenue.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">TaoRevenue</span>
                <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100" />
              </div>
              <p className="text-sm text-gray-400">Inflow, Burn, Outflow, Coverage metrics</p>
            </a>
            <a
              href="https://taostats.io/subnets"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Taostats</span>
                <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100" />
              </div>
              <p className="text-sm text-gray-400">Emissions, Price, Market Cap, Volume</p>
            </a>
            <a
              href="https://backprop.finance"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Backprop Finance</span>
                <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100" />
              </div>
              <p className="text-sm text-gray-400">TVL, FDV, Trading Fees, Volume</p>
            </a>
            <a
              href="https://taomarketcap.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">TaoMarketCap</span>
                <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100" />
              </div>
              <p className="text-sm text-gray-400">Market Cap, Emissions, Price changes</p>
            </a>
          </div>
        </div>

        {/* Subnets with Revenue Links (no direct data) */}
        <div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Subnets with Revenue Data (External Links)</h3>
          <p className="text-sm text-gray-400 mb-4">These subnets have revenue information available on their websites but don't provide API access for direct tracking.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data
              .filter(item => item.subnet.has_revenue_dashboard && !item.directRevenue)
              .map(item => (
                <a
                  key={item.subnet.id}
                  href={item.subnet.revenue_dashboard_url || item.subnet.website || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">
                      SN{item.subnet.id} - {item.subnet.name}
                    </span>
                    <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                  </div>
                  <p className="text-sm text-gray-400 truncate">
                    {item.subnet.revenue_dashboard_url || item.subnet.website || 'No link available'}
                  </p>
                </a>
              ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12 py-6 text-center text-gray-500 text-sm">
        <p>Data aggregated from TaoRevenue, Taostats, Backprop Finance, and individual subnet dashboards</p>
        <p className="mt-1">Built for tracking Bittensor subnet metrics</p>
      </footer>
    </div>
  )
}

function SubnetRow({
  item,
  formatCurrency,
  formatPercent,
  revenuePeriod,
  getRevenueValue,
  priceChangePeriod,
  getPriceChangeValue,
  isExpanded,
  onToggle,
  description
}: {
  item: SubnetWithMetrics
  formatCurrency: (v: number | null | undefined) => string
  formatPercent: (v: number | null | undefined) => string
  revenuePeriod: RevenuePeriod
  getRevenueValue: (item: SubnetWithMetrics) => number | null
  priceChangePeriod: PriceChangePeriod
  getPriceChangeValue: (item: SubnetWithMetrics) => number | null
  isExpanded: boolean
  onToggle: () => void
  description: string | null
}) {
  const priceChange = getPriceChangeValue(item)
  const revenue = getRevenueValue(item)
  const hasDirectRevenue = item.directRevenue !== null
  const hasRevenueLink = item.subnet.has_revenue_dashboard && !hasDirectRevenue

  return (
    <>
    <tr
      className="border-b border-gray-800/50 hover:bg-gray-800/30 transition cursor-pointer"
      onClick={onToggle}
    >
      <td className="px-4 py-3 text-sm font-mono text-gray-400">
        <ChevronRight className={`w-4 h-4 inline-block transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
      </td>
      <td className="px-4 py-3 text-sm font-mono text-gray-400">
        {item.subnet.id}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="font-medium">{item.subnet.name}</span>
          {item.subnet.website && (
            <a
              href={item.subnet.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-cyan-400"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
        {item.subnet.description && (
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{item.subnet.description}</p>
        )}
      </td>
      <td className="px-4 py-3 text-sm text-gray-400">
        {item.subnet.team || '-'}
      </td>
      <td className="px-4 py-3 text-sm">
        {item.metrics?.emission_percent
          ? `${item.metrics.emission_percent.toFixed(2)}%`
          : '-'}
      </td>
      <td className="px-4 py-3 text-sm font-mono">
        {formatCurrency(item.metrics?.price_usd)}
      </td>
      <td className="px-4 py-3 text-sm font-mono">
        <span className={
          priceChange === null || priceChange === undefined
            ? 'text-gray-500'
            : priceChange >= 0
              ? 'text-green-400'
              : 'text-red-400'
        }>
          {formatPercent(priceChange)}
        </span>
      </td>
      <td className="px-4 py-3 text-sm font-mono">
        {formatCurrency(item.metrics?.market_cap_usd)}
      </td>
      <td className="px-4 py-3 text-sm font-mono">
        {formatCurrency(item.metrics?.fdv_usd)}
      </td>
      <td className="px-4 py-3">
        {hasDirectRevenue ? (
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono text-emerald-400">
              {formatCurrency(revenue)}
            </span>
            {item.directRevenue?.source_url && (
              <a
                href={item.directRevenue.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-cyan-400"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        ) : hasRevenueLink ? (
          <a
            href={item.subnet.revenue_dashboard_url || item.subnet.website || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-yellow-500/10 text-yellow-400 rounded hover:bg-yellow-500/20 transition"
          >
            View <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <span className="text-xs text-gray-600">-</span>
        )}
      </td>
    </tr>
    {isExpanded && (
      <tr className="border-b border-gray-800/50 bg-gray-900/50">
        <td colSpan={9} className="px-4 py-4">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Subnet Description</h4>
            {description ? (
              <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
            ) : (
              <p className="text-sm text-gray-500 italic">No description available for this subnet.</p>
            )}
            <div className="mt-4 pt-4 border-t border-gray-700/50">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Quick Stats</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="text-xs text-gray-500">Price (USD)</span>
                  <p className="text-sm font-mono text-gray-300">{formatCurrency(item.metrics?.price_usd)}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Market Cap</span>
                  <p className="text-sm font-mono text-gray-300">{formatCurrency(item.metrics?.market_cap_usd)}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">FDV</span>
                  <p className="text-sm font-mono text-gray-300">{formatCurrency(item.metrics?.fdv_usd)}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Emission</span>
                  <p className="text-sm font-mono text-gray-300">
                    {item.metrics?.emission_percent ? `${item.metrics.emission_percent.toFixed(2)}%` : '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </td>
      </tr>
    )}
  </>
  )
}

export default Dashboard
