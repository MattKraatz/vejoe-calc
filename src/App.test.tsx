import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders header', () => {
  render(<App />);
  const header = screen.getByText(/veJOE Boost Calculator/i);
  expect(header).toBeInTheDocument();
});
