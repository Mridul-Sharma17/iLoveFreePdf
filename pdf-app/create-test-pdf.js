import { PDFDocument } from 'pdf-lib';
import fs from 'fs';

async function createPdf() {
  const pdfDoc = await PDFDocument.create();
  for (let i = 1; i <= 10; i++) {
    const page = pdfDoc.addPage([400, 400]);
    page.drawText(`Page ${i}`, { x: 50, y: 200 });
  }
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('test-10pg.pdf', pdfBytes);
  console.log('Created test-10pg.pdf');
}

createPdf();
