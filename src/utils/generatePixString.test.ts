import { describe, expect, test } from 'vitest';
import { generatePixString } from './generatePixString';

describe('generatePixString', () => {
  test('gera uma string decorativa com identificador do projeto, valor e id do pedido', () => {
    expect(generatePixString(149.9, 'ORDER-123')).toBe('DEVMARKET|149.9|ORDER-123');
  });
});
