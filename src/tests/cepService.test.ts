import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchAddressByCep } from '../services/cepService';

describe('fetchAddressByCep', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('normaliza o CEP antes de chamar o ViaCEP', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        cep: '80020-310',
        logradouro: 'Rua Exemplo',
        complemento: '',
        bairro: 'Centro',
        localidade: 'Curitiba',
        uf: 'PR',
        ibge: '4106902',
        gia: '',
        ddd: '41',
        siafi: '7535',
        unidade: '',
      }),
    });

    vi.stubGlobal('fetch', fetchMock);

    await fetchAddressByCep('80020-310');

    expect(fetchMock).toHaveBeenCalledWith('https://viacep.com.br/ws/80020310/json/');
  });

  it('lança erro quando a API retorna status HTTP de erro', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    }));

    await expect(fetchAddressByCep('12345-678')).rejects.toThrow('errors.cepNotFound');
  });

  it('lança erro quando o ViaCEP retorna erro=true', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        erro: true,
      }),
    }));

    await expect(fetchAddressByCep('00000-000')).rejects.toThrow('errors.cepNotFound');
  });
});