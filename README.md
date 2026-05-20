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

**Instalações**
* Para instalar as bibliotecas, usar a versão proposta do Node v22.22.3: (`nvm install`) [Guia para instalação NVM: [LINK](https://github.com/nvm-sh/nvm#installing-and-updating)]


**Estrutura de Pastas e Nomenclatura:**
* `src/components/`: Componentes reutilizáveis (`PascalCase.tsx`). Devem usar `export default`.
* `src/pages/`: Rotas (`PascalCasePage.tsx`).
* `src/services/`: Chamadas a APIs externas (`camelCaseService.ts`). Devem usar named exports.
* `src/hooks/`: Custom hooks (`usePascalCase.ts` ou `.tsx`).
* `src/utils/`: Funções utilitárias (`camelCase.ts`).
* `src/types/`: Tipos TypeScript (`camelCase.types.ts`).

**Regras de Importação:**
* `pages/` pode importar de `components`, `services`, `hooks`, `utils`, `types`. NÃO importa de outras `pages/`.
* `components/` pode importar de `hooks`, `utils`, `types`. NÃO importa de `pages/` ou `services/`.
* `services/` pode importar de `utils`, `types`. NÃO importa de `components/`, `pages/`, `hooks/`.

**Qualidade:**
* Proibido o uso de `console.log`.
* Proibido CSS inline (use classes do Tailwind).
* Componentes não podem fazer chamadas diretas com `fetch()` ou `axios`. Chamadas devem ficar em `services/`.
