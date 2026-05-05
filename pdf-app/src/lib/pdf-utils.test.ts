import { describe, it, expect } from 'vitest';
import { parsePageNumbers, mergePdfs, extractPages, removePages } from './pdf-utils';
import { PDFDocument } from 'pdf-lib';

async function createTestPdf(pages: number): Promise<File> {
  const pdfDoc = await PDFDocument.create();
  for (let i = 0; i < pages; i++) {
    pdfDoc.addPage([200, 200]);
  }
  const bytes = await pdfDoc.save();
  return new File([bytes as any], `test-${pages}pg.pdf`, { type: 'application/pdf' });
}

describe('PDF Utilities', () => {
  describe('parsePageNumbers', () => {
    it('parses single numbers correctly', () => {
      expect(parsePageNumbers('1, 3, 5', 10)).toEqual([0, 2, 4]);
    });

    it('parses ranges correctly', () => {
      expect(parsePageNumbers('1-3, 5-6', 10)).toEqual([0, 1, 2, 4, 5]);
    });

    it('handles mixed single numbers and ranges', () => {
      expect(parsePageNumbers('1, 3-5, 8', 10)).toEqual([0, 2, 3, 4, 7]);
    });

    it('reproduces the multiple ranges bug: 1-5, 7-9', () => {
      expect(parsePageNumbers('1-5, 7-9', 10)).toEqual([0, 1, 2, 3, 4, 6, 7, 8]);
    });

    it('handles out of range numbers in ranges', () => {
      expect(parsePageNumbers('1-5, 10-12', 10)).toEqual([0, 1, 2, 3, 4, 9]);
    });

    it('handles single page PDF', () => {
      expect(parsePageNumbers('1', 1)).toEqual([0]);
      expect(parsePageNumbers('2', 1)).toEqual([]);
    });

    it('ignores invalid input and out of range numbers', () => {
      expect(parsePageNumbers('1, abc, 12, 5-8', 10)).toEqual([0, 4, 5, 6, 7]);
    });

    it('handles overlapping ranges and duplicate numbers', () => {
      expect(parsePageNumbers('1-3, 2, 3-4', 10)).toEqual([0, 1, 2, 3]);
    });

    it('handles empty input', () => {
      expect(parsePageNumbers('', 10)).toEqual([]);
      expect(parsePageNumbers('   ', 10)).toEqual([]);
    });

    it('handles spaces and semicolons as separators', () => {
      expect(parsePageNumbers('1-5 7-9', 10)).toEqual([0, 1, 2, 3, 4, 6, 7, 8]);
      expect(parsePageNumbers('1; 3; 5-7', 10)).toEqual([0, 2, 4, 5, 6]);
    });
  });

  describe('mergePdfs', () => {
    it('merges two PDF files correctly', async () => {
      const file1 = await createTestPdf(2);
      const file2 = await createTestPdf(3);
      const mergedBytes = await mergePdfs([file1, file2]);
      const mergedDoc = await PDFDocument.load(mergedBytes);
      expect(mergedDoc.getPageCount()).toBe(5);
    });

    it('handles merging a single PDF file', async () => {
      const file1 = await createTestPdf(2);
      const mergedBytes = await mergePdfs([file1]);
      const mergedDoc = await PDFDocument.load(mergedBytes);
      expect(mergedDoc.getPageCount()).toBe(2);
    });
  });

  describe('extractPages', () => {
    it('extracts specific pages correctly', async () => {
      const file = await createTestPdf(10);
      const extractedBytes = await extractPages(file, [0, 2, 4]); // Pages 1, 3, 5
      const extractedDoc = await PDFDocument.load(extractedBytes);
      expect(extractedDoc.getPageCount()).toBe(3);
    });

    it('throws error if no valid pages are extracted', async () => {
      const file = await createTestPdf(5);
      await expect(extractPages(file, [10, 11])).rejects.toThrow('No valid pages to extract');
    });
  });

  describe('removePages', () => {
    it('removes specific pages correctly', async () => {
      const file = await createTestPdf(5);
      const resultBytes = await removePages(file, [0, 1]); // Remove pages 1, 2
      const resultDoc = await PDFDocument.load(resultBytes);
      expect(resultDoc.getPageCount()).toBe(3);
    });

    it('throws error if all pages are removed', async () => {
      const file = await createTestPdf(2);
      await expect(removePages(file, [0, 1])).rejects.toThrow('Cannot remove all pages');
    });
  });
});
