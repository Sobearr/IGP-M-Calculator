export const parseDate = (date) => {
  const [day, month, year] = date.split('/');
  const pad = (val) => val.padStart(2, '0');
  const dataFormatada = `${pad(year)}-${pad(month)}-${pad(day)}`;

  return dataFormatada;
};
