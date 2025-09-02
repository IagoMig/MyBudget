import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Expense } from '../types';
export const generateExpensePDF = async (expenses: Expense[], elementId: string) => {
  const element = document.getElementById(elementId);
  if (!element) return null;
  try {
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = imgProps.height * pdfWidth / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    return pdf;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return null;
  }
};
export const downloadPDF = (pdf: jsPDF | null, filename: string) => {
  if (!pdf) return;
  pdf.save(filename);
};