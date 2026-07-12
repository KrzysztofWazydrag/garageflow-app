import { render, screen, within } from 'tests';

import { Layout } from './Layout';

describe('Layout', () => {
  test('renders the GarageFlow SPA header', async () => {
    render(<Layout />);

    const header = await screen.findByRole('banner', { name: 'GarageFlow workspace' });

    expect(within(header).getByText('GarageFlow')).toBeInTheDocument();
    expect(within(header).getByText('Workshop operations')).toBeInTheDocument();
    expect(within(header).getByText('Workshop Timeline')).toBeInTheDocument();
    expect(within(header).getByText('Static prototype')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Home' })).not.toBeInTheDocument();
    expect(screen.queryByText('GarageFlow App')).not.toBeInTheDocument();
  });
});
