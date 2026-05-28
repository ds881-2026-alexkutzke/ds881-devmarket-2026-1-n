import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useTranslation } from 'react-i18next';

export interface PriceFilterValue {
  min: number;
  max: number;
}

interface PriceFilterProps {
  min: number;
  max: number;
  onChange: (value: PriceFilterValue) => void;
}

function PriceFilter({ min, max, onChange }: PriceFilterProps) {
  const { t } = useTranslation();
  const hasInvalidRange = min > max;

  const parsePrice = (value: string) => {
    const parsedValue = Number(value);

    return Number.isFinite(parsedValue) ? Math.max(0, parsedValue) : 0;
  };

  const handleMinChange = (value: string) => {
    onChange({
      min: parsePrice(value),
      max,
    });
  };

  const handleMaxChange = (value: string) => {
    onChange({
      min,
      max: parsePrice(value),
    });
  };

  return (
    <Stack spacing={2}>
      <TextField
        type="number"
        label={t('components.priceFilter.minLabel')}
        value={min}
        onChange={(event) => handleMinChange(event.target.value)}
        error={hasInvalidRange}
        helperText={hasInvalidRange ? t('components.priceFilter.minError') : undefined}
        size="small"
        fullWidth
        slotProps={{
          htmlInput: {
            min: 0,
            step: 0.01,
          },
        }}
      />

      <TextField
        type="number"
        label={t('components.priceFilter.maxLabel')}
        value={max}
        onChange={(event) => handleMaxChange(event.target.value)}
        error={hasInvalidRange}
        helperText={hasInvalidRange ? t('components.priceFilter.maxError') : undefined}
        size="small"
        fullWidth
        slotProps={{
          htmlInput: {
            min: 0,
            step: 0.01,
          },
        }}
      />
    </Stack>
  );
}

export default PriceFilter;
