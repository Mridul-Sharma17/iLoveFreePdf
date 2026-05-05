
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './Layout';
import { describe, it, expect } from 'vitest';

describe('Layout component', () => {
  it('renders the header and an outlet for children', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<div data-testid="child-outlet">Test Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // Should have a link to home
    const homeLink = screen.getByRole('link', { name: /iLoveFreePdf/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink.getAttribute('href')).toBe('/');

    // Should render the child outlet content
    const childContent = screen.getByTestId('child-outlet');
    expect(childContent).toBeInTheDocument();
    expect(childContent).toHaveTextContent('Test Content');
  });
});
