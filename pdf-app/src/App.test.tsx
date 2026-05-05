
import { render, screen } from '@testing-library/react';
import App from './App';
import { describe, it, expect } from 'vitest';

describe('App routing', () => {
  it('renders the Layout and Home component on the index route', () => {
    // Note: App component includes BrowserRouter, which is tied to the window URL.
    // By default jsdom window.location is '/'.
    render(<App />);

    // Should see header from Layout
    expect(screen.getByRole('link', { name: /iLoveFreePdf/i })).toBeInTheDocument();
    
    // Should see Home screen content
    expect(screen.getByRole('heading', { level: 1, name: /every tool you need/i })).toBeInTheDocument();
  });
});
