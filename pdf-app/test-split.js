import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import { parsePageNumbers, extractPages } from './src/lib/pdf-utils.js';

async function testSplit() {
  const fileBytes = fs.readFileSync('test-10pg.pdf');
  const file = new File([fileBytes], 'test-10pg.pdf', { type: 'application/pdf' });
  
  const pagesToExtract = parsePageNumbers('1-5, 7-9', 10);
  console.log('Pages to extract (0-indexed):', pagesToExtract);
  
  try {
    const extractedBytes = await extractPages(file, pagesToExtract);
    const extractedDoc = await PDFDocument.load(extractedBytes);
    console.log('Extracted document has', extractedDoc.getPageCount(), 'pages.');
    fs.writeFileSync('extracted-test.pdf', extractedBytes);
    console.log('Saved to extracted-test.pdf');
  } catch (error) {
    console.error('Error:', error);
  }
}

testSplit();
