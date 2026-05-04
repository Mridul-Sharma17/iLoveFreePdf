
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Home } from './Home';
import { describe, it, expect } from 'vitest';

describe('Home component', () => {
  it('renders the select a tool heading and all three tools', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /select a tool/i })).toBeInTheDocument();

    // Check for the specific tool headings and links
    expect(screen.getByRole('heading', { level: 2, name: /merge pdfs/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /merge pdfs/i }).getAttribute('href')).toBe('/merge');
    expect(screen.getByText(/Combine multiple PDF files into a single document/i)).toBeInTheDocument();

    expect(screen.getByRole('heading', { level: 2, name: /split pdf/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /split pdf/i }).getAttribute('href')).toBe('/split');
    expect(screen.getByText(/Extract specific pages from a PDF into a new file/i)).toBeInTheDocument();

    expect(screen.getByRole('heading', { level: 2, name: /remove pages/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /remove pages/i }).getAttribute('href')).toBe('/remove');
    expect(screen.getByText(/Delete specific pages from a PDF document/i)).toBeInTheDocument();
  });
});
