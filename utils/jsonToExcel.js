import { readFileSync } from 'fs';
import XLSX from 'xlsx';

export function jsonToExcel(data, outputExcelPath) {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');

    // Write JSON data to a file
    XLSX.writeFile(workbook, outputExcelPath);

    console.log(`Excel file written to ${outputExcelPath}`);
  } catch (error) {
    console.error('Error processing Excel file:', error);
  }
}
