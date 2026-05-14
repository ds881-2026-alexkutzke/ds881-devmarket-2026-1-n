export type SortOption =
  | 'relevance'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'rating-asc';

type SortControlProps = {
  value: SortOption;
  onChange: (value: SortOption) => void;
  id?: string;
  label?: string;
};

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'relevance', label: 'Relevância (padrão)' },
  { value: 'price-asc', label: 'Preço: menor primeiro' },
  { value: 'price-desc', label: 'Preço: maior primeiro' },
  { value: 'rating-desc', label: 'Avaliação: maior primeiro' },
  { value: 'rating-asc', label: 'Avaliação: menor primeiro' },
];

function SortControl({
  value,
  onChange,
  id = 'sort-control',
  label = 'Ordenar por',
}: SortControlProps) {
  return (
    <label htmlFor={id}>
      {label}
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as SortOption)}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default SortControl;
