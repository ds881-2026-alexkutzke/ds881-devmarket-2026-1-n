import type {
  ExchangeRateResponse,
  UsdToBrlRate,
} from '../types/exchangeRate.types.ts';

const EXCHANGE_RATE_BASE_URL = 'https://v6.exchangerate-api.com/v6';

let cachedUsdToBrlRate: UsdToBrlRate | null = null;

export async function fetchUsdToBrlRate(): Promise<UsdToBrlRate> {
  if (cachedUsdToBrlRate !== null) {
    return cachedUsdToBrlRate;
  }

  const apiKey = import.meta.env.VITE_API_KEY;

  if (!apiKey) {
    throw new Error('errors.exchangeRateUnavailable');
  }

  const response = await fetch(`${EXCHANGE_RATE_BASE_URL}/${apiKey}/latest/USD`);

  if (!response.ok) {
    throw new Error('errors.exchangeRateUnavailable');
  }

  const data = (await response.json()) as ExchangeRateResponse;
  const usdToBrlRate = data.conversion_rates.BRL;

  if (data.result !== 'success' || typeof usdToBrlRate !== 'number') {
    throw new Error('errors.exchangeRateUnavailable');
  }

  cachedUsdToBrlRate = usdToBrlRate;

  return usdToBrlRate;
}
