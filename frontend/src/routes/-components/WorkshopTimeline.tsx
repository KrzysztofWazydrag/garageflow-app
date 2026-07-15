import { useMemo, useState } from 'react';

import './WorkshopTimeline.css';

import {
  CallbackQueueItem,
  Customer,
  JobStatus,
  Mechanic,
  NewJobFormValues,
  TimelineHour,
  WorkspaceView,
  WorkshopCallback,
  WorkshopTimelineJob,
} from './WorkshopTimeline.types';
import { CallbackDirectory } from './garage-workspace/CallbackDirectory';
import { CallbackQueue } from './garage-workspace/CallbackQueue';
import { CustomerDirectory } from './garage-workspace/CustomerDirectory';
import { JobDetailsDrawer } from './garage-workspace/JobDetailsDrawer';
import { NewJobDrawer } from './garage-workspace/NewJobDrawer';
import { WorkspaceNavigation } from './garage-workspace/WorkspaceNavigation';
import { WorkspaceToolbar } from './garage-workspace/WorkspaceToolbar';
import { WorkshopSchedule } from './garage-workspace/WorkshopSchedule';

const mechanics: Mechanic[] = [
  { id: 'dave', name: 'Dave' },
  { id: 'liam', name: 'Liam' },
  { id: 'sarah', name: 'Sarah' },
];

const timelineHours: TimelineHour[] = [
  { label: '08:00', value: 8 },
  { label: '09:00', value: 9 },
  { label: '10:00', value: 10 },
  { label: '11:00', value: 11 },
  { label: '12:00', value: 12 },
  { label: '13:00', value: 13 },
  { label: '14:00', value: 14 },
  { label: '15:00', value: 15 },
  { label: '16:00', value: 16 },
  { label: '17:00', value: 17 },
];

const initialWorkshopJobs: WorkshopTimelineJob[] = [
  {
    id: 'job-1',
    mechanicId: 'dave',
    customerId: 'customer-1',
    customerName: 'Noah Turner',
    phoneNumber: '07700 900101',
    registration: 'AB12 CDE',
    vehicleDescription: 'Ford Focus',
    title: 'MOT Check',
    scheduledStart: '08:30',
    scheduledEnd: '10:00',
    status: 'Booked',
    callback: { status: 'NotRequired' },
    notes: 'Customer asked for a quick MOT slot before lunch.',
  },
  {
    id: 'job-2',
    mechanicId: 'dave',
    customerId: 'customer-2',
    customerName: 'Maya Wilson',
    phoneNumber: '07700 900202',
    registration: 'MW18 LDN',
    vehicleDescription: 'Mini Cooper',
    title: 'Brake pads',
    scheduledStart: '10:30',
    scheduledEnd: '12:30',
    status: 'InWorkshop',
    callback: { status: 'Required', dueAt: '2026-07-15T12:00:00.000Z' },
    notes: 'Pads are worn; discs look serviceable.',
  },
  {
    id: 'job-3',
    mechanicId: 'liam',
    customerId: 'customer-3',
    customerName: 'Amelia Clarke',
    phoneNumber: '07700 900303',
    registration: 'YP21 MOT',
    vehicleDescription: 'Toyota Yaris',
    title: 'Customer approval',
    scheduledStart: '09:30',
    scheduledEnd: '11:30',
    status: 'WaitingForCustomer',
    callback: { status: 'Required', dueAt: '2026-07-15T11:30:00.000Z' },
    notes: 'Needs customer approval before extra diagnostic time.',
  },
  {
    id: 'job-4',
    mechanicId: 'liam',
    customerId: 'customer-4',
    customerName: 'Hassan Farah',
    phoneNumber: '07700 900404',
    registration: 'HF09 VAN',
    vehicleDescription: 'Transit Custom',
    title: 'Ready for collection',
    scheduledStart: '13:30',
    scheduledEnd: '15:00',
    status: 'ReadyForCollection',
    callback: {
      status: 'Done',
      dueAt: '2026-07-15T10:30:00.000Z',
      completedAt: '2026-07-15T10:45:00.000Z',
    },
    notes: 'Customer confirmed collection after 15:00.',
  },
  {
    id: 'job-5',
    mechanicId: 'sarah',
    customerId: 'customer-5',
    customerName: 'Grace Foster',
    phoneNumber: '07700 900505',
    registration: 'GF66 SRV',
    vehicleDescription: 'Volkswagen Golf',
    title: 'Service',
    scheduledStart: '08:00',
    scheduledEnd: '11:00',
    status: 'WaitingForParts',
    callback: { status: 'NotRequired' },
    notes: 'Oil filter delayed from supplier.',
  },
  {
    id: 'job-6',
    mechanicId: 'sarah',
    customerId: 'customer-6',
    customerName: 'Luca King',
    phoneNumber: '07700 900606',
    registration: 'LK14 WFP',
    vehicleDescription: 'Nissan Qashqai',
    title: 'Collection cancelled',
    scheduledStart: '12:00',
    scheduledEnd: '14:00',
    status: 'Cancelled',
    callback: { status: 'NotRequired' },
    notes: 'Customer cancelled collection booking.',
  },
  {
    id: 'job-7',
    mechanicId: 'sarah',
    customerId: 'customer-7',
    customerName: 'Tara Cross',
    phoneNumber: '07700 900707',
    registration: 'TX70 CMP',
    vehicleDescription: 'Audi A3',
    title: 'Final checks',
    scheduledStart: '15:00',
    scheduledEnd: '16:30',
    status: 'Completed',
    callback: { status: 'NotRequired' },
    notes: 'Final checks completed.',
  },
];

const jobStatusLabels: Record<JobStatus, string> = {
  Booked: 'Booked',
  InWorkshop: 'In workshop',
  WaitingForCustomer: 'Waiting for customer',
  WaitingForParts: 'Waiting for parts',
  ReadyForCollection: 'Ready for collection',
  Completed: 'Completed',
  Cancelled: 'Cancelled',
};

const jobStatusCssModifiers: Record<JobStatus, string> = {
  Booked: 'booked',
  InWorkshop: 'in-workshop',
  WaitingForCustomer: 'waiting-for-customer',
  WaitingForParts: 'waiting-for-parts',
  ReadyForCollection: 'ready-for-collection',
  Completed: 'completed',
  Cancelled: 'cancelled',
};

const jobStatusTooltips: Record<JobStatus, string> = {
  Booked: 'Job is scheduled but work has not started',
  InWorkshop: 'Vehicle is currently being worked on',
  WaitingForCustomer: 'Garage is waiting for customer approval or information',
  WaitingForParts: 'Garage is waiting for parts before work can continue',
  ReadyForCollection: 'Work is complete and vehicle can be collected',
  Completed: 'Workshop job has been completed',
  Cancelled: 'Workshop job has been cancelled',
};

const TIMELINE_START_HOUR = 8;
const TIMELINE_SLOT_MINUTES = 30;
const WORKSHOP_REFERENCE_TIME = new Date('2026-07-15T12:00:00.000Z');
const WORKSHOP_DAY = WORKSHOP_REFERENCE_TIME.toISOString().slice(0, 10);
const WORKSHOP_DATE_LABEL = 'Wednesday, 15 July 2026';

const getTimelineGridLine = (scheduledTime: string) => {
  const [hours, minutes] = scheduledTime.split(':').map(Number);
  const elapsedMinutes = (hours - TIMELINE_START_HOUR) * 60 + minutes;

  return elapsedMinutes / TIMELINE_SLOT_MINUTES + 1;
};

const getTimelineHourGridColumn = (scheduledTime: string) => Math.min(getTimelineGridLine(scheduledTime) + 1, 19);

const isDueOnWorkshopDay = (callback: WorkshopCallback) =>
  callback.status === 'Required' && callback.dueAt.slice(0, 10) === WORKSHOP_DAY;

const isCallbackOverdue = (callback: WorkshopCallback) =>
  callback.status === 'Required' && Date.parse(callback.dueAt) < WORKSHOP_REFERENCE_TIME.getTime();

const formatUtcTime = (isoTimestamp: string) => isoTimestamp.slice(11, 16);

const jobMatchesSearch = (workshopJob: WorkshopTimelineJob, searchValue: string) => {
  const normalizedSearch = searchValue.trim().toLowerCase();

  if (!normalizedSearch) {
    return true;
  }

  return [workshopJob.registration, workshopJob.customerName, workshopJob.phoneNumber, workshopJob.title].some(
    (value) => value.toLowerCase().includes(normalizedSearch),
  );
};

const getCallbackItems = (workshopJobs: WorkshopTimelineJob[]): CallbackQueueItem[] =>
  workshopJobs
    .reduce<CallbackQueueItem[]>((callbackItems, workshopJob) => {
      if (workshopJob.callback.status === 'NotRequired') {
        return callbackItems;
      }

      if (workshopJob.callback.status === 'Done') {
        callbackItems.push({
          id: workshopJob.id,
          registration: workshopJob.registration,
          customerName: workshopJob.customerName,
          title: workshopJob.title,
          dueAt: workshopJob.callback.dueAt,
          completedAt: workshopJob.callback.completedAt,
          status: 'Done',
        });

        return callbackItems;
      }

      callbackItems.push({
        id: workshopJob.id,
        registration: workshopJob.registration,
        customerName: workshopJob.customerName,
        title: workshopJob.title,
        dueAt: workshopJob.callback.dueAt,
        status: isCallbackOverdue(workshopJob.callback) ? 'Overdue' : 'DueToday',
      });

      return callbackItems;
    }, [])
    .sort((firstCallbackItem, secondCallbackItem) => {
      const statusOrder: Record<CallbackQueueItem['status'], number> = {
        Overdue: 0,
        DueToday: 1,
        Done: 2,
      };
      const statusSort = statusOrder[firstCallbackItem.status] - statusOrder[secondCallbackItem.status];

      if (statusSort !== 0) {
        return statusSort;
      }

      return (firstCallbackItem.dueAt ?? firstCallbackItem.completedAt ?? '').localeCompare(
        secondCallbackItem.dueAt ?? secondCallbackItem.completedAt ?? '',
      );
    });

const getCustomers = (workshopJobs: WorkshopTimelineJob[]): Customer[] => {
  const customersByRegistration = new Map<string, Customer>();

  workshopJobs.forEach((workshopJob) => {
    customersByRegistration.set(workshopJob.registration, {
      id: workshopJob.customerId,
      fullName: workshopJob.customerName,
      phoneNumber: workshopJob.phoneNumber,
      registration: workshopJob.registration,
      vehicleDescription: workshopJob.vehicleDescription,
      lastVisit: workshopJob.title,
    });
  });

  return Array.from(customersByRegistration.values());
};

const getLatestJobsByRegistration = (workshopJobs: WorkshopTimelineJob[]) => {
  const latestJobsByRegistration = new Map<string, WorkshopTimelineJob>();

  workshopJobs.forEach((workshopJob) => {
    latestJobsByRegistration.set(workshopJob.registration, workshopJob);
  });

  return latestJobsByRegistration;
};

const buildCallbackFromForm = (newJobFormValues: NewJobFormValues): WorkshopCallback => {
  if (!newJobFormValues.callbackRequired) {
    return { status: 'NotRequired' };
  }

  return {
    status: 'Required',
    dueAt: `${WORKSHOP_DAY}T${newJobFormValues.callbackDueTime}:00.000Z`,
  };
};

export const WorkshopTimeline = () => {
  const [activeView, setActiveView] = useState<WorkspaceView>('Schedule');
  const [scheduleSearch, setScheduleSearch] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [isNewJobDrawerOpen, setIsNewJobDrawerOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | undefined>();
  const [workshopJobs, setWorkshopJobs] = useState<WorkshopTimelineJob[]>(initialWorkshopJobs);

  const callbackItems = useMemo(() => getCallbackItems(workshopJobs), [workshopJobs]);
  const scheduleCallbackItems = callbackItems.filter((callbackItem) => callbackItem.status !== 'Done');
  const customers = useMemo(() => getCustomers(workshopJobs), [workshopJobs]);
  const latestJobsByRegistration = useMemo(() => getLatestJobsByRegistration(workshopJobs), [workshopJobs]);
  const selectedWorkshopJob = workshopJobs.find((workshopJob) => workshopJob.id === selectedJobId);
  const filteredScheduleJobs = workshopJobs.filter((workshopJob) => jobMatchesSearch(workshopJob, scheduleSearch));
  const callbackDueCount = workshopJobs.filter((workshopJob) => isDueOnWorkshopDay(workshopJob.callback)).length;
  const overdueCount = workshopJobs.filter((workshopJob) => isCallbackOverdue(workshopJob.callback)).length;

  const getJobsForMechanic = (mechanicId: string) =>
    filteredScheduleJobs.filter((workshopJob) => workshopJob.mechanicId === mechanicId);

  const getCustomerCallbackLabel = (customer: Customer) => {
    const latestJob = latestJobsByRegistration.get(customer.registration);

    if (!latestJob || latestJob.callback.status === 'NotRequired') {
      return 'No callback';
    }

    if (latestJob.callback.status === 'Done') {
      return `Callback done ${formatUtcTime(latestJob.callback.completedAt)}`;
    }

    return isCallbackOverdue(latestJob.callback)
      ? `Overdue ${formatUtcTime(latestJob.callback.dueAt)}`
      : `Due ${formatUtcTime(latestJob.callback.dueAt)}`;
  };

  const handleNewJobSubmit = (newJobFormValues: NewJobFormValues) => {
    const nextJobNumber = workshopJobs.length + 1;
    const normalizedRegistration = newJobFormValues.registration.trim().toUpperCase();

    setWorkshopJobs((currentWorkshopJobs) => [
      ...currentWorkshopJobs,
      {
        id: `job-${nextJobNumber}`,
        mechanicId: newJobFormValues.mechanicId,
        customerId: newJobFormValues.customerId ?? `customer-${nextJobNumber}`,
        customerName: newJobFormValues.customerName,
        phoneNumber: newJobFormValues.phoneNumber,
        registration: normalizedRegistration,
        vehicleDescription: newJobFormValues.vehicleDescription,
        title: newJobFormValues.reason,
        scheduledStart: newJobFormValues.scheduledStart,
        scheduledEnd: newJobFormValues.scheduledEnd,
        status: newJobFormValues.status,
        callback: buildCallbackFromForm(newJobFormValues),
        notes: '',
      },
    ]);
    setScheduleSearch('');
    setActiveView('Schedule');
    setIsNewJobDrawerOpen(false);
  };

  const updateJobStatus = (jobId: string, nextStatus: JobStatus) => {
    setWorkshopJobs((currentWorkshopJobs) =>
      currentWorkshopJobs.map((workshopJob) =>
        workshopJob.id === jobId ? { ...workshopJob, status: nextStatus } : workshopJob,
      ),
    );
  };

  const scheduleCallback = (jobId: string, dueDate: string, dueTime: string) => {
    setWorkshopJobs((currentWorkshopJobs) =>
      currentWorkshopJobs.map((workshopJob) =>
        workshopJob.id === jobId
          ? {
              ...workshopJob,
              callback: {
                status: 'Required',
                dueAt: `${dueDate}T${dueTime}:00.000Z`,
              },
            }
          : workshopJob,
      ),
    );
  };

  const markCallbackDone = (jobId: string) => {
    setWorkshopJobs((currentWorkshopJobs) =>
      currentWorkshopJobs.map((workshopJob) =>
        workshopJob.id === jobId
          ? {
              ...workshopJob,
              callback: {
                status: 'Done',
                dueAt: workshopJob.callback.status === 'Required' ? workshopJob.callback.dueAt : undefined,
                completedAt: WORKSHOP_REFERENCE_TIME.toISOString(),
              },
            }
          : workshopJob,
      ),
    );
  };

  const updateJobNotes = (jobId: string, notes: string) => {
    setWorkshopJobs((currentWorkshopJobs) =>
      currentWorkshopJobs.map((workshopJob) => (workshopJob.id === jobId ? { ...workshopJob, notes } : workshopJob)),
    );
  };

  return (
    <section className="garage-workspace" aria-label="GarageFlow workspace">
      <WorkspaceNavigation
        activeView={activeView}
        onNewJob={() => setIsNewJobDrawerOpen(true)}
        onViewChange={setActiveView}
      />

      <main className="garage-workspace__main">
        {activeView === 'Schedule' && (
          <>
            <WorkspaceToolbar
              callbackDueCount={callbackDueCount}
              jobCount={workshopJobs.length}
              onSearchChange={setScheduleSearch}
              overdueCount={overdueCount}
              searchValue={scheduleSearch}
              workshopDateLabel={WORKSHOP_DATE_LABEL}
            />

            <div className="garage-workspace__schedule-layout">
              <WorkshopSchedule
                formatUtcTime={formatUtcTime}
                getJobsForMechanic={getJobsForMechanic}
                getTimelineGridLine={getTimelineGridLine}
                getTimelineHourGridColumn={getTimelineHourGridColumn}
                isCallbackOverdue={isCallbackOverdue}
                jobStatusCssModifiers={jobStatusCssModifiers}
                jobStatusLabels={jobStatusLabels}
                jobStatusTooltips={jobStatusTooltips}
                mechanics={mechanics}
                onSelectJob={setSelectedJobId}
                timelineHours={timelineHours}
              />
              <CallbackQueue
                callbackItems={scheduleCallbackItems}
                formatUtcTime={formatUtcTime}
                onMarkCallbackDone={markCallbackDone}
                onSelectJob={setSelectedJobId}
              />
            </div>

            <p className="garage-workspace__prototype-note">Prototype data. New jobs are local until refresh.</p>
          </>
        )}

        {activeView === 'Customers' && (
          <CustomerDirectory
            customers={customers}
            getCustomerCallbackLabel={getCustomerCallbackLabel}
            latestJobsByRegistration={latestJobsByRegistration}
            onSearchChange={setCustomerSearch}
            searchValue={customerSearch}
          />
        )}

        {activeView === 'Callbacks' && (
          <CallbackDirectory callbackItems={callbackItems} formatUtcTime={formatUtcTime} />
        )}
      </main>

      <NewJobDrawer
        customers={customers}
        isOpen={isNewJobDrawerOpen}
        mechanics={mechanics}
        onClose={() => setIsNewJobDrawerOpen(false)}
        onSubmit={handleNewJobSubmit}
      />
      <JobDetailsDrawer
        formatUtcTime={formatUtcTime}
        isCallbackOverdue={isCallbackOverdue}
        jobStatusLabels={jobStatusLabels}
        jobStatusTooltips={jobStatusTooltips}
        mechanics={mechanics}
        onClose={() => setSelectedJobId(undefined)}
        onMarkCallbackDone={markCallbackDone}
        onScheduleCallback={scheduleCallback}
        onUpdateJobNotes={updateJobNotes}
        onUpdateJobStatus={updateJobStatus}
        workshopDay={WORKSHOP_DAY}
        workshopJob={selectedWorkshopJob}
      />
    </section>
  );
};
