// OBJETIVO PRINCIPAL: ajuste financeiro de cada valor, baseado na data de vencimento
// Gerar arquivo excel com: nome, data vencimento, data hoje, valor original, valor atualizado

// TO-DO:
// Checar por input com dia apos data de calculo
// --input
// multa e juros
// pro-rata
// arrumar excelToJson
// arrumar jsonToExcel
// Remover comentarios
// Salvar arquivo com os valores atualizados - escolher onde salvar?
// Implementar CLI
// Log quando houver erro no reajuste
import { readFileSync } from 'node:fs';
import { pegarData } from './src/pegarData.js';
import { pegaFatoresIGP } from './src/pegaFatoresIGP.js';
import { ajustaValor } from './src/ajustaValor.js';
// import { salvarValores } from './src/salvarValores.js';
import { jsonToExcel } from './utils/jsonToExcel.js';
import { excelToJson } from './utils/excelToJson.js';
import 'dotenv/config';
import { Option, program } from 'commander';
import { DateTime } from 'luxon';
import { exit } from 'node:process';
import { extname } from 'node:path';

// 0. comando para rodar: node index.js arquivo_excel -flags
// calcular sem arquivo excel (fornecer valor e data de vencimento) / calculo rapido, gerar arquivo de output,
// alterar data final de calculo, juros e multa configuraveis, juros pro-rata,
// flag caso o arquivo tenha o nome do devedor
program
  .option('-f, --file-input <string>', 'file with values')
  .option(
    '-o, --output <string>',
    'gera arquivo excel com os valores ajustados'
  )
  .option('-d, --date <string>', 'data de cobranca')
  .addOption(
    new Option('-i, --input <string>', 'valor e data').conflicts('fileInput')
  )
  .option('-j, --juros <int>', 'porcentagem de juros')
  .option('-m, --multa <int>', 'porcentagem de multa')
  .option('-p, --pro-rata', 'especifica se juros sera cobrado pro-rata');

program.parse();
const options = program.opts();

// sem options -> descricao do programa e instrucoes
if (Object.keys(options).length === 0) {
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
// let cobrancasJSON = readFileSync('./src/data/cobrancas_mock.json');
const igpIndicesJSON = readFileSync('./src/data/igp-m.json');

if (options.fileInput) {
  const extension = extname(options.fileInput);
  const allowedExtensions = ['.xlsx', '.json'];
  if (!allowedExtensions.includes(extension)) {
    throw new Error('Arquivo invalido');
  }

  try {
    if (extension === '.xlsx') {
      cobrancasJSON = await excelToJson(options.fileInput);
    } else {
      const arquivoInput = readFileSync(options.fileInput);
      cobrancasJSON = JSON.parse(arquivoInput);
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log('Please ensure the file is in the specified directory');
    }
    exit(1);
  }
}

// const cobrancas = JSON.parse(cobrancasJSON);
const igpIndices = JSON.parse(igpIndicesJSON);

// 3. atualizar valor
// const valoresAjustados = cobrancasJSON.map((cobranca) => {
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

console.log(valoresAjustados);

if (options.output) {
  jsonToExcel(valoresAjustados, options.output);
  console.log(`Resultados escritos em ${options.output}`);
}

// options.output acima realiza essa funcao
// const outputExcelPath = './src/results/teste3.xlsx';
// salvarValores(valoresAjustados);
