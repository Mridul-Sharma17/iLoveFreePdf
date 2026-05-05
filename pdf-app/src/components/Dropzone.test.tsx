
import { render, screen, fireEvent } from '@testing-library/react';
import { Dropzone } from './Dropzone';
import { describe, it, expect, vi } from 'vitest';

describe('Dropzone component', () => {
  it('calls onFilesSelect when files are dropped', () => {
    const onFilesSelect = vi.fn();
    render(
      <Dropzone onFilesSelect={onFilesSelect} multiple>
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

    expect(onFilesSelect).toHaveBeenCalledTimes(1);
    expect(onFilesSelect).toHaveBeenCalledWith([file]);
  });

  it('calls onFilesSelect when a file is selected via the input', () => {
    const onFilesSelect = vi.fn();
    render(
      <Dropzone onFilesSelect={onFilesSelect}>
        <div />
      </Dropzone>
    );

    const input = screen.getByTestId('file-input') as HTMLInputElement;
    const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
    
    fireEvent.change(input, {
      target: { files: [file] }
    });

    expect(onFilesSelect).toHaveBeenCalledTimes(1);
    expect(onFilesSelect).toHaveBeenCalledWith([file]);
  });
});
