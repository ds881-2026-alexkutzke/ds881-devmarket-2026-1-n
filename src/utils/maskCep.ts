export const maskCep = (value: string): string => {
  if (!value) {
    return '';
  }

  let numericValue = value.replace(/\D/g, '');

  numericValue = numericValue.substring(0, 8);

  if (numericValue.length > 5) {
    return numericValue.substring(0, 5) + '-' + numericValue.substring(5, 8);
  }

  return numericValue;
};