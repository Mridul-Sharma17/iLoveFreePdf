import { describe, it, expect } from 'vitest';
import { convertJpgsToPdf } from './pdf-utils';

describe('convertJpgsToPdf', () => {
  it('should create a PDF blob from image files', async () => {
    // Create a dummy 1x1 black pixel JPG
    const jpgBase64 = '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';
    const blob = await fetch(`data:image/jpeg;base64,${jpgBase64}`).then(res => res.blob());
    const file = new File([blob], 'test.jpg', { type: 'image/jpeg' });

    const pdfBlob = await convertJpgsToPdf([file]);
    
    expect(pdfBlob.type).toBe('application/pdf');
    expect(pdfBlob.size).toBeGreaterThan(0);
  });
});
