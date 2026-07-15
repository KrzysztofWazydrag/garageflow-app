import userEvent from '@testing-library/user-event';

import { render, screen, within } from 'tests';

import { WorkshopTimeline } from './WorkshopTimeline';

const renderWorkspace = async () => {
  render(<WorkshopTimeline />);

  await screen.findByRole('banner', { name: 'GarageFlow workspace' });
};

const openJob = async (registration: string) => {
  const user = userEvent.setup();
  const jobArticle = within(screen.getByLabelText('Workshop schedule')).getByRole('article', {
    name: new RegExp(registration),
  });

  await user.click(within(jobArticle).getByRole('button'));

  return user;
};

describe('WorkshopTimeline', () => {
  test('shows the schedule workspace by default with derived counts', async () => {
    await renderWorkspace();

    expect(screen.getByRole('heading', { name: 'Workshop Schedule' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Schedule' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByLabelText('Operational summary')).toHaveTextContent('7 jobs');
    expect(screen.getByLabelText('Operational summary')).toHaveTextContent('2 callbacks due');
    expect(screen.getByLabelText('Operational summary')).toHaveTextContent('1 overdue');
    expect(screen.getByLabelText('Callback queue')).toBeInTheDocument();
    expect(screen.getByLabelText('Workshop schedule')).toBeInTheDocument();
    expect(screen.getByLabelText('Callback queue')).not.toBe(screen.getByLabelText('Workshop schedule'));
  });

  test('renders simplified statuses and removes old status labels', async () => {
    await renderWorkspace();

    expect(screen.getByText('Booked')).toBeInTheDocument();
    expect(screen.getByText('In workshop')).toBeInTheDocument();
    expect(screen.getAllByText('Waiting for customer').length).toBeGreaterThan(0);
    expect(screen.getByText('Waiting for parts')).toBeInTheDocument();
    expect(screen.getAllByText('Ready for collection').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Completed').length).toBeGreaterThan(0);
    expect(screen.getByText('Cancelled')).toBeInTheDocument();
    expect(screen.queryByText('Checked in')).not.toBeInTheDocument();
    expect(screen.queryByText('Diagnosing')).not.toBeInTheDocument();
    expect(screen.queryByText('In progress')).not.toBeInTheDocument();
  });

  test('opens and closes job details drawer', async () => {
    await renderWorkspace();
    const user = await openJob('AB12 CDE');

    expect(await screen.findByRole('dialog', { name: 'AB12 CDE' })).toBeInTheDocument();
    expect(screen.getByText('Noah Turner')).toBeInTheDocument();
    expect(screen.getByText('07700 900101')).toBeInTheDocument();
    expect(screen.getByLabelText('Visit notes')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Close job details' }));

    expect(screen.queryByRole('dialog', { name: 'AB12 CDE' })).not.toBeInTheDocument();
  });

  test('runs contextual status workflow actions', async () => {
    await renderWorkspace();
    const user = await openJob('AB12 CDE');

    await user.click(await screen.findByRole('button', { name: 'Start job' }));
    expect(screen.getByLabelText('Job details')).toHaveTextContent('In workshop');

    await user.click(screen.getByRole('button', { name: 'Waiting for customer' }));
    expect(screen.getByLabelText('Job details')).toHaveTextContent('Waiting for customer');

    await user.click(screen.getByRole('button', { name: 'Resume work' }));
    expect(screen.getByLabelText('Job details')).toHaveTextContent('In workshop');

    await user.click(screen.getByRole('button', { name: 'Ready for collection' }));
    expect(screen.getByLabelText('Job details')).toHaveTextContent('Ready for collection');

    await user.click(screen.getByRole('button', { name: 'Complete job' }));
    expect(screen.getByLabelText('Job details')).toHaveTextContent('Completed');
    expect(screen.queryByRole('button', { name: 'Cancel job' })).not.toBeInTheDocument();
  });

  test('cancel job changes an active job to cancelled', async () => {
    await renderWorkspace();
    const user = await openJob('MW18 LDN');

    await user.click(await screen.findByRole('button', { name: 'Cancel job' }));

    expect(screen.getByLabelText('Job details')).toHaveTextContent('Cancelled');
    expect(screen.queryByRole('button', { name: 'Start job' })).not.toBeInTheDocument();
  });

  test('callback can be added and then marked as contacted from job details', async () => {
    await renderWorkspace();
    const user = await openJob('AB12 CDE');

    await user.click(await screen.findByRole('button', { name: 'Add callback' }));
    await user.clear(screen.getByLabelText('Callback due time'));
    await user.type(screen.getByLabelText('Callback due time'), '11:00');
    await user.click(screen.getByRole('button', { name: 'Save callback' }));

    expect(screen.getByLabelText('Operational summary')).toHaveTextContent('3 callbacks due');
    expect(screen.getByLabelText('Operational summary')).toHaveTextContent('2 overdue');
    expect(screen.getByLabelText('Callback queue')).toHaveTextContent('AB12 CDE');

    await user.click(screen.getByRole('button', { name: 'Mark as contacted' }));

    expect(screen.getByText('Callback done · Contacted 12:00')).toBeInTheDocument();
    expect(screen.getByLabelText('Operational summary')).toHaveTextContent('2 callbacks due');
    expect(screen.queryByRole('article', { name: /AB12 CDE Overdue callback/ })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Callbacks' }));
    expect(await screen.findByRole('table', { name: 'Callback follow-up list' })).toHaveTextContent('AB12 CDE');
    expect(screen.getAllByText('Callback done').length).toBeGreaterThan(0);
  });

  test('callback queue opens jobs and can mark callbacks as contacted directly', async () => {
    const user = userEvent.setup();

    await renderWorkspace();
    await user.click(
      within(screen.getByLabelText('Callback queue')).getByRole('button', {
        name: /^Overdue YP21 MOT/,
      }),
    );

    expect(await screen.findByRole('dialog', { name: 'YP21 MOT' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Close job details' }));
    await user.click(screen.getByRole('button', { name: 'Mark callback for YP21 MOT as contacted' }));

    expect(screen.queryByRole('article', { name: /YP21 MOT Overdue callback/ })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Callbacks' }));
    const callbackTable = await screen.findByRole('table', { name: 'Callback follow-up list' });
    const callbackRows = within(callbackTable).getAllByRole('row');

    expect(within(callbackRows[1]).getByText('Due today')).toBeInTheDocument();
    expect(within(callbackRows[1]).getByText('MW18 LDN')).toBeInTheDocument();
    expect(callbackTable).toHaveTextContent('YP21 MOT');
    expect(callbackTable).toHaveTextContent('Callback done');
  });

  test('status tooltip is connected to keyboard-focusable badge', async () => {
    await renderWorkspace();
    const user = await openJob('AB12 CDE');

    const closeButton = screen.getByRole('button', { name: 'Close job details' });
    expect(closeButton).toHaveAccessibleDescription('Close job details');

    await user.tab();
    expect(screen.getByRole('tooltip', { name: 'Close job details' })).toBeInTheDocument();
  });

  test('customers navigation and search work by name phone and registration', async () => {
    const user = userEvent.setup();

    await renderWorkspace();
    await user.click(screen.getByRole('button', { name: 'Customers' }));

    expect(await screen.findByRole('heading', { name: 'Customers' })).toBeInTheDocument();
    const customerSearch = screen.getByLabelText('Search customers');

    await user.type(customerSearch, 'Amelia');
    expect(screen.getByText('Amelia Clarke')).toBeInTheDocument();
    expect(screen.queryByText('Maya Wilson')).not.toBeInTheDocument();

    await user.clear(customerSearch);
    await user.type(customerSearch, '07700 900202');
    expect(screen.getByText('Maya Wilson')).toBeInTheDocument();

    await user.clear(customerSearch);
    await user.type(customerSearch, 'yp21');
    expect(screen.getByText('Amelia Clarke')).toBeInTheDocument();

    await user.clear(customerSearch);
    await user.type(customerSearch, 'not a customer');
    expect(screen.getByText('No customers match that search.')).toBeInTheDocument();
  });

  test('new job opens with existing customer search and supports multiple search modes', async () => {
    const user = userEvent.setup();

    await renderWorkspace();
    await user.click(screen.getByRole('button', { name: '+ New job' }));

    const customerSearch = await screen.findByLabelText('Find customer or vehicle');
    expect(customerSearch).toBeInTheDocument();
    expect(screen.queryByLabelText('Customer name')).not.toBeInTheDocument();
    expect(screen.getByText('Recent customers')).toBeInTheDocument();
    expect(screen.queryByLabelText('Status')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add job' })).toBeDisabled();

    await user.type(customerSearch, 'Amelia');
    expect(screen.getByText('Search results')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Amelia Clarke/ })).toBeInTheDocument();

    await user.clear(customerSearch);
    await user.type(customerSearch, '07700 900303');
    expect(screen.getByRole('option', { name: /Amelia Clarke/ })).toBeInTheDocument();

    await user.clear(customerSearch);
    await user.type(customerSearch, 'yp21mot');
    expect(screen.getByRole('option', { name: /YP21 MOT/ })).toBeInTheDocument();

    await user.clear(customerSearch);
    await user.type(customerSearch, 'missing person');
    expect(screen.getByText('No matching customer. Add new customer instead.')).toBeInTheDocument();
  });

  test('existing customer quick job flow adds a booked job without retyping customer details', async () => {
    const user = userEvent.setup();

    await renderWorkspace();
    await user.click(screen.getByRole('button', { name: '+ New job' }));
    await user.type(await screen.findByLabelText('Find customer or vehicle'), 'YP21 MOT');
    await user.click(screen.getByRole('option', { name: /Amelia Clarke/ }));

    expect(screen.getByLabelText('Selected customer')).toHaveTextContent('Amelia Clarke');
    expect(screen.queryByLabelText('Customer name')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Phone number')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Vehicle registration')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Status')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Callback due time')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add job' })).toBeDisabled();

    await user.type(screen.getByLabelText('Reason for visit'), 'Battery check');
    expect(screen.getByRole('button', { name: 'Add job' })).toBeEnabled();
    await user.click(screen.getByRole('button', { name: 'Add job' }));

    expect(screen.queryByRole('dialog', { name: 'New job' })).not.toBeInTheDocument();
    expect(screen.getByLabelText('Operational summary')).toHaveTextContent('8 jobs');
    expect(screen.getAllByText('YP21 MOT').length).toBeGreaterThan(0);
    expect(screen.getByText('Battery check')).toBeInTheDocument();
    const schedule = screen.getByLabelText('Workshop schedule');
    const addedJob = within(schedule).getByRole('article', { name: /YP21 MOT Booked/ });

    expect(addedJob).toHaveTextContent('Battery check');
    expect(addedJob).toHaveTextContent('Amelia Clarke');
  });

  test('callback due time is required before adding a callback job', async () => {
    const user = userEvent.setup();

    await renderWorkspace();
    await user.click(screen.getByRole('button', { name: '+ New job' }));
    await user.type(await screen.findByLabelText('Find customer or vehicle'), 'YP21 MOT');
    await user.click(screen.getByRole('option', { name: /Amelia Clarke/ }));
    await user.type(screen.getByLabelText('Reason for visit'), 'Battery check');

    expect(screen.getByRole('button', { name: 'Add job' })).toBeEnabled();

    await user.click(screen.getByLabelText('Callback required'));
    await user.clear(screen.getByLabelText('Callback due time'));

    expect(screen.getByRole('button', { name: 'Add job' })).toBeDisabled();

    await user.type(screen.getByLabelText('Callback due time'), '15:30');

    expect(screen.getByRole('button', { name: 'Add job' })).toBeEnabled();
  });

  test('new job can move through start job, callback creation, and mark contacted flow', async () => {
    const user = userEvent.setup();

    await renderWorkspace();
    await user.click(screen.getByRole('button', { name: '+ New job' }));
    await user.type(await screen.findByLabelText('Find customer or vehicle'), 'YP21 MOT');
    await user.click(screen.getByRole('option', { name: /Amelia Clarke/ }));
    await user.type(screen.getByLabelText('Reason for visit'), 'Battery check');
    await user.click(screen.getByRole('button', { name: 'Add job' }));

    const schedule = screen.getByLabelText('Workshop schedule');
    const addedJob = within(schedule).getByRole('article', { name: /YP21 MOT Booked/ });

    await user.click(within(addedJob).getByRole('button'));
    await user.click(await screen.findByRole('button', { name: 'Start job' }));

    expect(screen.getByLabelText('Job details')).toHaveTextContent('In workshop');

    await user.click(screen.getByRole('button', { name: 'Add callback' }));
    await user.clear(screen.getByLabelText('Callback due time'));
    await user.type(screen.getByLabelText('Callback due time'), '15:30');
    await user.click(screen.getByRole('button', { name: 'Save callback' }));

    expect(screen.getByLabelText('Callback queue')).toHaveTextContent('YP21 MOT');

    await user.click(screen.getByRole('button', { name: 'Mark as contacted' }));

    expect(screen.getByLabelText('Callback queue')).not.toHaveTextContent('Battery check');
    expect(screen.getByText(/Callback done · Contacted/)).toBeInTheDocument();
  });

  test('new job can switch between selected customer, search, and new customer modes', async () => {
    const user = userEvent.setup();

    await renderWorkspace();
    await user.click(screen.getByRole('button', { name: '+ New job' }));
    await user.type(await screen.findByLabelText('Find customer or vehicle'), 'Maya');
    await user.click(screen.getByRole('option', { name: /Maya Wilson/ }));
    await user.click(screen.getByRole('button', { name: 'Change' }));

    expect(screen.getByLabelText('Find customer or vehicle')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Add new customer instead' }));

    expect(screen.getByLabelText('Customer name')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone number')).toBeInTheDocument();
    expect(screen.getByLabelText('Vehicle registration')).toBeInTheDocument();
    expect(screen.getByLabelText('Make/model')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Find existing customer instead' }));

    expect(screen.getByLabelText('Find customer or vehicle')).toBeInTheDocument();
  });
});
