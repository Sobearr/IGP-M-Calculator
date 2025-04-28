import XLSX from 'xlsx';

export function salvarValoresSemPath(valores) {
  try {
    const worksheet = XLSX.utils.json_to_sheet(valores);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');

    XLSX.writeFile(workbook, 'ajustes.xlsx');
  } catch (err) {
    throw new Error(`Write error. ${err.message}`);
  }
}

export async function salvarValores(valores, outputPath) {
  try {
    const worksheet = XLSX.utils.json_to_sheet(valores);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');

    // Write JSON data to a file
    XLSX.writeFile(workbook, outputPath);
  } catch (error) {
    console.error('Error processing Excel file:', error);
  }
}
