import { render, screen } from 'tests';

import { WorkshopTimeline } from './WorkshopTimeline';

describe('WorkshopTimeline', () => {
  test('renders the GarageFlow app shell', async () => {
    render(<WorkshopTimeline />);

    expect(await screen.findByText('GarageFlow')).toBeInTheDocument();
    expect(screen.getByText('Garage job scheduling without the paper notebook.')).toBeInTheDocument();
    expect(screen.getByText('Today')).toBeInTheDocument();
  });

  test('renders workshop summary metrics', async () => {
    render(<WorkshopTimeline />);

    expect(await screen.findByText("Today's jobs")).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getAllByText('In progress').length).toBeGreaterThan(0);
    expect(screen.getAllByText('1')).toHaveLength(3);
    expect(screen.getAllByText('Waiting for parts').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Ready for collection').length).toBeGreaterThan(0);
  });

  test('renders non-functional action buttons', async () => {
    render(<WorkshopTimeline />);

    expect(await screen.findByRole('button', { name: 'New booking Coming soon' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Print day sheet Coming soon' })).toBeDisabled();
  });

  test('renders heading and registration search', async () => {
    render(<WorkshopTimeline />);

    expect(await screen.findByRole('heading', { name: 'Workshop Timeline' })).toBeInTheDocument();
    expect(screen.getByLabelText('Quick registration search')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Home' })).not.toBeInTheDocument();
  });

  test('renders mechanic rows', async () => {
    render(<WorkshopTimeline />);

    expect(await screen.findByText('Dave')).toBeInTheDocument();
    expect(screen.getByText('Liam')).toBeInTheDocument();
    expect(screen.getByText('Sarah')).toBeInTheDocument();
  });

  test('renders static workshop jobs', async () => {
    render(<WorkshopTimeline />);

    expect(await screen.findByText('AB12 CDE')).toBeInTheDocument();
    expect(screen.getByText('08:30 - 10:00')).toBeInTheDocument();
    expect(screen.getByText('MOT Check')).toBeInTheDocument();
    expect(screen.getByText('Brake pads')).toBeInTheDocument();
    expect(screen.getByText('Diagnosis')).toBeInTheDocument();
    expect(screen.getByText('Service')).toBeInTheDocument();
    expect(screen.getAllByText('Ready for collection').length).toBeGreaterThan(0);
  });

  test('renders all planned job status badges', async () => {
    render(<WorkshopTimeline />);

    expect(await screen.findByText('Booked')).toBeInTheDocument();
    expect(screen.getByText('Checked in')).toBeInTheDocument();
    expect(screen.getByText('Diagnosing')).toBeInTheDocument();
    expect(screen.getAllByText('Waiting for parts').length).toBeGreaterThan(0);
    expect(screen.getAllByText('In progress').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Ready for collection').length).toBeGreaterThan(0);
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });
});
