import { httpGet } from './httpService';

export async function apiFetch<T>(path: string): Promise<T> {
  return httpGet<T>(path);
}
