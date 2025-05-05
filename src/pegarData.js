import { DateTime } from 'luxon';
import { parseDate } from '../utils/parseDate.js';

export function pegarData(dataInput) {
  const data = parseDate(dataInput);
  const dataFormatada = DateTime.fromFormat(data, 'yyyy-MM-dd');
  return dataFormatada;
}
