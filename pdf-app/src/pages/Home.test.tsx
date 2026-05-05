import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Home } from './Home';
import { describe, it, expect } from 'vitest';

describe('Home component', () => {
  it('renders the hero section and tool cards', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // Check Hero text
    expect(screen.getByText(/Every tool you need/i)).toBeInTheDocument();
    expect(screen.getByText(/to work with PDFs/i)).toBeInTheDocument();
    expect(screen.getByText(/100% Free, Local, and Private/i)).toBeInTheDocument();

    // Check for some tool headings
    expect(screen.getByRole('heading', { level: 2, name: /Merge PDF/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Word to PDF/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /PDF to JPG/i })).toBeInTheDocument();

    // Verify links
    expect(screen.getByRole('link', { name: /Merge PDF/i }).getAttribute('href')).toBe('/merge');
    expect(screen.getByRole('link', { name: /Word to PDF/i }).getAttribute('href')).toBe('/word-to-pdf');
    expect(screen.getByRole('link', { name: /PDF to JPG/i }).getAttribute('href')).toBe('/pdf-to-jpg');
  });
});
