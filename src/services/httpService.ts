const BASE_URL = 'https://dummyjson.com';

export class HttpError extends Error {
  readonly status: number;

  constructor(status: number) {
    super(`HTTP_ERROR_${status}`);
    this.name = 'HttpError';
    this.status = status;
  }
}

export async function httpGet<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`);

  if (!response.ok) {
    throw new HttpError(response.status);
  }

  return response.json() as Promise<T>;
}
