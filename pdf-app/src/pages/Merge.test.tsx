
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Merge } from './Merge';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as pdfUtils from '../lib/pdf-utils';

// Mock pdf-utils
vi.mock('../lib/pdf-utils', () => ({
  mergePdfs: vi.fn(),
  downloadPdf: vi.fn(),
}));

describe('Merge component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the initial state with dropzone message', () => {
    render(
      <MemoryRouter>
        <Merge />
      </MemoryRouter>
    );

    expect(screen.getByText(/Choose PDF Files/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /merge pdfs/i })).not.toBeInTheDocument();
  });

  it('allows merging when multiple files are added', async () => {
    render(
      <MemoryRouter>
        <Merge />
      </MemoryRouter>
    );

    const dropTarget = screen.getByText(/Choose PDF Files/i).closest('.min-h-\\[60vh\\]');
    const file1 = new File(['1'], 'one.pdf', { type: 'application/pdf' });
    const file2 = new File(['2'], 'two.pdf', { type: 'application/pdf' });

    // Simulate dropping files
    fireEvent.drop(dropTarget as HTMLElement, {
      dataTransfer: {
        files: [file1, file2]
      }
    });

    expect(screen.getByText('one.pdf')).toBeInTheDocument();
    expect(screen.getByText('two.pdf')).toBeInTheDocument();

    const mergeButton = screen.getByRole('button', { name: /merge pdfs/i });
    expect(mergeButton).not.toBeDisabled();

    // Mock mergePdfs to return a dummy Uint8Array
    const dummyBytes = new Uint8Array([1, 2, 3]);
    (pdfUtils.mergePdfs as any).mockResolvedValue(dummyBytes);

    fireEvent.click(mergeButton);

    await waitFor(() => {
      expect(pdfUtils.mergePdfs).toHaveBeenCalledWith([file1, file2]);
      // The SuccessScreen handleDownload triggers createObjectURL and a link click, 
      // but in tests we verify the downloadPdf mock if applicable, 
      // though in our current Merge.tsx we use SuccessScreen and manual download logic.
      // Let's check Merge.tsx again.
    });
  });
});
