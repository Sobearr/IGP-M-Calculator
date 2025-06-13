import { converteMoeda } from '../utils/converteMoeda.js';
import { DateTime } from 'luxon';

export function ajustaValor(fatores, valor, dataVencimento) {
  const ano = dataVencimento.year;
  const mes = dataVencimento.month;
  const dia = dataVencimento.day;

  const mesHoje = DateTime.now().month;
  if (
    ano < 1989 ||
    (ano === 1989 && mes < 5) ||
    (ano === 2025 && mes > mesHoje) ||
    ano > 2025
  ) {
    throw new Error(`Data invalida: ${dia}/${mes}/${ano}`);
  }

  if (fatores.length !== 0) {
    const fatorAcumulado = fatores.reduce(
      (acumulado, fator) => acumulado * fator,
      1
    );

    let reajuste = valor * fatorAcumulado * converteMoeda(dia, mes, ano);
    return parseFloat(reajuste.toFixed(2));
  } else {
    return valor.toFixed(2);
  }
}
