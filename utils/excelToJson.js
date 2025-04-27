import fs from 'fs/promises';
import XLSX from 'xlsx';

const excelToJson = async (filePath, outputJsonPath) => {
  try {
    // Read the file
    const fileBuffer = await fs.readFile(filePath);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

    // Get the first sheet name
    const sheetName = workbook.SheetNames[0];

    // Convert sheet to JSON
    const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // extrair colunas importantes
    // let novo = [];
    // for (let i = 0; i < jsonData.length; i++) {
    //   const dados = {
    //     nome: jsonData[i].Nome,
    //     vencimento: jsonData[i].Vencimento,
    //     valor: jsonData[i].Valor,
    //   };
    //   novo.push(dados);
    // }

    jsonData.forEach((dados) =>
      Object.keys(dados).forEach((ano) => (dados[ano] = 1 + dados[ano] / 100))
    );

    // Write JSON data to a file
    await fs.writeFile(outputJsonPath, JSON.stringify(jsonData, null, 2));

    console.log(`JSON file written to ${outputJsonPath}`);
  } catch (error) {
    console.error('Error processing Excel file:', error);
  }
};

// Example usage
const inputExcelPath = '../src/data/igp-m.xlsx'; // Change to your Excel file path
const outputJsonPath = '../src/data/igp-m.json'; // Path where JSON will be saved

excelToJson(inputExcelPath, outputJsonPath);
