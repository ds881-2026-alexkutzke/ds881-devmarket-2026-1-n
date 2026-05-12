import { describe, test, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

// Sobe dois níveis a partir de src/tests/architecture/ para chegar em src/
const PASTA_SRC = path.resolve(__dirname, '../../');

/**
 * Varre recursivamente uma pasta e retorna os caminhos completos
 * de todos os arquivos encontrados (ignora subpastas chamadas "tests/").
 */
function coletarArquivos(pasta: string): string[] {
  // Retorna vazio se a pasta ainda não foi criada no projeto
  if (!fs.existsSync(pasta)) return [];

  const arquivos: string[] = [];

  function varrer(pastaAtual: string) {
    for (const entrada of fs.readdirSync(pastaAtual, { withFileTypes: true })) {
      const caminhoCompleto = path.join(pastaAtual, entrada.name);

      if (entrada.isDirectory()) {
        if (entrada.name === 'tests') continue;
        varrer(caminhoCompleto);
      } else {
        arquivos.push(caminhoCompleto);
      }
    }
  }

  varrer(pasta);
  return arquivos;
}

/**
 * Retorna true para arquivos que devem ser ignorados pelas regras de nomeação:
 *   - index.ts e index.tsx  (ponto de entrada padrão de pastas)
 *   - *.test.ts e *.test.tsx
 *   - *.spec.ts e *.spec.tsx
 */
function deveIgnorar(nomeArquivo: string): boolean {
  if (nomeArquivo === 'index.ts' || nomeArquivo === 'index.tsx') return true;
  if (/\.(test|spec)\.(ts|tsx)$/.test(nomeArquivo)) return true;
  return false;
}

/**
 * Coleta os nomes dos arquivos que violam a regex informada dentro de uma pasta.
 * Arquivos ignorados (index, test, spec) não entram na validação.
 */
function encontrarViolacoes(pasta: string, regex: RegExp): string[] {
  return coletarArquivos(pasta)
    .map((caminho) => path.basename(caminho))   // só o nome do arquivo
    .filter((nome) => !deveIgnorar(nome))        // ignora index/test/spec
    .filter((nome) => !regex.test(nome));        // falhou na convenção → violação
}

// ---------------------------------------------------------------------------
// src/components/ — PascalCase + extensão .tsx
// Exemplos válidos:   ProductCard.tsx, SearchBar.tsx, CartButton.tsx
// Exemplos inválidos: productCard.tsx, product-card.tsx, ProductCard.ts
// ---------------------------------------------------------------------------
describe('Convenção de nomeação — src/components/', () => {
  test('todos os arquivos devem estar em PascalCase com extensão .tsx', () => {
    const REGEX_PASCAL_TSX = /^[A-Z][a-zA-Z0-9]*\.tsx$/;

    const violacoes = encontrarViolacoes(
      path.join(PASTA_SRC, 'components'),
      REGEX_PASCAL_TSX
    );

    expect(
      violacoes,
      `Arquivos em src/components/ que violam a regra PascalCase.tsx:\n  ${violacoes.join('\n  ')}`
    ).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// src/pages/ — PascalCase terminando obrigatoriamente com "Page.tsx"
// Exemplos válidos:   HomePage.tsx, CheckoutPage.tsx, ProductDetailPage.tsx
// Exemplos inválidos: Home.tsx, homePage.tsx, CheckoutPage.ts
// ---------------------------------------------------------------------------
describe('Convenção de nomeação — src/pages/', () => {
  test('todos os arquivos devem seguir o padrão <Nome>Page.tsx', () => {
    const REGEX_PAGE_TSX = /^[A-Z][a-zA-Z0-9]*Page\.tsx$/;

    const violacoes = encontrarViolacoes(
      path.join(PASTA_SRC, 'pages'),
      REGEX_PAGE_TSX
    );

    expect(
      violacoes,
      `Arquivos em src/pages/ que violam a regra <Nome>Page.tsx:\n  ${violacoes.join('\n  ')}`
    ).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// src/services/ — camelCase terminando obrigatoriamente com "Service.ts"
// Exemplos válidos:   productService.ts, cepService.ts, exchangeRateService.ts
// Exemplos inválidos: ProductService.ts, cep-service.ts, cepService.tsx
// ---------------------------------------------------------------------------
describe('Convenção de nomeação — src/services/', () => {
  test('todos os arquivos devem seguir o padrão <nome>Service.ts', () => {
    const REGEX_SERVICE_TS = /^[a-z][a-zA-Z0-9]*Service\.ts$/;

    const violacoes = encontrarViolacoes(
      path.join(PASTA_SRC, 'services'),
      REGEX_SERVICE_TS
    );

    expect(
      violacoes,
      `Arquivos em src/services/ que violam a regra <nome>Service.ts:\n  ${violacoes.join('\n  ')}`
    ).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// src/hooks/ — deve começar com "use" seguido de PascalCase, extensão .ts ou .tsx
// Exemplos válidos:   useCart.ts, useProducts.tsx, useLocalStorage.ts
// Exemplos inválidos: cartHook.ts, UseCart.ts, use-cart.ts, useCart.js
// ---------------------------------------------------------------------------
describe('Convenção de nomeação — src/hooks/', () => {
  test('todos os arquivos devem seguir o padrão use<Nome>.ts ou use<Nome>.tsx', () => {
    const REGEX_HOOK = /^use[A-Z][a-zA-Z0-9]*\.tsx?$/;

    const violacoes = encontrarViolacoes(
      path.join(PASTA_SRC, 'hooks'),
      REGEX_HOOK
    );

    expect(
      violacoes,
      `Arquivos em src/hooks/ que violam a regra use<Nome>.ts(x):\n  ${violacoes.join('\n  ')}`
    ).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// src/utils/ — camelCase com extensão .ts
// Exemplos válidos:   formatCurrency.ts, pixGenerator.ts, dateHelpers.ts
// Exemplos inválidos: FormatCurrency.ts, format-currency.ts, formatCurrency.tsx
// ---------------------------------------------------------------------------
describe('Convenção de nomeação — src/utils/', () => {
  test('todos os arquivos devem estar em camelCase com extensão .ts', () => {
    const REGEX_CAMEL_TS = /^[a-z][a-zA-Z0-9]*\.ts$/;

    const violacoes = encontrarViolacoes(
      path.join(PASTA_SRC, 'utils'),
      REGEX_CAMEL_TS
    );

    expect(
      violacoes,
      `Arquivos em src/utils/ que violam a regra camelCase.ts:\n  ${violacoes.join('\n  ')}`
    ).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// src/types/ — camelCase terminando obrigatoriamente com ".types.ts"
// Exemplos válidos:   product.types.ts, cart.types.ts, exchangeRate.types.ts
// Exemplos inválidos: Product.types.ts, product-types.ts, productTypes.ts
// ---------------------------------------------------------------------------
describe('Convenção de nomeação — src/types/', () => {
  test('todos os arquivos devem seguir o padrão <nome>.types.ts', () => {
    const REGEX_TYPES_TS = /^[a-z][a-zA-Z0-9]*\.types\.ts$/;

    const violacoes = encontrarViolacoes(
      path.join(PASTA_SRC, 'types'),
      REGEX_TYPES_TS
    );

    expect(
      violacoes,
      `Arquivos em src/types/ que violam a regra <nome>.types.ts:\n  ${violacoes.join('\n  ')}`
    ).toHaveLength(0);
  });
});