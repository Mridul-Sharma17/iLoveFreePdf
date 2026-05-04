
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Remove } from './Remove';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as pdfUtils from '../lib/pdf-utils';

// Mock pdf-utils
vi.mock('../lib/pdf-utils', () => ({
  removePages: vi.fn(),
  downloadPdf: vi.fn(),
  parsePageNumbers: vi.fn(),
  getPdfPageCount: vi.fn(),
}));

describe('Remove component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the initial state with dropzone message', () => {
    render(
      <MemoryRouter>
        <Remove />
      </MemoryRouter>
    );

    expect(screen.getByText(/Drop a single PDF file here/i)).toBeInTheDocument();
  });

  it('allows removing pages when a file is added and pages are specified', async () => {
    const file = new File(['dummy'], 'test.pdf', { type: 'application/pdf' });
    (pdfUtils.getPdfPageCount as any).mockResolvedValue(10);
    (pdfUtils.parsePageNumbers as any).mockReturnValue([4, 5]); // Pages 5-6
    const dummyBytes = new Uint8Array([1, 2, 3]);
    (pdfUtils.removePages as any).mockResolvedValue(dummyBytes);

    render(
      <MemoryRouter>
        <Remove />
      </MemoryRouter>
    );

    const dropTarget = screen.getByText(/Drop a single PDF file here/i).parentElement;
    
    // Simulate drop
    fireEvent.drop(dropTarget as HTMLElement, {
      dataTransfer: {
        files: [file]
      }
    });

    await waitFor(() => {
      expect(screen.getByText('test.pdf')).toBeInTheDocument();
      expect(screen.getByText(/10 pages total/i)).toBeInTheDocument();
    });

    const pageInput = screen.getByPlaceholderText(/e.g., 1, 3, 5-8/i);
    fireEvent.change(pageInput, { target: { value: '5-6' } });

    const removeButton = screen.getByRole('button', { name: /remove pages/i });
    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(pdfUtils.parsePageNumbers).toHaveBeenCalledWith('5-6', 10);
      expect(pdfUtils.removePages).toHaveBeenCalledWith(file, [4, 5]);
      expect(pdfUtils.downloadPdf).toHaveBeenCalledWith(dummyBytes, 'cleaned_document.pdf');
    });
  });
});
