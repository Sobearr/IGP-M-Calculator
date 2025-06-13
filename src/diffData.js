export function diffData(data, dataVencimento, proRata) {
  let formato = proRata ? 'days' : 'months';
  const diff = data.diff(dataVencimento, formato).toObject();
  const tempoAposVencimento = parseInt(diff[formato]);
  return tempoAposVencimento;
}
