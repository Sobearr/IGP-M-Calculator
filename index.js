import { readFileSync } from 'node:fs';
import { pegarData } from './src/pegarData.js';
import { pegaFatoresIGP } from './src/pegaFatoresIGP.js';
import { ajustaValor } from './src/ajustaValor.js';
import { salvarValores } from './src/salvarValores.js';
import { excelToJson } from './utils/excelToJson.js';
import { ErrorHandler } from './utils/errorHandler.js';
import { parseDate } from './utils/parseDate.js';
import 'dotenv/config';
import { program } from 'commander';
import { DateTime } from 'luxon';
import { exit } from 'node:process';
import { extname } from 'node:path';

program
  .option('-o, --output <string>', 'gera arquivo excel no caminho especificado')
  .option('-d, --date <string>', 'data de cobranca')
  .argument('<file name>')
  .showHelpAfterError();

program.parse();
const options = program.opts();

const filePath = program.args[0];
const hasOneArg = program.args.length === 1;

if (!hasOneArg) {
  console.log(
    'Erro: Você deve incluir somente o caminho do arquivo com os valores a serem ajustados.'
  );
  program.help();
}

// 1. sem flag de data, pegar data hoje
let data = DateTime.now();
if (options.date) {
  const dataFormatada = parseDate(options.date);
  const dataInput = DateTime.fromFormat(dataFormatada, 'yyyy-MM-dd');
  data = dataInput.isValid ? dataInput : data;
  console.log(
    `Ajustando valores para a data ${data.day}/${data.month}/${data.year}`
  );
}

// 2. carregar arquivo do input (aceitar json e xlsx)
// 2.1 se for xlsx -> converter para json
let cobrancasJSON;
const igpIndicesJSON = readFileSync('./src/data/igp-m.json');

const extensionInput = extname(filePath);
const allowedExtensions = ['.xlsx', '.json'];

try {
  if (!allowedExtensions.includes(extensionInput)) {
    throw new Error(
      `A extensão ${extensionInput} não é válida. Por favor utilize arquivos .xlsx ou .json.`
    );
  }

  const extensionHandlers = {
    '.xlsx': async (filePath) => await excelToJson(filePath),
    '.json': (filePath) => JSON.parse(readFileSync(filePath)),
  };

  cobrancasJSON = await extensionHandlers[extensionInput](filePath);
} catch (err) {
  const erro = new ErrorHandler(err);
  erro.getMessage();

  exit(1);
}

const igpIndices = JSON.parse(igpIndicesJSON);

// 3. atualizar valor
let vazio = false;
const valoresAjustados = cobrancasJSON.map((cobranca) => {
  let { nome, vencimento, valor } = cobranca;

  if (!nome || !vencimento || !valor) {
    nome = '';
    vencimento = '';
    valor = 0;
    vazio = true;
  }

  const dataVencimento = pegarData(cobranca);
  const fatores = pegaFatoresIGP(dataVencimento, data, igpIndices);
  const valorAjustado = ajustaValor(fatores, valor, dataVencimento);

  return { nome, vencimento, valor, valorAjustado };
});

if (vazio) {
  console.log(
    'Fileiras com dados faltantes. O valor dessas fileiras não será ajustado.'
  );
}

if (options.output) {
  let outputPath = options.output;
  if (extname(options.output) !== '.xlsx') {
    const extensionStart = outputPath.lastIndexOf('.');

    outputPath =
      outputPath.substring(
        0,
        extensionStart <= 0 ? outputPath.length : extensionStart
      ) + '.xlsx';
  }
  salvarValores(valoresAjustados, outputPath);
} else {
  Object.values(valoresAjustados).forEach((entry) =>
    console.log(`${entry.nome} ${entry.vencimento} ${entry.valorAjustado}`)
  );
}

exit(0);
