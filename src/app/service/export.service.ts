import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() { }

  exportToCSV(data: any[], filename: string) {
    const csvData = this.convertToCSV(data);
    const blob = new Blob([csvData], { type: 'text/csv' });
    saveAs(blob, filename + '.csv');
  }

  convertToCSV(objArray: any[]): string {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    const headers = Object.keys(array[0]);
    const csv = array.map((row: any) => headers.map(fieldName => row[fieldName]).join(','));
    return [headers.join(','), ...csv].join('\n');
  }

  exportToExcel(data: any[], filename: string) {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, filename + '.xlsx');
  }

  exportToPDF(data: any[], filename: string) {
    const doc = new jsPDF();
  
    // Prepare table headers and rows
    const headers = Object.keys(data[0]).map(key => ({ title: key, dataKey: key }));
    const rows = data.map(row => ({ ...row }));

    // Add table to PDF
    
  
    // Save the PDF with the specified filename
    doc.save(`${filename}.pdf`);
  }
}
