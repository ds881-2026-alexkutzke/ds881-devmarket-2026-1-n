import { describe, test, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

// Sobe dois níveis a partir de src/tests/architecture/
const PASTA_SRC = path.resolve(__dirname, '../../');

type Violacao = {
  arquivo: string;
  importado: string;
  regra: string;
};

/**
 * Varre recursivamente uma pasta e retorna todos os arquivos .ts/.tsx
 * ignorando diretórios chamados "tests".
 */
function coletarArquivos(pasta: string): string[] {
  if (!fs.existsSync(pasta)) return [];

  const arquivos: string[] = [];

  function varrer(pastaAtual: string) {
    for (const entrada of fs.readdirSync(pastaAtual, { withFileTypes: true })) {
      const caminhoCompleto = path.join(pastaAtual, entrada.name);

      if (entrada.isDirectory()) {
        if (entrada.name === 'tests') continue;
        varrer(caminhoCompleto);
      } else if (
        entrada.name.endsWith('.ts') ||
        entrada.name.endsWith('.tsx')
      ) {
        arquivos.push(caminhoCompleto);
      }
    }
  }

  varrer(pasta);

  return arquivos;
}

/**
 * Retorna a camada baseada no caminho do arquivo.
 */
function identificarCamada(caminho: string): string | null {
  const normalizado = caminho.replace(/\\/g, '/');

  if (normalizado.includes('/pages/')) return 'pages';
  if (normalizado.includes('/components/')) return 'components';
  if (normalizado.includes('/services/')) return 'services';
  if (normalizado.includes('/hooks/')) return 'hooks';
  if (normalizado.includes('/utils/')) return 'utils';
  if (normalizado.includes('/types/')) return 'types';

  return null;
}

/**
 * Resolve imports relativos e aliases @/
 */
function resolverImport(
  arquivoOrigem: string,
  importPath: string
): string | null {
  // Alias @/
  if (importPath.startsWith('@/')) {
    return path.resolve(
      PASTA_SRC,
      importPath.replace('@/', '')
    );
  }

  // Relativo
  if (importPath.startsWith('.')) {
    return path.resolve(
      path.dirname(arquivoOrigem),
      importPath
    );
  }

  // Biblioteca externa
  return null;
}

/**
 * Extrai imports de um arquivo.
 */
function extrairImports(conteudo: string): string[] {
  const matches = [
    ...conteudo.matchAll(
      /from\s+['"](.+?)['"]/g
    ),
  ];

  return matches.map(match => match[1]);
}

/**
 * Busca violações de importação.
 */
function encontrarViolacoes(
  camadaOrigem: string,
  camadasProibidas: string[]
): Violacao[] {
  const arquivos = coletarArquivos(PASTA_SRC);

  const violacoes: Violacao[] = [];

  for (const arquivo of arquivos) {
    const camadaArquivo = identificarCamada(arquivo);

    if (camadaArquivo !== camadaOrigem) continue;

    const conteudo = fs.readFileSync(arquivo, 'utf-8');

    const imports = extrairImports(conteudo);

    for (const importPath of imports) {
      const resolvido = resolverImport(
        arquivo,
        importPath
      );

      if (!resolvido) continue;

      const camadaImportada =
        identificarCamada(resolvido);

      if (
        camadaImportada &&
        camadasProibidas.includes(camadaImportada)
      ) {
        violacoes.push({
          arquivo: path.relative(PASTA_SRC, arquivo),
          importado: importPath,
          regra: `${camadaOrigem} não pode importar de ${camadaImportada}`,
        });
      }
    }
  }

  return violacoes;
}

// ---------------------------------------------------------------------------
// pages
// ---------------------------------------------------------------------------
describe('Regras de importação — pages', () => {
  test('pages não pode importar de pages', () => {
    const violacoes = encontrarViolacoes(
      'pages',
      ['pages']
    );

    expect(
      violacoes,
      `Violacoes encontradas:\n${violacoes
        .map(
          v =>
            `  ${v.arquivo} -> ${v.importado} (${v.regra})`
        )
        .join('\n')}`
    ).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// components
// ---------------------------------------------------------------------------
describe('Regras de importação — components', () => {
  test('components não pode importar de pages', () => {
    const violacoes = encontrarViolacoes(
      'components',
      ['pages']
    );

    expect(
      violacoes,
      `Violacoes encontradas:\n${violacoes
        .map(
          v =>
            `  ${v.arquivo} -> ${v.importado} (${v.regra})`
        )
        .join('\n')}`
    ).toHaveLength(0);
  });

  test('components não pode importar de services', () => {
    const violacoes = encontrarViolacoes(
      'components',
      ['services']
    );

    expect(
      violacoes,
      `Violacoes encontradas:\n${violacoes
        .map(
          v =>
            `  ${v.arquivo} -> ${v.importado} (${v.regra})`
        )
        .join('\n')}`
    ).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// services
// ---------------------------------------------------------------------------
describe('Regras de importação — services', () => {
  test('services não pode importar de components', () => {
    const violacoes = encontrarViolacoes(
      'services',
      ['components']
    );

    expect(
      violacoes,
      `Violacoes encontradas:\n${violacoes
        .map(
          v =>
            `  ${v.arquivo} -> ${v.importado} (${v.regra})`
        )
        .join('\n')}`
    ).toHaveLength(0);
  });

  test('services não pode importar de pages', () => {
    const violacoes = encontrarViolacoes(
      'services',
      ['pages']
    );

    expect(
      violacoes,
      `Violacoes encontradas:\n${violacoes
        .map(
          v =>
            `  ${v.arquivo} -> ${v.importado} (${v.regra})`
        )
        .join('\n')}`
    ).toHaveLength(0);
  });

  test('services não pode importar de hooks', () => {
    const violacoes = encontrarViolacoes(
      'services',
      ['hooks']
    );

    expect(
      violacoes,
      `Violacoes encontradas:\n${violacoes
        .map(
          v =>
            `  ${v.arquivo} -> ${v.importado} (${v.regra})`
        )
        .join('\n')}`
    ).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// hooks
// ---------------------------------------------------------------------------
describe('Regras de importação — hooks', () => {
  test('hooks não pode importar de components', () => {
    const violacoes = encontrarViolacoes(
      'hooks',
      ['components']
    );

    expect(
      violacoes,
      `Violacoes encontradas:\n${violacoes
        .map(
          v =>
            `  ${v.arquivo} -> ${v.importado} (${v.regra})`
        )
        .join('\n')}`
    ).toHaveLength(0);
  });

  test('hooks não pode importar de pages', () => {
    const violacoes = encontrarViolacoes(
      'hooks',
      ['pages']
    );

    expect(
      violacoes,
      `Violacoes encontradas:\n${violacoes
        .map(
          v =>
            `  ${v.arquivo} -> ${v.importado} (${v.regra})`
        )
        .join('\n')}`
    ).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// utils
// ---------------------------------------------------------------------------
describe('Regras de importação — utils', () => {
  test('utils não pode importar de components', () => {
    const violacoes = encontrarViolacoes(
      'utils',
      ['components']
    );

    expect(
      violacoes,
      `Violacoes encontradas:\n${violacoes
        .map(
          v =>
            `  ${v.arquivo} -> ${v.importado} (${v.regra})`
        )
        .join('\n')}`
    ).toHaveLength(0);
  });

  test('utils não pode importar de pages', () => {
    const violacoes = encontrarViolacoes(
      'utils',
      ['pages']
    );

    expect(
      violacoes,
      `Violacoes encontradas:\n${violacoes
        .map(
          v =>
            `  ${v.arquivo} -> ${v.importado} (${v.regra})`
        )
        .join('\n')}`
    ).toHaveLength(0);
  });

  test('utils não pode importar de hooks', () => {
    const violacoes = encontrarViolacoes(
      'utils',
      ['hooks']
    );

    expect(
      violacoes,
      `Violacoes encontradas:\n${violacoes
        .map(
          v =>
            `  ${v.arquivo} -> ${v.importado} (${v.regra})`
        )
        .join('\n')}`
    ).toHaveLength(0);
  });

  test('utils não pode importar de services', () => {
    const violacoes = encontrarViolacoes(
      'utils',
      ['services']
    );

    expect(
      violacoes,
      `Violacoes encontradas:\n${violacoes
        .map(
          v =>
            `  ${v.arquivo} -> ${v.importado} (${v.regra})`
        )
        .join('\n')}`
    ).toHaveLength(0);
  });
});