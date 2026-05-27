import { useTranslation } from 'react-i18next';

export default function StarRating({ rating }: { rating: number }) {
  const { t } = useTranslation();

  return (
    <div className="text-sm text-yellow-500">
      {t('components.starRating.label', { rating })}
    </div>
  );
}