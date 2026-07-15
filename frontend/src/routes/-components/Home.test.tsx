import { render, screen } from 'tests';

import { Home } from './Home';

describe('Home', () => {
  test('renders the GarageFlow workspace shell', async () => {
    render(<Home />);

    expect(await screen.findByRole('banner', { name: 'GarageFlow workspace' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Workshop Schedule' })).toBeInTheDocument();
    expect(screen.getByLabelText('Search registration or customer')).toBeInTheDocument();
  });
});
