const BASE_URL = 'https://dummyjson.com';

export async function httpGet(path: string) {
  const response = await fetch(`${BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error(
      `Erro HTTP: ${response.status}`
    );
  }

  return response.json();
}