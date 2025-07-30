import { describe, it, expect } from 'vitest';
import { renderWithProviders } from './utils';
import App from '../App';

describe('App', () => {
  it('renders without crashing', () => {
    const { getByText } = renderWithProviders(<App />);
    expect(getByText('Postgres ERD GUI')).toBeInTheDocument();
  });
});
