import { describe, test, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import ts from 'typescript';

const PASTA_SRC = path.resolve(__dirname, '../../');

function coletarArquivosTsx(pasta: string): string[] {
  if (!fs.existsSync(pasta)) return [];

  const arquivos: string[] = [];

  function varrer(pastaAtual: string) {
    for (const entrada of fs.readdirSync(pastaAtual, { withFileTypes: true })) {
      const caminhoCompleto = path.join(pastaAtual, entrada.name);

      if (entrada.isDirectory()) {
        varrer(caminhoCompleto);
      } else if (entrada.name.endsWith('.tsx')) {
        arquivos.push(caminhoCompleto);
      }
    }
  }

  varrer(pasta);
  return arquivos;
}

function contemTextoHumano(valor: string): boolean {
  const normalizado = valor.replace(/\s+/g, ' ').trim();
  if (!normalizado) return false;

  if (/^[./#:_-]+$/.test(normalizado)) return false;

  return /[A-Za-z0-9]/.test(normalizado);
}

type Violacao = {
  arquivo: string;
  linha: number;
  texto: string;
  tipo: 'jsx-text' | 'jsx-attribute' | 'jsx-expression-string';
};

function encontrarTextosFixosEmPagina(caminhoArquivo: string): Violacao[] {
  const conteudo = fs.readFileSync(caminhoArquivo, 'utf-8');
  const sourceFile = ts.createSourceFile(
    caminhoArquivo,
    conteudo,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  );

  const violacoes: Violacao[] = [];

  const atributosTextuais = new Set(['title', 'placeholder', 'alt', 'aria-label', 'label']);

  function adicionarViolacao(node: ts.Node, texto: string, tipo: Violacao['tipo']) {
    const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));

    violacoes.push({
      arquivo: path.relative(PASTA_SRC, caminhoArquivo),
      linha: line + 1,
      texto: texto.replace(/\s+/g, ' ').trim(),
      tipo,
    });
  }

  function visitar(node: ts.Node) {
    if (ts.isJsxText(node)) {
      const texto = node.getText(sourceFile);
      if (contemTextoHumano(texto)) {
        adicionarViolacao(node, texto, 'jsx-text');
      }
    }

    if (ts.isJsxExpression(node) && node.expression) {
      if (
        ts.isStringLiteral(node.expression) ||
        ts.isNoSubstitutionTemplateLiteral(node.expression)
      ) {
        const texto = node.expression.text;
        if (contemTextoHumano(texto)) {
          adicionarViolacao(node.expression, texto, 'jsx-expression-string');
        }
      }
    }

    if (ts.isJsxAttribute(node)) {
      const nomeAtributo = node.name.getText();

      if (atributosTextuais.has(nomeAtributo) && node.initializer) {
        if (ts.isStringLiteral(node.initializer)) {
          const texto = node.initializer.text;
          if (contemTextoHumano(texto)) {
            adicionarViolacao(node.initializer, texto, 'jsx-attribute');
          }
        }

        if (ts.isJsxExpression(node.initializer) && node.initializer.expression) {
          if (
            ts.isStringLiteral(node.initializer.expression) ||
            ts.isNoSubstitutionTemplateLiteral(node.initializer.expression)
          ) {
            const texto = node.initializer.expression.text;
            if (contemTextoHumano(texto)) {
              adicionarViolacao(node.initializer.expression, texto, 'jsx-attribute');
            }
          }
        }
      }
    }

    ts.forEachChild(node, visitar);
  }

  visitar(sourceFile);

  return violacoes;
}

describe('i18n - src sem texto fixo', () => {
  test('arquivos em src nao devem conter textos hardcoded no JSX', () => {
    const arquivos = coletarArquivosTsx(PASTA_SRC);

    const violacoes = arquivos.flatMap((arquivo) =>
      encontrarTextosFixosEmPagina(arquivo)
    );

    expect(
      violacoes,
      `Textos fixos encontrados em src:\n${violacoes
        .map((v) => `  ${v.arquivo}:${v.linha} [${v.tipo}] -> "${v.texto}"`)
        .join('\n')}`
    ).toHaveLength(0);
  });
});
