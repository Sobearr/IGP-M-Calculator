import XLSX from 'xlsx';
import { ErrorHandler } from '../utils/errorHandler.js';

export async function salvarValores(valores, outputPath) {
  try {
    const worksheet = XLSX.utils.json_to_sheet(valores);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');

    XLSX.writeFile(workbook, outputPath);
    console.log(`Resultados salvos em ${outputPath}`);
  } catch (err) {
    const erro = new ErrorHandler(err);
    erro.getMessage();
  }
}
