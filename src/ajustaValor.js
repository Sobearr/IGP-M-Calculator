import { DateTime } from 'luxon';

export function ajustaValor(fatores, valor, dataVencimento) {
  // estabelecer mes/ano limite para inicio e fim da tabela (06/1989 - 04/2025) atualizar todo mes quando o indice for publicado
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

    let reajuste = valor * fatorAcumulado;

    // checar moeda
    if (ano < 1990 || (ano === 1990 && (mes < 3 || (mes === 3 && dia <= 15)))) {
      //cruzado novo
      reajuste *= process.env.CRUZADO_NOVO;
    } else if (ano < 1993 || (ano === 1993 && mes < 8)) {
      // cruzeiro
      reajuste *= process.env.CRUZEIRO;
    } else if (ano < 1994 || (ano === 1994 && mes < 7)) {
      // cruzeiro real
      reajuste *= process.env.CRUZEIRO_REAL;
    }

    return reajuste.toFixed(2);
  } else {
    return valor.toFixed(2);
  }
}
