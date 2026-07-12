import { render, screen } from 'tests';

import { Home } from './Home';

describe('Home', () => {
  test('renders GarageFlow placeholder shell', async () => {
    render(<Home />);

    expect(await screen.findByRole('heading', { name: 'GarageFlow App' })).toBeInTheDocument();
    expect(screen.getByText('A full-stack garage workflow application scaffold.')).toBeInTheDocument();
    expect(screen.getByText('Scaffold ready. GarageFlow domain features are not implemented yet.')).toBeInTheDocument();
  });
});
