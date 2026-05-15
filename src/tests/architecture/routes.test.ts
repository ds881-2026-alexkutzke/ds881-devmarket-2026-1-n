import { describe, test, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

// Caminho base para a pasta src
const PASTA_SRC = path.resolve(__dirname, '../../');
const CAMINHO_APP_TSX = path.join(PASTA_SRC, 'App.tsx');

describe('Arquitetura — Roteamento', () => {
    test('App.tsx não deve importar arquivos da pasta pages diretamente', () => {
        // Verifica se o App.tsx existe (previne erros caso o arquivo seja renomeado futuramente)
        expect(
        fs.existsSync(CAMINHO_APP_TSX),
            'Arquivo App.tsx não encontrado na raiz do src. O teste de arquitetura não pode prosseguir.'
        ).toBe(true);

        // Lê o conteúdo do App.tsx
        const conteudo = fs.readFileSync(CAMINHO_APP_TSX, 'utf-8');

        // Extrai todos os caminhos de importação do arquivo
        // Exemplo: import HomePage from './pages/HomePage' -> captura './pages/HomePage'
        const imports = [...conteudo.matchAll(/from\s+['"](.+?)['"]/g)].map(
            (match) => match[1]
        );

        // Filtra os imports que contêm '/pages/' ou terminam em 'pages'
        const importacoesInvalidas = imports.filter((caminhoImport) =>
            caminhoImport.includes('/pages/') || caminhoImport.includes('pages/')
        );

        // Valida se a lista de importações inválidas está vazia
        expect(
            importacoesInvalidas,
            `App.tsx nao deve importar paginas diretamente. Use o arquivo routes.ts para registrar novas rotas.\n\nViolações encontradas no App.tsx:\n${importacoesInvalidas
                .map((imp) => `  - ${imp}`)
                .join('\n')}`
        ).toHaveLength(0);
    });
});