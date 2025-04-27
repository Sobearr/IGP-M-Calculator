import fs from 'fs/promises';
import XLSX from 'xlsx';

export async function excelToJson(filePath) {
  try {
    // Read the file
    const fileBuffer = await fs.readFile(filePath);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

    // Get the first sheet name
    const sheetName = workbook.SheetNames[0];

    // Convert sheet to JSON
    const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Normalizar dados
    const jsonNovo = jsonData.map((entry) => {
      const entryArr = Object.values(entry);
      return {
        nome: String(entryArr[0]),
        vencimento: String(entryArr[1]),
        valor: Number(entryArr[2]),
      };
    });

    return jsonNovo;
  } catch (error) {
    console.error('Error processing Excel file:', error);
  }
}

// Example usage
// const inputExcelPath = '../src/data/cobrancas_mock.xlsx'; // Change to your Excel file path
// const outputJsonPath = '../src/data/cobrancas_mock.json'; // Path where JSON will be saved

// const arquivo = await excelToJson(inputExcelPath, outputJsonPath);
// console.log(arquivo);
