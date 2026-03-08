import os
import requests
from bs4 import BeautifulSoup
from supabase import create_client
import pandas as pd
import time
import random

# Database connection via environment variables
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")

if not url or not key:
    raise RuntimeError("SUPABASE_URL and SUPABASE_KEY environment variables are required.")

supabase = create_client(url, key)


def get_latest_criteria():
    """Fetch the most recent search criteria from Supabase."""
    try:
        res = supabase.table("search_criteria").select("*").order("id", desc=True).limit(1).execute()
        if res.data:
            return res.data[0]
    except Exception as e:
        print(f"Could not fetch criteria from DB: {e}")
    return {"max_price": 40000, "max_miles": 50000, "min_year": 2020, "zip_code": "30092"}


def run_acquisition_hunt():
    criteria = get_latest_criteria()
    max_price = criteria.get("max_price", 40000)
    max_miles = criteria.get("max_miles", 50000)
    min_year = criteria.get("min_year", 2020)
    zip_code = criteria.get("zip_code", "30092")

    print(f"VINScout Hunter Active: {min_year}+ vehicles under ${max_price:,}, max {max_miles:,} mi, near {zip_code}")

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    }
    search_url = (
        f"https://www.cars.com/shopping/results/"
        f"?stock_type=used"
        f"&list_price_max={max_price}"
        f"&mileage_max={max_miles}"
        f"&year_min={min_year}"
        f"&maximum_distance=100"
        f"&zip={zip_code}"
    )

    try:
        response = requests.get(search_url, headers=headers, timeout=20)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        listings = soup.find_all('div', class_='vehicle-card')

        if not listings:
            print(f"No vehicle cards found. URL: {search_url}")
            return

        found_count = 0
        for truck in listings[:15]:
            try:
                title_el = truck.find('h2', class_='title')
                if not title_el:
                    continue
                full_name = title_el.text.strip()
                parts = full_name.split(' ')

                year_val = int(parts[0])
                make_val = parts[1]
                model_val = " ".join(parts[2:])

                price_el = truck.find('span', class_='primary-price')
                price_val = price_el.text.strip() if price_el else "Call"

                miles_el = truck.find('div', class_='mileage')
                miles_val = miles_el.text.strip() if miles_el else "N/A"

                dealer_el = truck.find('div', class_='dealer-name')
                dealer_val = dealer_el.text.strip() if dealer_el else "Dealer Listed"

                score_base = 85.0
                if year_val >= 2023:
                    score_base += 5
                upper_model = model_val.upper()
                if any(trim in upper_model for trim in ["SLT", "LARAMIE", "LARIAT", "XLT", "BIG HORN"]):
                    score_base += 3

                truck_data = {
                    "year": year_val,
                    "make": make_val,
                    "model": model_val,
                    "price": price_val,
                    "mileage": miles_val,
                    "dealer_name": dealer_val,
                    "score": round(score_base, 1),
                    "vin": f"HUNT-{year_val}-{make_val[:3].upper()}-{int(time.time())}-{random.randint(100,999)}"
                }

                supabase.table("verified_vehicles").upsert(truck_data).execute()
                found_count += 1
                print(f"  Verified: {year_val} {make_val} {model_val} | {price_val} | {miles_val} | {dealer_val}")

            except Exception as e:
                print(f"  Skipped listing: {e}")
                continue

        print(f"Hunt Complete: {found_count} vehicles pushed to VINScout DB.")

    except requests.RequestException as e:
        print(f"Hunt Failed: {e}")


if __name__ == "__main__":
    run_acquisition_hunt()
