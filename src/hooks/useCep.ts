import { useState, useCallback } from 'react';
import { fetchAddressByCep } from '@/services/cepService';
import type { ViaCepAddress } from '@/types/cep.types';

export default function useCep() {
  const [address, setAddress] = useState<ViaCepAddress | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookup = useCallback(async (cep: string) => {
    setIsLoading(true);
    setError(null);
    setAddress(null);

    try {
      const data = await fetchAddressByCep(cep);
      setAddress(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('errors.cepNotFound');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { lookup, address, isLoading, error };
}
