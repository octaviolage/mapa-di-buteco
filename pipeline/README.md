# Pipeline de Dados — Comida di Buteco

Scripts para processamento, limpeza e enriquecimento dos dados dos bares participantes do concurso.

## Objetivo
- Extrair, transformar e enriquecer dados de bares a partir de arquivos CSV.
- Gerar dados prontos para uso na aplicação web.

## Estrutura
- `src/flows/` — Scripts principais do pipeline (extract, transform, load, enrich)
- `src/data/` — Dados de entrada e saída

## Como executar

1. Acesse a pasta do pipeline:
   ```bash
   cd pipeline
   ```
2. (Recomendado) Crie e ative um ambiente virtual:
   ```bash
   python -m venv .venv
   .venv\Scripts\activate  # Windows
   source .venv/bin/activate  # Linux/Mac
   ```
3. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   # ou
   pip install -e .
   ```
4. Execute o pipeline desejado, por exemplo:
   ```bash
   python src/flows/extract_bars.py
   python src/flows/enriched_address.py
   ```

Ajuste os scripts conforme necessário para a cidade ou dataset desejado.
