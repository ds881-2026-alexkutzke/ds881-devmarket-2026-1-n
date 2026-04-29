# DevMarket

## Convenções de Arquitetura

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
