import { describe, test, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

// Sobe dois níveis a partir de src/tests/architecture/ para chegar em src/
const PASTA_SRC = path.resolve(__dirname, '../../');

/**
 * Varre recursivamente uma pasta e retorna todos os arquivos encontrados,
 * ignorando diretórios chamados "tests".
 */
function coletarArquivos(
  pasta: string,
  extensoes?: string[]
): string[] {
  if (!fs.existsSync(pasta)) return [];

  const arquivos: string[] = [];

  function varrer(pastaAtual: string) {
    for (const entrada of fs.readdirSync(pastaAtual, { withFileTypes: true })) {
      const caminhoCompleto = path.join(pastaAtual, entrada.name);

      if (entrada.isDirectory()) {
        if (entrada.name === 'tests') continue;
        varrer(caminhoCompleto);
      } else {
        if (
          !extensoes ||
          extensoes.some((ext) => entrada.name.endsWith(ext))
        ) {
          arquivos.push(caminhoCompleto);
        }
      }
    }
  }

  varrer(pasta);

  return arquivos;
}

/**
 * Retorna conteúdo do arquivo.
 */
function lerArquivo(caminho: string): string {
  return fs.readFileSync(caminho, 'utf-8');
}

/**
 * Retorna violações encontradas com arquivo + linha.
 */
function encontrarOcorrencias(
  arquivos: string[],
  regex: RegExp
): string[] {
  const violacoes: string[] = [];

  for (const arquivo of arquivos) {
    const conteudo = lerArquivo(arquivo);
    const linhas = conteudo.split('\n');

    linhas.forEach((linha, index) => {
      if (regex.test(linha)) {
        violacoes.push(
          `${path.relative(PASTA_SRC, arquivo)}:${index + 1}`
        );
      }
    });
  }

  return violacoes;
}

// ---------------------------------------------------------------------------
// REGRA 1 — Sem console.log/warn/error/debug
// ---------------------------------------------------------------------------
describe('Qualidade — Sem console.*', () => {
  test('nenhum arquivo deve conter console.log/warn/error/debug', () => {
    const arquivos = coletarArquivos(PASTA_SRC, ['.ts', '.tsx']);

    const REGEX_CONSOLE =
      /console\.(log|warn|error|debug)\(/;

    const violacoes = encontrarOcorrencias(
      arquivos,
      REGEX_CONSOLE
    );

    expect(
      violacoes,
      `Uso de console encontrado:\n  ${violacoes.join('\n  ')}`
    ).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// REGRA 2 — Sem CSS inline
// ---------------------------------------------------------------------------
describe('Qualidade — Sem inline style', () => {
  test('nenhum arquivo .tsx deve conter style={', () => {
    const arquivos = coletarArquivos(PASTA_SRC, ['.tsx']);

    const REGEX_INLINE_STYLE = /style=\{/;

    const violacoes = encontrarOcorrencias(
      arquivos,
      REGEX_INLINE_STYLE
    );

    expect(
      violacoes,
      `Inline styles encontrados:\n  ${violacoes.join('\n  ')}`
    ).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// REGRA 3 — Components devem usar export default
// ---------------------------------------------------------------------------
describe('Qualidade — Default export em components', () => {
  test('todo componente .tsx deve conter export default', () => {
    const pastaComponents = path.join(PASTA_SRC, 'components');

    const arquivos = coletarArquivos(
      pastaComponents,
      ['.tsx']
    );

    const violacoes: string[] = [];

    for (const arquivo of arquivos) {
      const conteudo = lerArquivo(arquivo);

      if (!/export default/.test(conteudo)) {
        violacoes.push(
          `${path.relative(PASTA_SRC, arquivo)}`
        );
      }
    }

    expect(
      violacoes,
      `Componentes sem export default:\n  ${violacoes.join('\n  ')}`
    ).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// REGRA 4 — Services devem usar named exports
// ---------------------------------------------------------------------------
describe('Qualidade — Named exports em services', () => {
  test('services devem usar export function/export const e nunca export default', () => {
    const pastaServices = path.join(PASTA_SRC, 'services');

    const arquivos = coletarArquivos(
      pastaServices,
      ['.ts']
    );

    const violacoes: string[] = [];

    for (const arquivo of arquivos) {
      const conteudo = lerArquivo(arquivo);

      const possuiNamedExport =
        /export\s+(async\s+)?function/.test(conteudo) ||
        /export\s+const/.test(conteudo);

      const possuiDefaultExport =
        /export\s+default/.test(conteudo);

      if (!possuiNamedExport || possuiDefaultExport) {
        violacoes.push(
          `${path.relative(PASTA_SRC, arquivo)}`
        );
      }
    }

    expect(
      violacoes,
      `Services inválidos:\n  ${violacoes.join('\n  ')}`
    ).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// REGRA 5 — Sem dependências circulares
// ---------------------------------------------------------------------------
describe('Qualidade — Sem dependências circulares', () => {
  test('não deve existir ciclo de dependências', () => {
    const arquivos = coletarArquivos(
      PASTA_SRC,
      ['.ts', '.tsx']
    );

    const grafo = new Map<string, string[]>();

    /**
     * Resolve import relativo para caminho absoluto.
     */
    function resolverImport(
      arquivoOrigem: string,
      importPath: string
    ): string | null {
      if (!importPath.startsWith('.')) {
        return null;
      }

      const base = path.resolve(
        path.dirname(arquivoOrigem),
        importPath
      );

      const possibilidades = [
        `${base}.ts`,
        `${base}.tsx`,
        path.join(base, 'index.ts'),
        path.join(base, 'index.tsx'),
      ];

      for (const possibilidade of possibilidades) {
        if (fs.existsSync(possibilidade)) {
          return possibilidade;
        }
      }

      return null;
    }

    /**
     * Monta grafo de dependências.
     */
    for (const arquivo of arquivos) {
      const conteudo = lerArquivo(arquivo);

      const imports = [
        ...conteudo.matchAll(
          /from\s+['"](.+?)['"]/g
        ),
      ];

      const dependencias: string[] = [];

      for (const match of imports) {
        const importPath = match[1];

        const resolvido = resolverImport(
          arquivo,
          importPath
        );

        if (resolvido) {
          dependencias.push(resolvido);
        }
      }

      grafo.set(arquivo, dependencias);
    }

    const visitados = new Set<string>();
    const pilha = new Set<string>();

    const ciclos: string[] = [];

    function dfs(no: string, caminho: string[]) {
      if (pilha.has(no)) {
        const inicio = caminho.indexOf(no);

        ciclos.push(
          caminho.slice(inicio).concat(no)
            .map((arquivo) =>
              path.relative(PASTA_SRC, arquivo)
            )
            .join(' -> ')
        );

        return;
      }

      if (visitados.has(no)) return;

      visitados.add(no);
      pilha.add(no);

      for (const vizinho of grafo.get(no) || []) {
        dfs(vizinho, [...caminho, vizinho]);
      }

      pilha.delete(no);
    }

    for (const arquivo of grafo.keys()) {
      dfs(arquivo, [arquivo]);
    }

    expect(
      ciclos,
      `Dependências circulares encontradas:\n  ${ciclos.join('\n  ')}`
    ).toHaveLength(0);
  });
});