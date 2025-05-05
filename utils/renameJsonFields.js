export function renameJsonFields(json) {
  const jsonRenomeado = {};

  for (const [key, val] of Object.entries(json)) {
    if (typeof val === 'number') {
      jsonRenomeado.valor = val;
    } else if (
      typeof val === 'string' &&
      /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(val)
    ) {
      jsonRenomeado.vencimento = val;
    } else if (typeof val === 'string') {
      jsonRenomeado.nome = val;
    }
  }

  if (
    !jsonRenomeado.nome ||
    !jsonRenomeado.vencimento ||
    !jsonRenomeado.valor
  ) {
    throw new Error(
      'Este JSON possui campos inválidos ou não possui os campos necessários.'
    );
  }

  return jsonRenomeado;
}
