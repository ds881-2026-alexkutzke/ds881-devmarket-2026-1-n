const BASE_URL = 'https://dummyjson.com';

export async function httpGet(path: string) {
  try {
    const response = await fetch(`${BASE_URL}${path}`);

    if (!response.ok) {
      throw new Error(
        `Erro HTTP: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Erro na requisição HTTP:', error);
    throw error;
  }
}