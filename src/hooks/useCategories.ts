import { useState, useEffect } from 'react';
import { categoryService } from '@/services/categoryService';
import type { Category } from '@/types/category.types';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    categoryService.getAll()
      .then((data: Category[]) => {
        setCategories(data);
        setIsLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  return { categories, isLoading, error };
}