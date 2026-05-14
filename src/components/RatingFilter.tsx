type RatingFilterProps = {
  min: number;
  max: number;
  onChange?: (range: { min: number; max: number }) => void;
};

const RatingFilter = ({ min, max, onChange }: RatingFilterProps) => {
  const isValidRange = min <= max;

  const handleMinChange = (value: number) => {
    onChange?.({ min: value, max });
  };

  const handleMaxChange = (value: number) => {
    onChange?.({ min, max: value });
  };

  return (
    <fieldset aria-invalid={!isValidRange}>
      <legend>Avaliação</legend>

      <label htmlFor="rating-filter-min">Mínima</label>
      <input
        id="rating-filter-min"
        type="number"
        min="0"
        max="5"
        value={min}
        onChange={(event) => handleMinChange(Number(event.target.value))}
      />

      <label htmlFor="rating-filter-max">Máxima</label>
      <input
        id="rating-filter-max"
        type="number"
        min="0"
        max="5"
        value={max}
        onChange={(event) => handleMaxChange(Number(event.target.value))}
      />

      {!isValidRange && (
        <p role="alert">A avaliação mínima deve ser menor ou igual à máxima.</p>
      )}
    </fieldset>
  );
};

export default RatingFilter;
