export function converteMoeda(dia, mes, ano) {
  console.log(dia, mes, ano);

  let moeda = 1;
  if (ano < 1990 || (ano === 1990 && (mes < 3 || (mes === 3 && dia <= 15)))) {
    moeda = process.env.CRUZADO_NOVO;
  } else if (ano < 1993 || (ano === 1993 && mes < 8)) {
    moeda = process.env.CRUZEIRO;
  } else if (ano < 1994 || (ano === 1994 && mes < 7)) {
    moeda = process.env.CRUZEIRO_REAL;
  }

  return moeda;
}
