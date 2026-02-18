/**
 * Bittensor Subnet Data Sync Script
 * Runs on GitHub Actions to fetch latest metrics and update Supabase
 */

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables')
  process.exit(1)
}

// TaoMarketCap API endpoint
const TAOMARKETCAP_URL = 'https://taomarketcap.com/api/subnets'

async function fetchSubnetData() {
  console.log('Fetching data from TaoMarketCap...')

  try {
    const response = await fetch(TAOMARKETCAP_URL, {
      headers: {
        'User-Agent': 'BittensorDashboard/1.0',
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    console.log(`Fetched data for ${data.length} subnets`)
    return data
  } catch (error) {
    console.error('Failed to fetch TaoMarketCap data:', error.message)
    return null
  }
}

async function updateSupabase(subnetData) {
  if (!subnetData || subnetData.length === 0) {
    console.log('No data to update')
    return
  }

  console.log('Updating Supabase...')

  const timestamp = new Date().toISOString()
  let updated = 0
  let failed = 0

  for (const subnet of subnetData) {
    const netuid = subnet.netuid || subnet.id
    if (!netuid) continue

    const metricsData = {
      subnet_id: netuid,
      timestamp,
      price_usd: subnet.price || subnet.priceUsd || null,
      price_change_1h: subnet.priceChange1h || subnet.change1h || null,
      price_change_24h: subnet.priceChange24h || subnet.change24h || null,
      price_change_7d: subnet.priceChange7d || subnet.change7d || null,
      market_cap_usd: subnet.marketCap || subnet.marketCapUsd || null,
      fdv_usd: subnet.fdv || subnet.fdvUsd || null,
      volume_24h_usd: subnet.volume24h || subnet.volumeUsd24h || null,
      emission_percent: subnet.emissionPercent || subnet.emission || null,
      total_staked_tao: subnet.stakedTao || subnet.totalStaked || null,
      validators_count: subnet.validators || subnet.validatorCount || null,
      miners_count: subnet.miners || subnet.minerCount || null
    }

    try {
      // Upsert metrics
      const response = await fetch(`${SUPABASE_URL}/rest/v1/subnet_metrics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify(metricsData)
      })

      if (response.ok) {
        updated++
      } else {
        const errorText = await response.text()
        console.error(`Failed to update subnet ${netuid}:`, errorText)
        failed++
      }
    } catch (error) {
      console.error(`Error updating subnet ${netuid}:`, error.message)
      failed++
    }
  }

  console.log(`Sync complete: ${updated} updated, ${failed} failed`)
}

async function main() {
  console.log('=== Bittensor Subnet Data Sync ===')
  console.log(`Time: ${new Date().toISOString()}`)
  console.log('')

  const data = await fetchSubnetData()

  if (data) {
    await updateSupabase(data)
  }

  console.log('')
  console.log('=== Sync finished ===')
}

main().catch(console.error)
