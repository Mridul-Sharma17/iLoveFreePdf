import { PDFDocument } from 'pdf-lib';

export async function mergePdfs(files: File[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
    
    copiedPages.forEach((page) => {
      mergedPdf.addPage(page);
    });
  }

  return await mergedPdf.save();
}

export function downloadPdf(bytes: Uint8Array, filename: string) {
  const blob = new Blob([bytes as any], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Parses a string like "1, 3, 5-8" into an array of 0-indexed page numbers [0, 2, 4, 5, 6, 7]
export function parsePageNumbers(input: string, maxPages: number): number[] {
  const pages = new Set<number>();
  // Replace all commas and semicolons with spaces, then split by whitespace
  const parts = input.replace(/[,;]/g, ' ').split(/\s+/);

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    if (trimmed.includes('-')) {
      const rangeParts = trimmed.split('-');
      if (rangeParts.length === 2) {
        const start = parseInt(rangeParts[0], 10);
        const end = parseInt(rangeParts[1], 10);
        if (!isNaN(start) && !isNaN(end) && start <= end) {
          for (let i = start; i <= end; i++) {
            if (i > 0 && i <= maxPages) pages.add(i - 1);
          }
        }
      }
    } else {
      const num = parseInt(trimmed, 10);
      if (!isNaN(num) && num > 0 && num <= maxPages) {
        pages.add(num - 1);
      }
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}

export async function extractPages(file: File, pageNumbers: number[]): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const srcDoc = await PDFDocument.load(arrayBuffer);
  const newDoc = await PDFDocument.create();

  const pagesToExtract = pageNumbers.filter(n => n >= 0 && n < srcDoc.getPageCount());
  
  if (pagesToExtract.length === 0) throw new Error("No valid pages to extract");

  const copiedPages = await newDoc.copyPages(srcDoc, pagesToExtract);
  copiedPages.forEach((page) => newDoc.addPage(page));

  return await newDoc.save();
}

export async function removePages(file: File, pageNumbersToRemove: number[]): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const srcDoc = await PDFDocument.load(arrayBuffer);
  const newDoc = await PDFDocument.create();

  const totalPages = srcDoc.getPageCount();
  const pagesToKeep = [];

  for (let i = 0; i < totalPages; i++) {
    if (!pageNumbersToRemove.includes(i)) {
      pagesToKeep.push(i);
    }
  }

  if (pagesToKeep.length === 0) throw new Error("Cannot remove all pages");

  const copiedPages = await newDoc.copyPages(srcDoc, pagesToKeep);
  copiedPages.forEach((page) => newDoc.addPage(page));

  return await newDoc.save();
}

export async function getPdfPageCount(file: File): Promise<number> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  return pdfDoc.getPageCount();
}

export async function convertJpgsToPdf(files: File[]): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();
  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const image = file.type === 'image/png' 
      ? await pdfDoc.embedPng(arrayBuffer) 
      : await pdfDoc.embedJpg(arrayBuffer);
    
    const page = pdfDoc.addPage([image.width, image.height]);
    page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
  }
  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes as any], { type: 'application/pdf' });
}
