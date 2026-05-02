import sys
from prefect import flow

from flows.extract_bars import extract_bars_flow
from flows.enriched_address import enrich_addresses_flow
from flows.transform import transform_flow
from flows.load import merge_all_flow
from clear_outputs import clear_data_folder

@flow(name="Full Pipeline")
def full_pipeline(cities):
    for city in cities:
        print(f"\n--- Processing {city} ---")
        # extract_bars_flow(city)
        # enrich_addresses_flow(city)
        transform_flow(city)
    merge_all_flow()

if __name__ == "__main__":
    cities = [
        "belem",
        "belo-horizonte",
        "blumenau",
        "brasilia-butecos",
        "campinas",
        "curitiba-butecos",
        "florianopolis",
        "fortaleza",
        "goias",
        "joinville",
        "juiz-de-fora",
        "londrina",
        "manaus-butecos",
        "maringa",
        "montes-claros",
        "pocos-de-caldas",
        "porto-alegre",
        "recife",
        "ribeirao-preto",
        "nova-iguacu-duque-de-caxias",
        "rio-de-janeiro",
        "niteroi",
        "salvador", 
        "sao-jose-do-rio-preto",
        "sao-paulo",
        "triangulo-mineiro",
        "vale-do-aco",
    ]

    # Limpa a pasta de dados antes de rodar o pipeline se constar para isso no argumento
    if len(sys.argv) > 1 and sys.argv[1] == "--clear":
        clear_data_folder()
    full_pipeline(cities)
