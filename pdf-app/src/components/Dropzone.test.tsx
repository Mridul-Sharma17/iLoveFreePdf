
import { render, screen, fireEvent } from '@testing-library/react';
import { Dropzone } from './Dropzone';
import { describe, it, expect, vi } from 'vitest';

describe('Dropzone component', () => {
  it('calls onFilesDrop when valid PDF files are dropped', () => {
    const onFilesDrop = vi.fn();
    render(
      <Dropzone onFilesDrop={onFilesDrop} multiple>
        <div data-testid="drop-target">Drop here</div>
      </Dropzone>
    );

    const dropTarget = screen.getByTestId('drop-target').parentElement;
    expect(dropTarget).toBeInTheDocument();

    const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
    
    // Simulate drop
    fireEvent.drop(dropTarget as HTMLElement, {
      dataTransfer: {
        files: [file]
      }
    });

    expect(onFilesDrop).toHaveBeenCalledTimes(1);
    expect(onFilesDrop).toHaveBeenCalledWith([file]);
  });

  it('filters out non-PDF files', () => {
    const onFilesDrop = vi.fn();
    render(
      <Dropzone onFilesDrop={onFilesDrop} multiple>
        <div data-testid="drop-target">Drop here</div>
      </Dropzone>
    );

    const dropTarget = screen.getByTestId('drop-target').parentElement;
    const pdfFile = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
    const imageFile = new File(['dummy content'], 'test.png', { type: 'image/png' });
    
    fireEvent.drop(dropTarget as HTMLElement, {
      dataTransfer: {
        files: [pdfFile, imageFile]
      }
    });

    expect(onFilesDrop).toHaveBeenCalledTimes(1);
    expect(onFilesDrop).toHaveBeenCalledWith([pdfFile]); // Should only contain the PDF
  });

  it('calls onFilesDrop when a file is selected via the button', () => {
    const onFilesDrop = vi.fn();
    render(
      <Dropzone onFilesDrop={onFilesDrop}>
        <div />
      </Dropzone>
    );

    const input = screen.getByTestId('file-input') as HTMLInputElement;
    const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
    
    fireEvent.change(input, {
      target: { files: [file] }
    });

    expect(onFilesDrop).toHaveBeenCalledTimes(1);
    expect(onFilesDrop).toHaveBeenCalledWith([file]);
  });
});
