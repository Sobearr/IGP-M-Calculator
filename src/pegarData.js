export function pegarData(cobranca) {
  const dmy = cobranca.vencimento.split('/');
  const dia = dmy[0];
  const mes = dmy[1];
  const ano = dmy[2];

  return {
    dia,
    mes,
    ano,
  };
}
