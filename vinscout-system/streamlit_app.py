import streamlit as st
import pandas as pd
from supabase import create_client
import requests
from bs4 import BeautifulSoup
import time
import random

# --- 1. SECURE DATABASE CONNECTION (via Streamlit Secrets) ---
try:
    SUPABASE_URL = st.secrets["SUPABASE_URL"]
    SUPABASE_KEY = st.secrets["SUPABASE_KEY"]
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
except Exception as e:
    st.error(f"DATABASE CONNECTION FAILED. Check your Streamlit Secrets configuration. Error: {e}")
    st.stop()

# --- 2. THE DESIGN SYSTEM (HIGH-DENSITY DARK MODE) ---
st.set_page_config(page_title="VINScout Pro", layout="wide", initial_sidebar_state="expanded")

st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&family=JetBrains+Mono&display=swap');

    html, body, [data-testid="stAppViewContainer"] {
        background-color: #0B0F14;
        font-family: 'Inter', sans-serif;
        color: #F2F5F7;
    }

    [data-testid="stHeader"] { background: rgba(0,0,0,0); }

    [data-testid="stSidebar"] {
        background-color: #141A22;
        border-right: 1px solid #232B36;
        width: 320px !important;
    }
    .sidebar-section {
        color: #1C6CFF;
        font-size: 0.75rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        margin-top: 20px;
        margin-bottom: 10px;
    }

    div[data-testid="metric-container"] {
        background-color: #141A22;
        border: 1px solid #232B36;
        padding: 12px;
        border-radius: 4px;
    }

    .stButton>button {
        background: #1C6CFF;
        color: white;
        border-radius: 2px;
        font-weight: 800;
        width: 100%;
        height: 3.5em;
        border: none;
        text-transform: uppercase;
    }

    .vin-badge {
        border: 1px solid #F2F5F7;
        padding: 2px 8px;
        font-family: 'JetBrains Mono';
        font-weight: bold;
        font-size: 0.9rem;
        margin-right: 12px;
    }
    </style>
    """, unsafe_allow_html=True)

# --- 3. DYNAMIC VEHICLE REPOSITORY ---
VEHICLE_MASTER = {
    "Acura": ["Integra", "MDX", "RDX", "TLX"],
    "Audi": ["A3", "A4", "A6", "Q3", "Q5", "Q7", "Q8", "e-tron"],
    "BMW": ["3 Series", "5 Series", "7 Series", "X3", "X5", "X7", "M3", "M5"],
    "Chevrolet": ["Silverado 1500", "Tahoe", "Suburban", "Corvette", "Colorado", "Equinox"],
    "Ford": ["F-150", "Bronco", "Explorer", "F-250", "Mustang", "Ranger"],
    "GMC": ["Sierra 1500", "Yukon", "Acadia", "Canyon", "Terrain"],
    "Honda": ["Civic", "Accord", "CR-V", "Pilot", "Ridgeline"],
    "Porsche": ["911", "Cayenne", "Macan", "Taycan", "Panamera"],
    "RAM": ["1500", "2500", "3500"],
    "Tesla": ["Model 3", "Model Y", "Model S", "Model X"],
    "Toyota": ["Tacoma", "Tundra", "4Runner", "Camry", "Rav4", "Highlander"]
}

# --- 4. DATA EXTRACTION ENGINE ---
def run_vin_hunt(make, model, max_p, max_m, yr_min, yr_max, zip_code):
    """Scrape cars.com for matching vehicles and push to Supabase."""
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    }
    make_slug = make.lower()
    model_slug = f"{make.lower()}-{model.lower().replace(' ', '_')}"
    url = (
        f"https://www.cars.com/shopping/results/"
        f"?stock_type=used"
        f"&makes[]={make_slug}"
        f"&models[]={model_slug}"
        f"&list_price_max={max_p}"
        f"&mileage_max={max_m}"
        f"&year_min={yr_min}"
        f"&year_max={yr_max}"
        f"&maximum_distance=100"
        f"&zip={zip_code}"
    )

    try:
        r = requests.get(url, headers=headers, timeout=20)
        r.raise_for_status()
        soup = BeautifulSoup(r.text, 'html.parser')
        cards = soup.find_all('div', class_='vehicle-card')

        if not cards:
            return 0, url

        found = 0
        for c in cards[:15]:
            try:
                title_el = c.find('h2', class_='title')
                if not title_el:
                    continue
                title = title_el.text.strip()
                parts = title.split(' ')
                year_val = int(parts[0])
                make_val = parts[1]
                model_val = " ".join(parts[2:])

                price_el = c.find('span', class_='primary-price')
                price_text = price_el.text.strip() if price_el else "Call"

                mile_el = c.find('div', class_='mileage')
                mile_text = mile_el.text.strip() if mile_el else "N/A"

                dealer_el = c.find('div', class_='dealer-name')
                dealer_text = dealer_el.text.strip() if dealer_el else "Dealer Listed"

                # Parse numeric price for scoring
                price_num = 0
                try:
                    price_num = int(price_text.replace('$', '').replace(',', ''))
                except ValueError:
                    pass

                # Parse numeric mileage for scoring
                mile_num = 0
                try:
                    mile_num = int(mile_text.replace(' mi.', '').replace(',', ''))
                except ValueError:
                    pass

                # Score: newer + lower miles + lower price = higher
                score = 85.0
                if year_val >= 2023:
                    score += 5
                if mile_num < 30000:
                    score += 5
                if price_num > 0 and price_num < max_p * 0.8:
                    score += 3

                entry = {
                    "year": year_val,
                    "make": make_val,
                    "model": model_val,
                    "price": price_text,
                    "mileage": mile_text,
                    "dealer_name": dealer_text,
                    "score": round(score, 1),
                    "vin": f"SCAN-{year_val}-{make_val[:3].upper()}-{int(time.time())}-{random.randint(100,999)}"
                }
                supabase.table("verified_vehicles").upsert(entry).execute()
                found += 1
            except Exception:
                continue
        return found, url
    except requests.RequestException as e:
        return str(e), url


def compute_metrics(df):
    """Calculate real metrics from the dataframe."""
    metrics = {"count": len(df), "avg_price": "N/A", "avg_mileage": "N/A"}

    # Parse prices
    prices = []
    for p in df['price']:
        try:
            prices.append(int(str(p).replace('$', '').replace(',', '')))
        except (ValueError, TypeError):
            pass
    if prices:
        metrics["avg_price"] = f"${sum(prices) // len(prices):,}"

    # Parse mileages
    miles = []
    for m in df['mileage']:
        try:
            miles.append(int(str(m).replace(' mi.', '').replace(',', '')))
        except (ValueError, TypeError):
            pass
    if miles:
        metrics["avg_mileage"] = f"{sum(miles) // len(miles):,} mi"

    return metrics


# --- 5. STATE MANAGEMENT ---
if 'search_active' not in st.session_state:
    st.session_state.search_active = False
if 'last_search_url' not in st.session_state:
    st.session_state.last_search_url = None

# --- 6. SIDEBAR: SEARCH CONTROLS ---
with st.sidebar:
    st.markdown(
        '<div style="display:flex;align-items:center;margin-bottom:20px;">'
        '<span class="vin-badge">VIN</span>'
        '<span style="font-weight:800;font-size:1.2rem;">VINSCOUT</span>'
        '</div>',
        unsafe_allow_html=True
    )

    st.markdown('<p class="sidebar-section">1. Targeting</p>', unsafe_allow_html=True)
    brand = st.selectbox("Manufacturer", options=["Select Brand"] + list(VEHICLE_MASTER.keys()), index=0)

    if brand != "Select Brand":
        model = st.selectbox("Model", options=["Select Model"] + VEHICLE_MASTER[brand], index=0)
    else:
        st.info("Select a manufacturer to view available models.")
        model = "Select Model"

    st.markdown('<p class="sidebar-section">2. Constraints</p>', unsafe_allow_html=True)
    col1, col2 = st.columns(2)
    with col1:
        y_min = st.number_input("Year Min", value=2021, min_value=2000, max_value=2026)
    with col2:
        y_max = st.number_input("Year Max", value=2025, min_value=2000, max_value=2026)

    price_cap = st.slider("Price Cap ($)", 5000, 150000, 55000, step=1000)
    mile_cap = st.slider("Mileage Cap", 0, 200000, 50000, step=5000)
    zip_code = st.text_input("ZIP Code", value="30092")

    st.markdown('<p class="sidebar-section">3. Execution</p>', unsafe_allow_html=True)
    if st.button("RUN VINSCOUT SEARCH"):
        if brand == "Select Brand" or model == "Select Model":
            st.warning("Select a Brand and Model first.")
        elif not zip_code or len(zip_code) != 5 or not zip_code.isdigit():
            st.warning("Enter a valid 5-digit ZIP code.")
        else:
            with st.spinner(f"Scanning for {brand} {model}..."):
                result, search_url = run_vin_hunt(brand, model, price_cap, mile_cap, y_min, y_max, zip_code)
                st.session_state.last_search_url = search_url
                if isinstance(result, int):
                    st.session_state.search_active = True
                    if result > 0:
                        st.success(f"Found {result} vehicles.")
                    else:
                        st.warning("No vehicles matched. Try broadening your search or check the direct link below.")
                    st.rerun()
                else:
                    st.error(f"Search failed: {result}")

    if st.session_state.last_search_url:
        st.markdown(f"[View on Cars.com]({st.session_state.last_search_url})")

# --- 7. MAIN DASHBOARD ---
h1, h2 = st.columns([2, 1])
with h1:
    st.title("Intelligence Dashboard")
    st.caption("Vehicle Acquisition System")

with h2:
    st.markdown(
        '<div style="display:flex;justify-content:flex-end;gap:20px;font-size:0.75rem;font-weight:800;margin-top:10px;">'
        '<div style="color:#21C87A;">DB CONNECTED</div>'
        '<div style="color:#1C6CFF;">SCAN READY</div>'
        '</div>',
        unsafe_allow_html=True
    )

st.divider()

# --- 8. DATA DISPLAY ---
try:
    data_res = supabase.table("verified_vehicles").select("*").order("created_at", desc=True).limit(50).execute()
    if data_res.data:
        df = pd.DataFrame(data_res.data)

        # Real metrics from actual data
        metrics = compute_metrics(df)
        m1, m2, m3 = st.columns(3)
        m1.metric("VEHICLES IN DB", metrics["count"])
        m2.metric("AVG PRICE", metrics["avg_price"])
        m3.metric("AVG MILEAGE", metrics["avg_mileage"])

        st.divider()
        st.subheader("Vehicle Feed")

        display_cols = [c for c in ['year', 'make', 'model', 'price', 'mileage', 'dealer_name', 'score'] if c in df.columns]
        st.dataframe(df[display_cols], use_container_width=True, hide_index=True)
    else:
        st.info("No vehicles in the database yet. Use the sidebar to run a search.")
except Exception as e:
    st.error(f"Failed to load data: {e}")
