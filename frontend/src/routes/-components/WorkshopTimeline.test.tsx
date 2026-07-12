import { render, screen } from 'tests';

import { WorkshopTimeline } from './WorkshopTimeline';

describe('WorkshopTimeline', () => {
  test('renders heading and registration search', async () => {
    render(<WorkshopTimeline />);

    expect(await screen.findByRole('heading', { name: 'Workshop Timeline' })).toBeInTheDocument();
    expect(screen.getByLabelText('Quick registration search')).toBeInTheDocument();
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
    expect(screen.getByText('Waiting for parts')).toBeInTheDocument();
    expect(screen.getByText('In progress')).toBeInTheDocument();
    expect(screen.getAllByText('Ready for collection').length).toBeGreaterThan(0);
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });
});
