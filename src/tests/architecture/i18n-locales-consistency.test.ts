import { describe, test, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const PASTA_SRC = path.resolve(__dirname, '../../');
const CAMINHO_PT_BR = path.join(PASTA_SRC, 'i18n', 'locales', 'pt-BR.json');
const CAMINHO_EN = path.join(PASTA_SRC, 'i18n', 'locales', 'en.json');

function lerJson(caminho: string): unknown {
  return JSON.parse(fs.readFileSync(caminho, 'utf-8'));
}

function coletarChaves(obj: unknown, prefixo = ''): string[] {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return prefixo ? [prefixo] : [];
  }

  const saida: string[] = [];

  for (const [chave, valor] of Object.entries(obj)) {
    const caminhoAtual = prefixo ? `${prefixo}.${chave}` : chave;

    if (valor && typeof valor === 'object' && !Array.isArray(valor)) {
      saida.push(...coletarChaves(valor, caminhoAtual));
    } else {
      saida.push(caminhoAtual);
    }
  }

  return saida;
}

describe('i18n - consistencia entre pt-BR e en', () => {
  test('en.json deve conter todas as chaves existentes em pt-BR.json', () => {
    const ptBr = lerJson(CAMINHO_PT_BR);
    const en = lerJson(CAMINHO_EN);

    const chavesPtBr = new Set(coletarChaves(ptBr));
    const chavesEn = new Set(coletarChaves(en));

    const faltandoNoEn = [...chavesPtBr].filter((chave) => !chavesEn.has(chave));

    expect(
      faltandoNoEn,
      `Chaves presentes em pt-BR e ausentes em en:\n  ${faltandoNoEn.join('\n  ')}`
    ).toHaveLength(0);
  });
});
