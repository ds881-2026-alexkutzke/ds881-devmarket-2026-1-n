import { Button } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const { t } = useTranslation();
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const pages = getPageNumbers();

  return (
    <nav aria-label={t('components.pagination.nav', { defaultValue: 'Pagination' })} className="flex items-center justify-center space-x-2 my-4">
      <Button
        variant="outlined"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label={t('components.pagination.previous')}
      >
        {t('components.pagination.previous')}
      </Button>

      {pages.map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className="px-3 py-1 text-gray-500">{t('components.pagination.ellipsis', { defaultValue: '...' })}</span>
          ) : (
            <Button
              variant={currentPage === page ? "contained" : "outlined"}
              onClick={() => onPageChange(page as number)}
              aria-current={currentPage === page ? 'page' : undefined}
              aria-label={t('components.pagination.pageLabel', { page })}
            >
              {page}
            </Button>
          )}
        </React.Fragment>
      ))}

      <Button
        variant="outlined"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label={t('components.pagination.next')}
      >
        {t('components.pagination.next')}
      </Button>
    </nav>
  );
};

export default Pagination;
