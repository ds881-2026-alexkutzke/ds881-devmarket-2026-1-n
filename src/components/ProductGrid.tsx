import { Grid, Skeleton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { Product } from '@/types/product.types';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  error: Error | null;
  onProductClick: (product: Product) => void;
}

export default function ProductGrid({
  products,
  isLoading,
  error,
  onProductClick,
}: ProductGridProps) {
  const { t } = useTranslation();

  // 1. Estado de Loading
  if (isLoading) {
    return (
      <Grid container spacing={2}>
        {Array.from({ length: 8 }).map((_, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
            <Skeleton
              variant="rectangular"
              width="100%"
              height={300}
              animation="wave"
            />
          </Grid>
        ))}
      </Grid>
    );
  }

  // 2. Estado de Erro (usando o ErrorState do projeto)
  if (error) {
    return <ErrorState message={t('pages.home.error')} onRetry={() => window.location.reload()} />;
  }

  // 3. Estado Vazio (usando o EmptyState do projeto)
  if (products.length === 0) {
    return (
      <EmptyState
        title={t('components.productGrid.emptyTitle')}
        description={t('components.productGrid.emptyDescription')}
      />
    );
  }

  // 4. Estado com Produtos
  return (
    <Grid container spacing={2}>
      {products.map((product) => (
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
          <ProductCard product={product} onClick={() => onProductClick(product)} />
        </Grid>
      ))}
    </Grid>
  );
}