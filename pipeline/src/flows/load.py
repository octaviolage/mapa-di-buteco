import os
import json
from prefect import flow, task
import logging
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(os.path.dirname(SCRIPT_DIR), "data")
FINAL_DIR = os.path.join(DATA_DIR, "final")
# Salva na pasta 'shared' na raiz do projeto
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(SCRIPT_DIR)))
OUTPUT_DIR = os.path.join(PROJECT_ROOT, "app", "data")

@task
def load_all_final():
    all_data = []
    for fname in os.listdir(FINAL_DIR):
        if fname.endswith(".json"):
            path = os.path.join(FINAL_DIR, fname)
            with open(path, encoding="utf-8") as f:
                try:
                    data = json.load(f)
                    all_data.extend(data)
                    logger.info(f"Loaded {len(data)} records from {fname}")
                except Exception as e:
                    logger.error(f"Error loading {fname}: {e}")
    logger.info(f"Total records loaded: {len(all_data)}")
    return all_data

@task
def save_all_json(data):
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    out_path = os.path.join(OUTPUT_DIR, f"butecos.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    logger.info(f"Saved merged data to {out_path}")

@flow(name="Merge All Cities Final Data")
def merge_all_flow():
    data = load_all_final()
    save_all_json(data)
    return data

if __name__ == "__main__":
    merge_all_flow()
