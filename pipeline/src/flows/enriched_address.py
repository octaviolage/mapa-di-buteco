import os
import csv
import json
import requests
from prefect import flow, task
import logging
from dotenv import load_dotenv


load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(os.path.dirname(SCRIPT_DIR), "data")
INPUT_DIR = os.path.join(DATA_DIR, "bars")
OUTPUT_DIR = os.path.join(DATA_DIR, "geo")
GEOAPIFY_API_KEY = os.getenv("GEOAPIFY_API_KEY") # Set your API key here or via env var

@task
def load_addresses(city: str):
    """Load addresses from the CSV file for the given city."""
    bars_path = os.path.join(INPUT_DIR, f"{city}.csv")
    addresses = []
    with open(bars_path, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            address = row.get("address")
            if address:
                addresses.append(address)
    logger.info(f"Loaded {len(addresses)} addresses from {bars_path}")
    return addresses

@task(retries=3, retry_delay_seconds=5)
def geocode_address(address: str):
    """Query GeoAPIfy for a single address."""
    url = "https://api.geoapify.com/v1/geocode/autocomplete"
    params = {
        "text": address,
        "apiKey": GEOAPIFY_API_KEY,
        "format": "json",
        "limit": 1
    }
    try:
        resp = requests.get(url, params=params, timeout=60)
        resp.raise_for_status()
        data = resp.json()
        logger.info(f"GeoAPIfy response for '{address}': {data.get('features', [])[:1]}")
        return data
    except Exception as e:
        logger.warning(f"GeoAPIfy error for '{address}': {e}")
        raise e

@task
def save_geojson(city: str, geo_dict: dict):
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    filename = os.path.join(OUTPUT_DIR, f"{city}.json")
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(geo_dict, f, ensure_ascii=False, indent=2)
    logger.info(f"Saved geocoded data to {filename}")

@flow(name="Enrich Addresses with GeoAPIfy")
def enrich_addresses_flow(city: str, skip_existing: bool = True):
    addresses = load_addresses(city)
    geo_dict = {}
    output_path = os.path.join(OUTPUT_DIR, f"{city}.json")
    # Se skip_existing, tenta carregar o arquivo existente
    if skip_existing and os.path.exists(output_path):
        with open(output_path, encoding="utf-8") as f:
            try:
                geo_dict = json.load(f)
            except Exception:
                geo_dict = {}
    count = 0
    for address in addresses:
        if skip_existing and address in geo_dict and geo_dict[address]:
            logger.info(f"Skipping already geocoded: {address}")
            continue
        try:
            f_address = address.replace('Pça.', 'Praça')
            geo_data = geocode_address(f_address)
        except Exception as e:
            logger.error(f"Failed to geocode '{address}': {e}")
            geo_data = None
        geo_dict[address] = geo_data
        count += 1
    save_geojson(city, geo_dict)
    return geo_dict

if __name__ == "__main__":
    enrich_addresses_flow(city='sao-paulo')
