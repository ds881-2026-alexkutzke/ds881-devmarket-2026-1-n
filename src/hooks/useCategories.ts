import { useQuery } from '@tanstack/react-query';
import { categoryService } from '@/services/categoryService';

export function useCategories() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAll(),
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos para performance
  });

  return {
    categories: data ?? [],
    isLoading,
    error,
  };
}