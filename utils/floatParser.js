import { InvalidArgumentError } from 'commander';

export function floatParser(value) {
  const parsedValue = parseFloat(value);

  if (isNaN(parsedValue) || parsedValue <= 0) {
    throw new InvalidArgumentError(
      'Valor precisa ser positivo e maior que zero.'
    );
  }

  return parseFloat(parsedValue.toFixed(2));
}
