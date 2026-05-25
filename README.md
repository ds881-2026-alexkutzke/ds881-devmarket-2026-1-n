# DevMarket

[![CI Status](https://github.com/ds881-2026-alexkutzke/ds881-devmarket-2026-1-n/actions/workflows/ci.yml/badge.svg)](https://github.com/ds881-2026-alexkutzke/ds881-devmarket-2026-1-n/actions/workflows/ci.yml)

## Acesse o protótipo das telas nesse [LINK](https://balsamiq.cloud/s806n0/pamvp6b/rA310)

## Rodando com Docker

O projeto tem dois ambientes prontos via Docker Compose. Pré-requisito: Docker + Docker Compose instalados.

### Desenvolvimento (hot reload)

Sobe o Vite em modo dev com hot reload. Suas alterações em `src/` refletem na hora.

```bash
docker compose up -d dev
```

Acesse: [http://localhost:5173](http://localhost:5173)

### Produção (simulação local do GitHub Pages)

Builda os assets estáticos e serve com nginx — mesma stack que o GitHub Pages usa. Útil pra testar o build antes de abrir PR.

```bash
docker compose up -d prod
```

Acesse: [http://localhost:8080](http://localhost:8080)

> A flag `-d` (detached) sobe o container em background e devolve o terminal. Sem ela, o terminal fica preso no log do container e `Ctrl+C` derruba o serviço.

### Acompanhando o que está rodando

```bash
docker compose ps                  # lista containers do projeto
docker compose logs -f dev         # tail dos logs (Ctrl+C sai sem parar o container)
docker compose logs -f prod
```

### Parando os containers

```bash
docker compose down          # para e remove containers + rede
docker compose down -v       # também remove volumes (limpa cache do node_modules)
```

### Rebuildar do zero

Quando mudar `package.json`, `Dockerfile` ou `.dockerignore`:

```bash
docker compose build --no-cache dev    # ou prod
```

## Convenções de Arquitetura

Documentação completa em [ARCHITECTURE.md](./ARCHITECTURE.md). Resumo dos pontos mais frequentes:

* **Estrutura**: cada pasta em `src/` tem responsabilidade fixa (`components/`, `pages/`, `services/`, `hooks/`, `utils/`, `types/`, `i18n/`).
* **Nomenclatura**: `PascalCase.tsx` em components, `PascalCasePage.tsx` em pages, `camelCaseService.ts` em services. Detalhes na seção 4 do ARCHITECTURE.
* **Importação entre camadas** é restrita e validada por teste automatizado — ex: `components/` não importa de `pages/` ou `services/`. Ver seção 5 do ARCHITECTURE.
* **Estilização**: MUI para componentes interativos (botões, inputs, modais), Tailwind para layout (flex, grid, espaçamento). `<button>` nativo é proibido.
* **i18n**: toda string visível ou audível (incluindo `aria-label`) passa por `t()`. Chaves organizadas em `pages.*`, `components.*` e `common.*`.
* **Qualidade**: sem `console.log`, sem CSS inline, sem `fetch()`/`axios` em components/pages, components com default export, services com named exports.
