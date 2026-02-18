# Bittensor Subnet Dashboard

A real-time dashboard tracking all 128 Bittensor subnets with:
- **Price & Price Changes** (1H/24H/7D toggleable)
- **Market Cap & FDV**
- **TAO Emissions**
- **Revenue** (1D/7D/30D/All Time toggleable)

Built with React, TypeScript, Tailwind CSS, and Supabase.

---

## Quick Deploy Guide

### Prerequisites
- GitHub account
- Vercel account (free)
- Supabase project (free tier)

---

## Step 1: Set Up Supabase (if not already done)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to **SQL Editor** and run the schema from `supabase-schema.sql`
4. Go to **Settings > API** and copy:
   - `Project URL` (e.g., `https://xxxxx.supabase.co`)
   - `anon public` key

---

## Step 2: Push to GitHub

```bash
# Create a new repo on GitHub, then:
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/bittensor-dashboard.git
git push -u origin main
```

---

## Step 3: Add GitHub Secrets (for auto sync)

Go to your GitHub repo **Settings > Secrets and variables > Actions > New repository secret**

Add these two secrets:
| Name | Value |
|------|-------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Your Supabase anon key |

This enables the automatic data sync every 10 minutes via GitHub Actions.

---

## Step 4: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. Click **"Add New Project"**
3. Import your `bittensor-dashboard` repository
4. **Configure Environment Variables** (in Vercel dashboard):
   - `VITE_SUPABASE_URL` = Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = Your Supabase anon key
5. Click **Deploy**

Vercel will:
- Build your site automatically
- Give you a permanent URL (e.g., `bittensor-dashboard.vercel.app`)
- Auto-deploy whenever you push to `main`

---

## Step 5: (Optional) Custom Domain

In Vercel dashboard:
1. Go to your project **Settings > Domains**
2. Add your custom domain
3. Follow DNS instructions

---

## How It Works

### Frontend (Vercel)
- Static React app hosted on Vercel's CDN
- Fetches data from Supabase on page load
- Refresh button for manual updates

### Data Sync (GitHub Actions)
- Runs every 10 minutes via `.github/workflows/sync-data.yml`
- Fetches latest data from TaoMarketCap
- Updates Supabase database
- You can also trigger manually from **Actions** tab

### Database (Supabase)
- Stores all subnet metrics
- Handles historical data
- Free tier: 500MB storage, 2GB bandwidth/month

---

## Local Development

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/bittensor-dashboard.git
cd bittensor-dashboard

# Install dependencies
pnpm install

# Create .env file
cp .env.example .env
# Edit .env with your Supabase credentials

# Start dev server
pnpm dev
```

---

## Manual Sync

To manually trigger a data sync:
1. Go to your GitHub repo
2. Click **Actions** tab
3. Select **"Sync Bittensor Subnet Data"**
4. Click **"Run workflow"**

---

## Troubleshooting

### No data showing?
- Check Supabase has the schema installed
- Verify environment variables are set in Vercel
- Run the GitHub Action manually to populate data

### Sync failing?
- Check GitHub Secrets are set correctly
- View the Actions log for error details

### Build failing?
- Ensure all dependencies are installed
- Check for TypeScript errors

---

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Vercel
- **Automation**: GitHub Actions

---

## Data Sources

- [TaoMarketCap](https://taomarketcap.com) - Price, Market Cap, Emissions
- [TaoRevenue](https://taorevenue.com) - Revenue metrics
- [Taostats](https://taostats.io) - Network statistics

---

## License

MIT
