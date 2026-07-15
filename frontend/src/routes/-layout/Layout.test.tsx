import { render, screen } from 'tests';

import { Layout } from './Layout';

describe('Layout', () => {
  test('renders the route layout shell without scaffold navigation', async () => {
    render(<Layout />);

    expect(await screen.findByRole('main')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Home' })).not.toBeInTheDocument();
    expect(screen.queryByText('GarageFlow App')).not.toBeInTheDocument();
    expect(screen.queryByText('Static prototype')).not.toBeInTheDocument();
  });
});
