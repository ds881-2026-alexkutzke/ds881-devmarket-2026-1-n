# DevMarket

[![CI Status](https://github.com/ds881-2026-alexkutzke/ds881-devmarket-2026-1-n/actions/workflows/ci.yml/badge.svg)](https://github.com/ds881-2026-alexkutzke/ds881-devmarket-2026-1-n/actions/workflows/ci.yml)

## Acesse o protótipo das telas nesse [LINK](https://balsamiq.cloud/s806n0/pamvp6b/rA310)

## Convenções de Arquitetura

Documentação completa em [ARCHITECTURE.md](./ARCHITECTURE.md). Resumo dos pontos mais frequentes:

* **Estrutura**: cada pasta em `src/` tem responsabilidade fixa (`components/`, `pages/`, `services/`, `hooks/`, `utils/`, `types/`, `i18n/`).
* **Nomenclatura**: `PascalCase.tsx` em components, `PascalCasePage.tsx` em pages, `camelCaseService.ts` em services. Detalhes na seção 4 do ARCHITECTURE.
* **Importação entre camadas** é restrita e validada por teste automatizado — ex: `components/` não importa de `pages/` ou `services/`. Ver seção 5 do ARCHITECTURE.
* **Estilização**: MUI para componentes interativos (botões, inputs, modais), Tailwind para layout (flex, grid, espaçamento). `<button>` nativo é proibido.
* **i18n**: toda string visível ou audível (incluindo `aria-label`) passa por `t()`. Chaves organizadas em `pages.*`, `components.*` e `common.*`.
* **Qualidade**: sem `console.log`, sem CSS inline, sem `fetch()`/`axios` em components/pages, components com default export, services com named exports.
