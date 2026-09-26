import { render, screen } from '@testing-library/react';
import App from './App';

test('renders portfolio hero and featured projects', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /manas khare/i })).toBeInTheDocument();
  // Each project name shows up more than once (star label, pill, detail card)
  ['Resumify', 'CareBridge', 'Concierge', 'CoverageAtlas'].forEach((name) => {
    expect(screen.getAllByText(name).length).toBeGreaterThan(0);
  });
});
