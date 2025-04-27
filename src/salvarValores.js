import XLSX from 'xlsx';

export function salvarValores(valores) {
  try {
    const worksheet = XLSX.utils.json_to_sheet(valores);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');

    XLSX.writeFile(workbook, 'ajustes.xlsx');
  } catch (err) {
    throw new Error(`Write error. ${err.message}`);
  }
}
