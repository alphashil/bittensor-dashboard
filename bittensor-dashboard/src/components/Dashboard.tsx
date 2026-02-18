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
  Activity
} from 'lucide-react'
import { useSubnets, SubnetWithMetrics } from '@/hooks/useSubnets'

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
                      Emission % <SortIcon field="emission" />
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
  getPriceChangeValue
}: {
  item: SubnetWithMetrics
  formatCurrency: (v: number | null | undefined) => string
  formatPercent: (v: number | null | undefined) => string
  revenuePeriod: RevenuePeriod
  getRevenueValue: (item: SubnetWithMetrics) => number | null
  priceChangePeriod: PriceChangePeriod
  getPriceChangeValue: (item: SubnetWithMetrics) => number | null
}) {
  const priceChange = getPriceChangeValue(item)
  const revenue = getRevenueValue(item)
  const hasDirectRevenue = item.directRevenue !== null
  const hasRevenueLink = item.subnet.has_revenue_dashboard && !hasDirectRevenue

  return (
    <tr className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
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
  )
}

export default Dashboard
