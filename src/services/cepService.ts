import type { ViaCepAddress } from "@/types/cep.types.ts";

const VIA_CEP_BASE_URL = "https://viacep.com.br/ws";

function normalizeCep(cep: string): string {
  return cep.replace(/\D/g, "");
}

export async function fetchAddressByCep(cep: string): Promise<ViaCepAddress> {
  const normalizedCep = normalizeCep(cep);
  const response = await fetch(`${VIA_CEP_BASE_URL}/${normalizedCep}/json/`);

  if (!response.ok) {
    throw new Error("errors.cepNotFound");
  }

  const address = (await response.json()) as ViaCepAddress;

  if (address.erro) {
    throw new Error("errors.cepNotFound");
  }

  return address;
}
