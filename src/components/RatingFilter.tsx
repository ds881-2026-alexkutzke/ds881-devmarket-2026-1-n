import TextField from '@mui/material/TextField';
import { useTranslation } from 'react-i18next';

interface RatingRange {
  min: number;
  max: number;
}

interface RatingFilterProps extends RatingRange {
  onChange: (range: RatingRange) => void;
}

const MIN_RATING = 0;
const MAX_RATING = 5;

function normalizeRating(value: number): number {
  if (Number.isNaN(value)) {
    return MIN_RATING;
  }

  return Math.min(MAX_RATING, Math.max(MIN_RATING, value));
}

function RatingFilter({
  min,
  max,
  onChange,
}: RatingFilterProps) {
  const { t } = useTranslation();
  const hasInvalidRange = min > max;

  const handleMinChange = (value: string) => {
    onChange({
      min: normalizeRating(Number(value)),
      max,
    });
  };

  const handleMaxChange = (value: string) => {
    onChange({
      min,
      max: normalizeRating(Number(value)),
    });
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <TextField
        label={t('components.ratingFilter.minLabel')}
        type="number"
        value={min}
        onChange={(event) => handleMinChange(event.target.value)}
        error={hasInvalidRange}
        helperText={hasInvalidRange ? t('components.ratingFilter.minError') : undefined}
        slotProps={{
          htmlInput: {
            min: MIN_RATING,
            max: MAX_RATING,
            step: 0.1,
          },
        }}
        size="small"
        fullWidth
      />

      <TextField
        label={t('components.ratingFilter.maxLabel')}
        type="number"
        value={max}
        onChange={(event) => handleMaxChange(event.target.value)}
        error={hasInvalidRange}
        helperText={hasInvalidRange ? t('components.ratingFilter.maxError') : undefined}
        slotProps={{
          htmlInput: {
            min: MIN_RATING,
            max: MAX_RATING,
            step: 0.1,
          },
        }}
        size="small"
        fullWidth
      />
    </div>
  );
}

export default RatingFilter;
