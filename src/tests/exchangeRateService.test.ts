import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

async function importService() {
  return import('../services/exchangeRateService');
}

describe('fetchUsdToBrlRate', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('VITE_API_KEY', 'test-api-key');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('busca a cotacao USD para BRL usando a chave da env VITE_API_KEY', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        result: 'success',
        base_code: 'USD',
        conversion_rates: {
          BRL: 5.42,
        },
      }),
    });

    vi.stubGlobal('fetch', fetchMock);

    const { fetchUsdToBrlRate } = await importService();

    await expect(fetchUsdToBrlRate()).resolves.toBe(5.42);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://v6.exchangerate-api.com/v6/test-api-key/latest/USD'
    );
  });

  it('usa cache em modulo apos buscar a cotacao com sucesso', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        result: 'success',
        base_code: 'USD',
        conversion_rates: {
          BRL: 5.42,
        },
      }),
    });

    vi.stubGlobal('fetch', fetchMock);

    const { fetchUsdToBrlRate } = await importService();

    await expect(fetchUsdToBrlRate()).resolves.toBe(5.42);
    await expect(fetchUsdToBrlRate()).resolves.toBe(5.42);

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('lanca erro quando a API retorna status HTTP de erro', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    }));

    const { fetchUsdToBrlRate } = await importService();

    await expect(fetchUsdToBrlRate()).rejects.toThrow('errors.exchangeRateUnavailable');
  });

  it('lanca erro quando a resposta nao contem a cotacao BRL', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        result: 'success',
        base_code: 'USD',
        conversion_rates: {},
      }),
    }));

    const { fetchUsdToBrlRate } = await importService();

    await expect(fetchUsdToBrlRate()).rejects.toThrow('errors.exchangeRateUnavailable');
  });
});
