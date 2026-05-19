import { describe, it, expect } from 'vitest';
import { maskCep } from '../../utils/maskCep';

describe('maskCep', () => {
  it('deve retornar uma string vazia se receber uma string vazia', () => {
    expect(maskCep('')).toBe('');
  });

  it('deve descartar letras e caracteres não numéricos', () => {
    expect(maskCep('A1B2C3D4E5')).toBe('12345');
    expect(maskCep('80000-abc111')).toBe('80000-111');
  });

  it('deve aplicar a máscara corretamente no formato XXXXX-XXX', () => {
    expect(maskCep('80020310')).toBe('80020-310');
  });

  it('deve cortar o excesso de caracteres (mais de 8 dígitos)', () => {
    expect(maskCep('12345678900')).toBe('12345-678');
  });
});