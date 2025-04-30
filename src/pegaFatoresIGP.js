export function pegaFatoresIGP(vencimento, data, igpIndices) {
  let { ano, mes } = vencimento;
  ano = Number(ano);
  mes--;
  const anoHoje = data.year;
  let mesHoje = data.month;
  mesHoje--;

  let fatores = [];

  if (anoHoje === ano && mesHoje === mes) {
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
