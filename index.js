import { readFileSync } from 'node:fs';
import { pegarData } from './src/pegarData.js';
import { pegaFatoresIGP } from './src/pegaFatoresIGP.js';
import { ajustaValor } from './src/ajustaValor.js';
import { salvarValores, salvarValoresSemPath } from './src/salvarValores.js';
import { excelToJson } from './utils/excelToJson.js';
import 'dotenv/config';
import { Option, program } from 'commander';
import { DateTime } from 'luxon';
import { exit } from 'node:process';
import { extname } from 'node:path';
import { ErrorHandler } from './utils/errorHandler.js';

program
  .option(
    '-o, --output <string>',
    'gera arquivo excel com os valores ajustados'
  )
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
  const dataInput = DateTime.fromFormat(options.date, 'yyyy-MM-dd');
  data = dataInput.isValid ? dataInput : data;
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
const valoresAjustados = cobrancasJSON.map((cobranca) => {
  let { nome, vencimento, valor } = cobranca;

  if (!nome || !vencimento || !valor) {
    // throw new Error('Insira os dados da cobranca');
    nome = '';
    vencimento = '';
    valor = 0;
  }

  const dataVencimento = pegarData(cobranca);
  const fatores = pegaFatoresIGP(dataVencimento, data, igpIndices);
  const valorAjustado = ajustaValor(fatores, valor, dataVencimento);

  return { nome, vencimento, valor, valorAjustado };
});

// Mostrar na tela de forma organizada
// console.log(valoresAjustados);

// Checar extensao do arquivo de output (precisar ser .xlsx)
if (options.output && extname(options.output) === '.xlsx') {
  salvarValores(valoresAjustados, options.output);
} else {
  salvarValoresSemPath(valoresAjustados);
  options.output = '';
}

console.log(`Resultados salvos em ${options.output || 'ajustes.xlsx'}`);
exit(0);
