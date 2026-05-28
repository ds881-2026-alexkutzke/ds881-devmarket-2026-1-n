import { describe, expect, test } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

type Violation = {
  filePath: string;
  lineNumber: number;
  importPath: string;
  lineText: string;
};

const currentFileDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(currentFileDir, "../../..");
const sourceRoot = path.resolve(projectRoot, "src");

function collectSourceFiles(directoryPath: string): string[] {
  const entries = fs.readdirSync(directoryPath, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      if (entry.name !== "tests") {
        files.push(...collectSourceFiles(fullPath));
      }
      continue;
    }

    if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

function getLineNumber(content: string, index: number): number {
  return content.slice(0, index).split(/\r?\n/).length;
}

function findViolations(filePath: string): Violation[] {
  const content = fs.readFileSync(filePath, "utf8");
  const violations: Violation[] = [];
  const importRegex = /^\s*import[\s\S]*?from\s+['"]([^'"]+)['"]/gm;

  for (const match of content.matchAll(importRegex)) {
    const importPath = match[1];
    const matchIndex = match.index ?? 0;

    if (importPath.includes("../")) {
      const lineNumber = getLineNumber(content, matchIndex);
      const lineText = content.split(/\r?\n/)[lineNumber - 1] ?? "";

      violations.push({
        filePath: path.relative(projectRoot, filePath),
        lineNumber,
        importPath,
        lineText,
      });
    }
  }

  return violations;
}

describe("Testes de Arquitetura: padronização de imports", () => {
  test("Nenhum arquivo em src/ deve importar usando caminhos relativos que sobem diretórios", () => {
    const sourceFiles = collectSourceFiles(sourceRoot);
    const violations = sourceFiles.flatMap((filePath) =>
      findViolations(filePath),
    );
    const failureMessage = violations.length
      ? [
          "Substitua o import relativo pelo alias @/.",
          ...violations.map(
            ({ filePath, lineNumber, importPath, lineText }) =>
              `${filePath}:${lineNumber} -> ${importPath} | ${lineText.trim()}`,
          ),
        ].join("\n")
      : undefined;

    expect(violations.length, failureMessage).toBe(0);
  });
});
