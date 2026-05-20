# Arquitetura do DevMarket

## 1. Visão Geral

O DevMarket é uma Single Page Application (SPA) frontend, sem backend próprio. Consome APIs públicas para dados de produtos, conversão de moedas e auto-complete de endereço. Deploy estático no GitHub Pages.

## 2. Stack Tecnológica

| Camada | Tecnologia | Observação |
|---|---|---|
| Linguagem | TypeScript | Não usar `any` exceto em casos justificados |
| Build / dev server | Vite | |
| Framework UI | React 19 | |
| Roteamento | `react-router-dom` v7 | `createBrowserRouter` em `src/routes.tsx` |
| Estilização — layout | Tailwind CSS v4 | Flex, grid, espaçamento, bordas, backgrounds |
| Estilização — componentes interativos | Material UI (MUI) | Botões, inputs, modais, selects, tooltips |
| Internacionalização | `react-i18next` | Idiomas: `pt-BR` (default), `en` |
| Testes | Vitest | Inclui testes de arquitetura em `src/tests/architecture/` |
| Lint | ESLint + typescript-eslint | |
| Containers | Docker + Docker Compose | Multi-stage: dev (Vite) e prod (nginx) |
| CI/CD | GitHub Actions | Deploy automático no GitHub Pages |
| Runtime Node | 22 (LTS) | Pinado em `.tool-versions`, Dockerfile e CI |

## 3. Estrutura de Diretórios

```text
/
├── .github/workflows/        # Pipelines de CI/CD
├── public/                   # Assets estáticos servidos pela raiz
├── src/
│   ├── assets/               # Imagens, ícones, fontes importados pelo JS
│   ├── components/           # Componentes reutilizáveis (PascalCase.tsx)
│   ├── pages/                # Componentes de rota (PascalCasePage.tsx)
│   ├── services/             # Chamadas a APIs externas (camelCaseService.ts)
│   ├── hooks/                # Custom hooks (use*.ts/.tsx)
│   ├── utils/                # Funções puras auxiliares (camelCase.ts)
│   ├── types/                # Tipos TypeScript compartilhados (*.types.ts)
│   ├── i18n/
│   │   ├── i18n.ts           # Configuração do i18next
│   │   └── locales/          # pt-BR.json, en.json
│   ├── tests/architecture/   # Testes de arquitetura (mantidos pelo Time DevOps)
│   ├── routes.tsx            # Definição das rotas (único arquivo que importa páginas)
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css             # Tema global, design tokens, @import Tailwind
├── Dockerfile
└── docker-compose.yml
```

## 4. Convenções de Nomenclatura de Arquivos

| Pasta | Padrão | Exemplo |
|---|---|---|
| `components/` | `PascalCase.tsx` | `ProductCard.tsx`, `QuantitySelector.tsx` |
| `pages/` | `PascalCasePage.tsx` | `HomePage.tsx`, `CheckoutPage.tsx` |
| `services/` | `camelCaseService.ts` | `productService.ts`, `cepService.ts` |
| `hooks/` | `use<PascalCase>.ts/.tsx` | `useCart.ts`, `useProducts.ts` |
| `utils/` | `camelCase.ts` | `formatCurrency.ts`, `pixGenerator.ts` |
| `types/` | `camelCase.types.ts` | `product.types.ts`, `cart.types.ts` |

## 5. Regras de Importação entre Camadas

A separação de responsabilidades é validada por teste automatizado.

| Origem | Pode importar de | NÃO pode importar de |
|---|---|---|
| `pages/` | components, services, hooks, utils, types | outras `pages/` |
| `components/` | hooks, utils, types | pages, services |
| `services/` | utils, types | components, pages, hooks |
| `hooks/` | services, utils, types | components, pages |
| `utils/` | types | components, pages, hooks, services |

**Regra adicional sobre rotas:** apenas `src/routes.tsx` pode importar de `src/pages/`. `App.tsx` consome o router já montado — isso evita merge conflicts quando vários devs adicionam rotas simultaneamente.

## 6. Qualidade de Código

| Regra | Justificativa |
|---|---|
| Proibido `console.log`, `console.warn`, `console.error`, `console.debug` em código mergeado | Polui o console em produção |
| Proibido CSS inline (`style={{ ... }}`) | Usar Tailwind. Estilo dinâmico raro pode usar `style` com variáveis CSS (`var(--*)`) |
| Componentes usam **default export** | Permite renomear no import sem refactor |
| Services usam **named exports** | Força importação explícita de funções específicas |
| Proibido `fetch()`, `axios.*`, `XMLHttpRequest` em `components/` e `pages/` | Toda chamada de API vive em `services/` |
| Proibidas dependências circulares | Validado por teste de arquitetura |

## 7. Estilização: divisão MUI + Tailwind

Convenção crítica para manter consistência visual com 40 contribuidores:

- **MUI** para todo componente **interativo nativo**: `Button`, `IconButton`, `TextField`, `Select`, `Checkbox`, `Modal`, `Tooltip`, `Snackbar`, `Drawer`, etc.
- **Tailwind** para **layout e composição**: containers, espaçamento, grid/flex, bordas, backgrounds, tipografia.
- **`<button>` HTML nativo é proibido** em código de componentes/páginas — sempre `Button` ou `IconButton` do MUI.
- **Ícones**: `@mui/icons-material`. SVG inline só se for ilustração que não existe na biblioteca.

### Design tokens

Cores semânticas estão declaradas em `src/index.css` via `@theme` do Tailwind:

- `primary-*` — cor principal da marca
- `success-*` — preço com desconto, ações positivas
- `danger-*` — preço tachado, erros
- `muted-*` — textos secundários, bordas, fundos neutros

Use as escalas semânticas em vez de cores arbitrárias (`bg-red-500`, `text-blue-700`, etc.).

> **⚠️ Pendente:** configurar `ThemeProvider` do MUI mapeando esses tokens para que componentes MUI usem nossa paleta. Sem isso, botões MUI saem no azul-padrão do Material e o design fica inconsistente. **Issue a abrir.**

## 8. Internacionalização (i18n)

Toda string visível ou audível ao usuário **deve** passar por `t()` — incluindo `aria-label`, `placeholder`, `title` e mensagens de erro. Strings hardcoded são tratadas como bug de acessibilidade.

### Estrutura dos arquivos `pt-BR.json` / `en.json`

Três namespaces de primeiro nível:

```json
{
  "pages": {
    "home": { "title": "...", "loading": "..." },
    "checkout": { "title": "..." }
  },
  "components": {
    "quantitySelector": {
      "decrease": "Diminuir quantidade",
      "increase": "Aumentar quantidade",
      "remove": "Remover item"
    },
    "productCard": { "addToCart": "Adicionar ao carrinho" }
  },
  "common": {
    "save": "Salvar",
    "cancel": "Cancelar",
    "loading": "Carregando...",
    "error": "Erro"
  }
}
```

### Regras

- **`pages.<nomeDaPagina>`** — strings exclusivas de uma página
- **`components.<nomeDoComponente>`** — strings de componentes reutilizáveis
- **`common.*`** — strings repetidas em vários contextos (Salvar, Cancelar, Carregando, etc.). Sempre verificar `common` antes de criar string duplicada
- Nomes em **camelCase** dentro de cada seção
- Manter `pt-BR.json` e `en.json` **sincronizados** — toda chave nova entra nos dois arquivos no mesmo PR

## 9. Acessibilidade

- **Botões com ícone apenas** (sem texto): `aria-label` descrevendo a ação (`t('components.x.delete')`)
- **Conteúdo dinâmico visível** (contadores, status, valor de carrinho): `aria-live="polite"` ou `role="status"` no elemento. **Nunca `aria-label`**, que substituiria o conteúdo visível
- **Ícones decorativos** (SVG dentro de botão com `aria-label`): `aria-hidden="true"` no SVG
- **Estados desabilitados**: além de `disabled`, fornecer feedback visual (`opacity-40`, `cursor-not-allowed`)
- **Foco visível**: todo elemento interativo deve ter `focus-visible` ring claro

## 10. Roteamento

- Rotas são definidas em `src/routes.tsx` usando `createBrowserRouter`
- `App.tsx` apenas renderiza `<RouterProvider router={router} />` — nunca importa páginas diretamente
- O `basename` é injetado dinamicamente: `import.meta.env.BASE_URL`
  - Em dev (`vite`): `/`
  - Em build CI/Pages: `/ds881-devmarket-2026-1-n/` (definido em `vite.config.ts`)

> **⚠️ Limitação conhecida do GitHub Pages:** acessar diretamente uma rota interna (ex: `/produto/123`) ou dar F5 nela retorna 404. Soluções possíveis (ainda **não decidida**):
>
> - **(a)** Copiar `dist/index.html` como `dist/404.html` no script `build` — Pages serve o `404.html` automaticamente, React Router resolve no client
> - **(b)** Trocar `createBrowserRouter` por `createHashRouter` — URLs ficam com `#`, mas dispensam a gambiarra
>
> Discussão aberta — ver canal `#dificuldades-para-automatizar`.

## 11. Integrações e Fluxo de Dados (APIs)

Todas as integrações são isoladas em `src/services/`, com tratamento de erro (try/catch ou `.catch()`):

| API | Uso | Comportamento |
|---|---|---|
| **DummyJSON** (`dummyjson.com/products`) | Catálogo de produtos | Consulta na montagem da Home |
| **ExchangeRate-API** (`open.er-api.com/v6/latest/USD`) | Conversão USD → BRL | Resultado cacheado em estado global para evitar re-fetches |
| **ViaCEP** (`viacep.com.br/ws/{cep}/json/`) | Autocomplete no Checkout | Disparado quando CEP atinge 8 dígitos válidos |

## 12. Gerenciamento de Estado e Persistência

- **Carrinho** em estado global (Context ou Zustand) — acessível pelo Header (contador), Home (botão "Adicionar") e Checkout
- **Persistência**: toda mutação do carrinho espelha no `localStorage`
- **Hidratação**: ao iniciar a app, o estado global lê o `localStorage` antes da primeira renderização

## 13. Infraestrutura e Pipeline

### Local

- `docker compose up -d dev` — Vite com hot reload em `localhost:5173`
- `docker compose up -d prod` — nginx servindo o build estático em `localhost:8080` (simula GitHub Pages)
- Dockerfile multi-stage: `deps` → `dev` / `build` → `prod`
- `.dockerignore` mantém o contexto de build mínimo

### CI/CD

Pipeline GitHub Actions (`.github/workflows/ci.yml`) com 4 jobs:

1. **lint** — ESLint
2. **test** — Vitest single-run (inclui testes de arquitetura)
3. **build** — `vite build` e upload do artefato
4. **deploy** — só em push para `main`, publica o artefato no GitHub Pages

Branch protection na `main`: 1 approval + CI verde, sem push direto.

---

## Notas para Tech Leads

Decisões marcadas com **⚠️ Pendente** precisam de alinhamento entre os 6 TLs antes de virar regra definitiva. Issues sugeridas para abrir:

- [ ] Configurar `ThemeProvider` do MUI com nossos design tokens (seção 7)
- [ ] Decidir estratégia de deep linking no Pages: `404.html` vs `HashRouter` (seção 10)
- [ ] Automatizar validações no pipeline:
  - Proibição de `<button>` HTML nativo em `components/` e `pages/`
  - Detecção de strings hardcoded com letras acentuadas em JSX (heurística para forçar uso de `t()`)
  - Validação do schema dos arquivos de locale (`pages.*`, `components.*`, `common.*`)
