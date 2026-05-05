
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Split } from './Split';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as pdfUtils from '../lib/pdf-utils';

// Mock pdf-utils
vi.mock('../lib/pdf-utils', () => ({
  extractPages: vi.fn(),
  downloadPdf: vi.fn(),
  parsePageNumbers: vi.fn(),
  getPdfPageCount: vi.fn(),
}));

describe('Split component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the initial state with dropzone message', () => {
    render(
      <MemoryRouter>
        <Split />
      </MemoryRouter>
    );

    expect(screen.getByText(/Choose PDF File/i)).toBeInTheDocument();
  });

  it('allows extracting pages when a file is added and pages are specified', async () => {
    const file = new File(['dummy'], 'test.pdf', { type: 'application/pdf' });
    (pdfUtils.getPdfPageCount as any).mockResolvedValue(10);
    (pdfUtils.parsePageNumbers as any).mockReturnValue([0, 1, 2]); // Pages 1-3
    const dummyBytes = new Uint8Array([1, 2, 3]);
    (pdfUtils.extractPages as any).mockResolvedValue(dummyBytes);

    render(
      <MemoryRouter>
        <Split />
      </MemoryRouter>
    );

    const dropTarget = screen.getByText(/Choose PDF File/i).closest('.min-h-\\[60vh\\]');
    
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
    fireEvent.change(pageInput, { target: { value: '1-3' } });

    const splitButton = screen.getByRole('button', { name: /extract pages/i });
    fireEvent.click(splitButton);

    await waitFor(() => {
      expect(pdfUtils.parsePageNumbers).toHaveBeenCalledWith('1-3', 10);
      expect(pdfUtils.extractPages).toHaveBeenCalledWith(file, [0, 1, 2]);
    });
  });
});
