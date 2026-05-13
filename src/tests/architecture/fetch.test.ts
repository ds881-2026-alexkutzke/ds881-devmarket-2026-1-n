import { describe, expect, test } from 'vitest';
import fs from 'fs';
import path from 'path';

const sourceRoot = path.resolve(__dirname, '../../');
const scannedFolders = ['components', 'pages'];
const forbiddenApiCall = /\b(fetch\s*\(|axios\.|XMLHttpRequest\b)/;

function collectSourceFiles(folder: string): string[] {
  if (!fs.existsSync(folder)) return [];

  const files: string[] = [];

  function scan(currentFolder: string) {
    for (const entry of fs.readdirSync(currentFolder, { withFileTypes: true })) {
      const fullPath = path.join(currentFolder, entry.name);

      if (entry.isDirectory()) {
        scan(fullPath);
        continue;
      }

      if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
        files.push(fullPath);
      }
    }
  }

  scan(folder);

  return files;
}

function findDirectApiCalls(): string[] {
  return scannedFolders.flatMap((folder) => {
    const absoluteFolder = path.join(sourceRoot, folder);

    return collectSourceFiles(absoluteFolder).flatMap((file) => {
      const lines = fs.readFileSync(file, 'utf-8').split('\n');
      const relativeFile = path.relative(sourceRoot, file);

      return lines
        .map((line, index) => ({
          line,
          message: `${relativeFile}:${index + 1} contem chamada direta a API. Mova para src/services/ e importe de la.`,
        }))
        .filter(({ line }) => forbiddenApiCall.test(line))
        .map(({ message }) => message);
    });
  });
}

describe('Arquitetura - chamadas a API centralizadas em services', () => {
  test('components e pages nao devem chamar APIs diretamente', () => {
    const violations = findDirectApiCalls();

    expect(
      violations,
      `Chamadas diretas a API encontradas:\n  ${violations.join('\n  ')}`
    ).toHaveLength(0);
  });
});
