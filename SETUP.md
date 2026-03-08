# VINScout Setup Guide

Do these steps in order. Don't skip any.

---

## Option A: Automatic (Recommended)

```bash
git clone https://github.com/tpropis/ghstai.git
cd ghstai
./setup-vinscout.sh
```

The script asks you 2 questions, tests everything, and starts the app.
Done.

---

## Option B: Manual Step-by-Step

### Step 1: Create the Supabase Table

1. Open https://supabase.com/dashboard
2. Click your project (VINScout-DB)
3. Click **SQL Editor** (left sidebar, looks like `<>`)
4. Paste this entire block and click **Run**:

```sql
CREATE TABLE IF NOT EXISTS verified_vehicles (
    id BIGSERIAL PRIMARY KEY,
    year INTEGER,
    make TEXT,
    model TEXT,
    price TEXT,
    mileage TEXT,
    dealer_name TEXT,
    score REAL,
    vin TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE verified_vehicles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON verified_vehicles FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON verified_vehicles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON verified_vehicles FOR UPDATE USING (true);
```

You should see "Success. No rows returned." That's correct.

### Step 2: Get Your Supabase Keys

1. Still in supabase.com/dashboard
2. Click **Settings** (gear icon, bottom of left sidebar)
3. Click **API Keys**
4. You need TWO things:
   - **Project URL**: at the top of the page, looks like `https://xxxxxxxx.supabase.co`
   - **anon public key**: the long string starting with `eyJhbGciOi...` — click **Copy**

### Step 3: Deploy to Streamlit Cloud

1. Open https://share.streamlit.io
2. Find your app **vinscout-system**
3. Click the **3 dots** menu > **Settings**
4. Click **Secrets** in the left panel
5. Paste this (use YOUR real values from Step 2):

```toml
SUPABASE_URL = "https://yjuwktvcnmkegjemnxsr.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M..."
```

6. Click **Save**
7. Click **Reboot app** (top right)
8. Wait 30 seconds. Refresh. You should see the VINScout dashboard.

### Step 4: Set Up Auto-Deploy (GitHub Secrets)

This makes it so code changes auto-deploy when you push.

1. Open https://github.com/tpropis/ghstai/settings/secrets/actions
2. Click **New repository secret**
3. Add these two secrets (same values from Step 2):

| Name | Value |
|------|-------|
| `SUPABASE_URL` | `https://yjuwktvcnmkegjemnxsr.supabase.co` |
| `SUPABASE_KEY` | `eyJhbGciOi...` (your full anon key) |

4. That's it. The hunter will now run automatically every 6 hours.

---

## How It All Works

```
You push code to ghstai
       |
       v
GitHub Actions runs automatically
       |
       +---> Validates code (syntax check)
       +---> Syncs vinscout-system/ to your Streamlit repo
       +---> Streamlit Cloud auto-redeploys
       |
Every 6 hours:
       +---> Hunter searches cars.com
       +---> Pushes vehicles to Supabase
       +---> Dashboard shows new vehicles automatically
```

## Troubleshooting

**App shows "Setup Required" page:**
You didn't add the secrets yet. Go back to Step 3.

**App shows "DATABASE CONNECTION FAILED":**
Your key or URL is wrong. Go back to Step 2 and re-copy them carefully.

**No vehicles showing up:**
Run a search from the sidebar first. Pick a brand, model, and hit "RUN VINSCOUT SEARCH".

**Hunter not running:**
Check that you added the GitHub secrets (Step 4). Go to github.com/tpropis/ghstai > Actions tab to see if it ran.

**"Table does not exist" error:**
You skipped Step 1. Go run the SQL.
