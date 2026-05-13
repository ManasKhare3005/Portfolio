import { render, screen } from '@testing-library/react';
import App from './App';

test('renders portfolio hero and featured projects', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /manas khare/i })).toBeInTheDocument();
  expect(screen.getByText('Resumify')).toBeInTheDocument();
  expect(screen.getByText('CareBridge')).toBeInTheDocument();
  expect(screen.getByText('Concierge')).toBeInTheDocument();
  expect(screen.getByText('CoverageAtlas')).toBeInTheDocument();
});
