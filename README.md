# Comida di Buteco

Projeto para visualização e análise de bares participantes do concurso Comida di Buteco.

## Objetivo
- Disponibilizar um mapa interativo dos bares participantes.
- Permitir filtragem por cidade e bairro.
- Pipeline para processamento e enriquecimento dos dados dos bares.

## Estrutura
- `app/` — Aplicação web (Next.js/React)
- `pipeline/` — Scripts Python para processamento de dados
- `shared/` — Dados compartilhados

## Como executar

### Frontend (app)
1. Acesse a pasta `app/`:
   ```bash
   cd app
   ```
2. Instale as dependências:
   ```bash
   npm install
   # ou
   pnpm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   # ou
   pnpm dev
   ```
4. Acesse [http://localhost:3000](http://localhost:3000)

### Pipeline de dados
Veja instruções em `pipeline/README.md`.
