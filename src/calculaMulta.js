export function calculaMulta(multaPercentual, valor) {
  const valorMulta = multaPercentual / 100;
  const valorComMulta = valor * (1 + valorMulta);
  return valorComMulta;
}
