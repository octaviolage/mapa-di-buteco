import os
import csv
import json
from prefect import flow, task
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(os.path.dirname(SCRIPT_DIR), "data")
BARS_DIR = os.path.join(DATA_DIR, "bars")
GEO_DIR = os.path.join(DATA_DIR, "geo")
OUTPUT_DIR = os.path.join(DATA_DIR, "final")

def city_name_mapping(city):
    mapping = {
        "belem": "Belém",
        "belo-horizonte": "Belo Horizonte",
        "blumenau": "Blumenau",
        "brasilia-butecos": "Brasília",
        "campinas": "Campinas",
        "curitiba-butecos": "Curitiba",
        "florianopolis": "Florianópolis",
        "fortaleza": "Fortaleza",
        "goias": "Goiás",
        "joinville": "Joinville",
        "juiz-de-fora": "Juiz de Fora",
        "londrina": "Londrina",
        "manaus-butecos": "Manaus",
        "maringa": "Maringá",
        "montes-claros": "Montes Claros",
        "pocos-de-caldas": "Poços de Caldas",
        "porto-alegre": "Porto Alegre",
        "recife": "Recife",
        "ribeirao-preto": "Ribeirão Preto",
        "nova-iguacu-duque-de-caxias": "Nova Iguaçu / Duque de Caxias",
        "rio-de-janeiro": "Rio de Janeiro",
        "niteroi": "Niterói",
        "salvador": "Salvador", 
        "sao-jose-do-rio-preto": "São José do Rio Preto",
        "sao-paulo": "São Paulo",
        "triangulo-mineiro": "Triângulo Mineiro",
        "vale-do-aco": "Vale do Aço",
    }
    return mapping.get(city, city.replace('-', ' ').title())

@task
def load_bars(city: str):
    bars_path = os.path.join(BARS_DIR, f"{city}.csv")
    bars = []
    with open(bars_path, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            bars.append(row)
    logger.info(f"Loaded {len(bars)} bars from {bars_path}")
    return bars

@task
def load_geo(city: str):
    geo_path = os.path.join(GEO_DIR, f"{city}.json")
    if not os.path.exists(geo_path):
        logger.warning(f"Geo file not found: {geo_path}")
        return {}
    with open(geo_path, encoding="utf-8") as f:
        geo = json.load(f)
    logger.info(f"Loaded geo data for {len(geo)} addresses from {geo_path}")
    return geo

@task
def save_final(city: str, data: list):
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    out_path = os.path.join(OUTPUT_DIR, f"{city}.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    logger.info(f"Saved final data to {out_path}")

@flow(name="Transform Bars and Geo Data")
def transform_flow(city: str):
    bars = load_bars(city)
    geo = load_geo(city)
    final = []
    for bar in bars:
        address = bar.get("address")
        geo_info = geo.get(address, {})
        # Extrai dados relevantes do geo_info
        if geo_info and "results" in geo_info and geo_info["results"]:
            props = geo_info["results"][0]
            suburb = props.get("suburb")
            district = props.get("district")
            bar_lat = props.get("lat")
            bar_lon = props.get("lon")
            city_name = city_name_mapping(city)
            state = props.get("state")
        else:
            bar_lat = bar_lon = suburb = district = city_name = state = None

        if city_name in ('Rio de Janeiro', 'São Paulo'):
            district = state
            state = city_name
        final.append({
            "name": bar.get("name"),
            "address": bar.get("address"),
            "photo": bar.get("photo"),
            "details_url": bar.get("details_url"),
            "extracted_at": bar.get("extracted_at"),
            "lat": bar_lat,
            "lon": bar_lon,
            "city": city_name,
            "suburb": suburb,
            "district": district
        })
    save_final(city, final)
    return final

if __name__ == "__main__":
    transform_flow("sao-paulo")
