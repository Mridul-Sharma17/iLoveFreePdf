import { describe, it, expect } from 'vitest';
import { convertPdfToJpgs } from './pdf-image-utils';

describe('convertPdfToJpgs', () => {
  it('should be defined', () => {
    expect(convertPdfToJpgs).toBeDefined();
  });
});
