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
      <button
        type="button"
        onClick={decrease}
        disabled={isMinValue}
        aria-label="Diminuir quantidade"
        className="flex h-8 w-8 items-center justify-center rounded-md text-lg font-medium transition hover:bg-muted-300 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        -
      </button>

      <span
        aria-label="Quantidade selecionada"
        className="flex h-8 min-w-8 items-center justify-center px-2 text-base font-medium"
      >
        {value}
      </span>

      <button
        type="button"
        onClick={increase}
        disabled={isMaxValue}
        aria-label="Aumentar quantidade"
        className="flex h-8 w-8 items-center justify-center rounded-md text-lg font-medium transition hover:bg-muted-300 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        +
      </button>

      <button
        type="button"
        onClick={onRemove}
        aria-label="Remover item"
        className="flex h-8 w-8 items-center justify-center rounded-md text-danger-700 transition hover:bg-danger-50 focus:outline-none focus:ring-2 focus:ring-danger-500"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 6h18" />
          <path d="M8 6V4h8v2" />
          <path d="M19 6l-1 14H6L5 6" />
          <path d="M10 11v5" />
          <path d="M14 11v5" />
        </svg>
      </button>
    </div>
  );
}

export default QuantitySelector;
