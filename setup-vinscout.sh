#!/bin/bash
# ============================================================
#  VINScout One-Click Setup
#  Run this script and follow the prompts. That's it.
# ============================================================
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
NC='\033[0m'

echo ""
echo -e "${BLUE}${BOLD}========================================${NC}"
echo -e "${BLUE}${BOLD}   VINScout Setup Wizard${NC}"
echo -e "${BLUE}${BOLD}========================================${NC}"
echo ""

# -----------------------------------------------------------
# STEP 1: Check prerequisites
# -----------------------------------------------------------
echo -e "${BOLD}STEP 1/5: Checking prerequisites...${NC}"

missing=0
for cmd in git python3 pip3; do
    if command -v $cmd &> /dev/null; then
        echo -e "  ${GREEN}OK${NC} $cmd found"
    else
        echo -e "  ${RED}MISSING${NC} $cmd not found"
        missing=1
    fi
done

if [ $missing -eq 1 ]; then
    echo -e "${RED}Install the missing tools above and re-run this script.${NC}"
    exit 1
fi
echo ""

# -----------------------------------------------------------
# STEP 2: Get Supabase credentials
# -----------------------------------------------------------
echo -e "${BOLD}STEP 2/5: Supabase credentials${NC}"
echo ""
echo -e "  ${YELLOW}Go to: https://supabase.com/dashboard${NC}"
echo "  Click your project > Settings (gear icon) > API Keys"
echo ""

ENV_FILE=".env"
if [ -f "$ENV_FILE" ]; then
    echo -e "  ${GREEN}Found existing .env file${NC}"
    # shellcheck disable=SC1090
    source "$ENV_FILE"
fi

if [ -z "$SUPABASE_URL" ]; then
    echo -e "  Paste your ${BOLD}Project URL${NC} (looks like https://xxxxx.supabase.co):"
    read -r SUPABASE_URL
fi

if [ -z "$SUPABASE_KEY" ]; then
    echo -e "  Paste your ${BOLD}anon/public key${NC} (starts with eyJ...):"
    read -r SUPABASE_KEY
fi

# Validate inputs
if [[ ! "$SUPABASE_URL" == https://*.supabase.co* ]]; then
    echo -e "${RED}That doesn't look like a Supabase URL. It should be https://xxxxx.supabase.co${NC}"
    exit 1
fi

if [[ ! "$SUPABASE_KEY" == eyJ* ]]; then
    echo -e "${RED}That doesn't look like a Supabase anon key. It should start with eyJ...${NC}"
    exit 1
fi

# Save to .env
cat > "$ENV_FILE" << EOF
SUPABASE_URL=$SUPABASE_URL
SUPABASE_KEY=$SUPABASE_KEY
EOF
echo -e "  ${GREEN}Saved to .env${NC}"
echo ""

# -----------------------------------------------------------
# STEP 3: Install Python dependencies
# -----------------------------------------------------------
echo -e "${BOLD}STEP 3/5: Installing Python packages...${NC}"
pip3 install -q -r vinscout-system/requirements.txt
echo -e "  ${GREEN}Done${NC}"
echo ""

# -----------------------------------------------------------
# STEP 4: Test the database connection
# -----------------------------------------------------------
echo -e "${BOLD}STEP 4/5: Testing database connection...${NC}"
RESULT=$(python3 -c "
import os
os.environ['SUPABASE_URL'] = '$SUPABASE_URL'
os.environ['SUPABASE_KEY'] = '$SUPABASE_KEY'
from supabase import create_client
sb = create_client('$SUPABASE_URL', '$SUPABASE_KEY')
try:
    res = sb.table('verified_vehicles').select('*').limit(1).execute()
    print('OK')
except Exception as e:
    print(f'FAIL:{e}')
" 2>&1)

if [[ "$RESULT" == "OK" ]]; then
    echo -e "  ${GREEN}Connected to Supabase successfully!${NC}"
else
    echo -e "  ${RED}Connection failed: $RESULT${NC}"
    echo ""
    echo "  Possible fixes:"
    echo "    - Check that the URL and key are correct"
    echo "    - Make sure the 'verified_vehicles' table exists in your Supabase project"
    echo "    - Check that Row Level Security allows reads with the anon key"
    echo ""
    echo -e "  ${YELLOW}Create the table by running this SQL in Supabase SQL Editor:${NC}"
    echo ""
    cat << 'SQLEOF'
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

    -- Allow reads with anon key
    ALTER TABLE verified_vehicles ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Allow public read" ON verified_vehicles FOR SELECT USING (true);
    CREATE POLICY "Allow public insert" ON verified_vehicles FOR INSERT WITH CHECK (true);
    CREATE POLICY "Allow public update" ON verified_vehicles FOR UPDATE USING (true);
SQLEOF
    echo ""
    echo "  After creating the table, re-run this script."
    exit 1
fi
echo ""

# -----------------------------------------------------------
# STEP 5: Choose how to run
# -----------------------------------------------------------
echo -e "${BOLD}STEP 5/5: How do you want to run VINScout?${NC}"
echo ""
echo "  1) Run locally right now (opens in browser)"
echo "  2) Run with Docker (background service)"
echo "  3) Just verify setup - I'll deploy to Streamlit Cloud myself"
echo ""
read -p "  Pick 1, 2, or 3: " CHOICE

case $CHOICE in
    1)
        echo ""
        echo -e "${GREEN}${BOLD}Starting VINScout...${NC}"
        echo -e "  Opening at ${BLUE}http://localhost:8501${NC}"
        echo -e "  Press Ctrl+C to stop"
        echo ""
        cd vinscout-system
        SUPABASE_URL="$SUPABASE_URL" SUPABASE_KEY="$SUPABASE_KEY" \
            python3 -m streamlit run streamlit_app.py --server.port 8501
        ;;
    2)
        if command -v docker &> /dev/null; then
            echo ""
            echo -e "${GREEN}${BOLD}Starting Docker services...${NC}"
            docker compose up -d --build vinscout
            echo -e "  VINScout running at ${BLUE}http://localhost:8501${NC}"
            echo -e "  Run ${BOLD}docker compose logs -f vinscout${NC} to see logs"
        else
            echo -e "${RED}Docker not found. Install Docker first: https://docs.docker.com/get-docker/${NC}"
            exit 1
        fi
        ;;
    3)
        echo ""
        echo -e "${GREEN}${BOLD}Setup verified!${NC} Your credentials work."
        echo ""
        echo "  To deploy to Streamlit Cloud:"
        echo "  1. Go to share.streamlit.io"
        echo "  2. Click your vinscout-system app > Settings > Secrets"
        echo "  3. Paste this exactly:"
        echo ""
        echo -e "${YELLOW}SUPABASE_URL = \"$SUPABASE_URL\""
        echo -e "SUPABASE_KEY = \"$SUPABASE_KEY\"${NC}"
        echo ""
        echo "  4. Click Save, then Reboot app"
        echo "  5. Done. Your app is live."
        ;;
    *)
        echo "Invalid choice. Run the script again."
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}${BOLD}Setup complete!${NC}"
echo ""
