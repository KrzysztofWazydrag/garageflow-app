import { render, screen } from 'tests';

import { Home } from './Home';

describe('Home', () => {
  test('renders the workshop timeline shell', async () => {
    render(<Home />);

    expect(await screen.findByRole('heading', { name: 'Workshop Timeline' })).toBeInTheDocument();
    expect(screen.getByLabelText('Quick registration search')).toBeInTheDocument();
  });
});
