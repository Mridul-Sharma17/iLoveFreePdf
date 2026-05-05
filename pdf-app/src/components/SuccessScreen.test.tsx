import { render, screen } from '@testing-library/react';
import { SuccessScreen } from './SuccessScreen';
import { it, expect, describe } from 'vitest';

describe('SuccessScreen', () => {
  it('renders success message and download button', () => {
    render(<SuccessScreen onDownload={() => {}} onRestart={() => {}} />);
    expect(screen.getByText(/Your document is ready/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Download File/i })).toBeDefined();
  });
});
