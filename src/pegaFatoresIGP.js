export function pegaFatoresIGP(vencimento, data, igpIndices) {
  let { ano, mes } = vencimento;
  mes--;
  const anoHoje = data.year;
  let mesHoje = data.month;
  mesHoje--;

  let fatores = [];

  if (anoHoje === ano && mesHoje === mes) {
    console.log('anos iguais, meses iguais');

    return fatores;
  }

  while (ano < anoHoje || (anoHoje === ano && mes <= mesHoje)) {
    const indice = igpIndices[mes][String(ano)];

    if (indice !== undefined) {
      fatores.push(igpIndices[mes][String(ano)]);
    } else {
      console.log(`Indice para ${mes + 1}/${ano} nao encontrado`);
    }

    mes++;

    if (mes > 11) {
      mes = 0;
      ano++;
    }
  }

  return fatores;
}
