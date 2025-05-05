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
import { renameJsonFields } from './utils/renameJsonFields.js';

program
  .option('-o, --output <string>', 'gera arquivo excel no caminho especificado')
  .option('-d, --date <string>', 'data de cobranca')
  .argument('<file name>')
  .showHelpAfterError();

program.parse();
const options = program.opts();

const filePath = program.args[0];
const hasOneArg = program.args.length === 1;

const dataHoje = DateTime.now();
// 1. sem flag de data, pegar data hoje
let data = dataHoje;
if (options.date) {
  const dataFormatada = pegarData(options.date);
  data = dataFormatada.isValid ? dataFormatada : data;
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

  const dadosJSON = await extensionHandlers[extensionInput](filePath);
  cobrancasJSON = dadosJSON.map((dados) => renameJsonFields(dados));
} catch (err) {
  const erro = new ErrorHandler(err);
  erro.getMessage();
  exit(1);
}

const igpIndices = JSON.parse(igpIndicesJSON);

// 3. atualizar valor
console.log(
  `Ajustando valores para a data ${data.day}/${data.month}/${data.year}`
);

const valoresAjustados = cobrancasJSON.map((cobranca) => {
  let { nome, vencimento, valor } = cobranca;
  const dataVencimento = pegarData(vencimento);
  const fatores = pegaFatoresIGP(dataVencimento, data, igpIndices);
  const valorAjustado = ajustaValor(fatores, valor, dataVencimento);

  return { nome, vencimento, valor, valorAjustado };
});

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
