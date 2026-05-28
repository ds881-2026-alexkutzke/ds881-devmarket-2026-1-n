import { Add, DeleteOutlined, Remove } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import { useTranslation } from 'react-i18next';

interface QuantitySelectorProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  onRemove: () => void;
}

function QuantitySelector({
  value,
  min,
  max,
  onChange,
  onRemove,
}: QuantitySelectorProps) {
  const { t } = useTranslation();
  const isMinValue = value <= min;
  const isMaxValue = value >= max;

  const decrease = () => {
    if (!isMinValue) {
      onChange(Math.max(min, value - 1));
    }
  };

  const increase = () => {
    if (!isMaxValue) {
      onChange(Math.min(max, value + 1));
    }
  };

  return (
    <div className="inline-flex items-center gap-2 rounded-md border border-muted-300 bg-muted-50 p-1 text-muted-950">
      <IconButton
        onClick={decrease}
        disabled={isMinValue}
        aria-label={t('components.quantitySelector.decrease')}
        size="small"
        className="h-8 w-8 rounded-md text-muted-950 transition hover:bg-muted-300 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Remove fontSize="small" />
      </IconButton>

      <span
        aria-label={t('components.quantitySelector.quantityLabel')}
        className="flex h-8 min-w-8 items-center justify-center px-2 text-base font-medium"
      >
        {value}
      </span>

      <IconButton
        onClick={increase}
        disabled={isMaxValue}
        aria-label={t('components.quantitySelector.increase')}
        size="small"
        className="h-8 w-8 rounded-md text-muted-950 transition hover:bg-muted-300 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Add fontSize="small" />
      </IconButton>

      <IconButton
        onClick={onRemove}
        aria-label={t('components.quantitySelector.remove')}
        size="small"
        className="h-8 w-8 rounded-md text-danger-700 transition hover:bg-danger-50 focus:outline-none focus:ring-2 focus:ring-danger-500"
      >
        <DeleteOutlined fontSize="small" />
      </IconButton>
    </div>
  );
}

export default QuantitySelector;
