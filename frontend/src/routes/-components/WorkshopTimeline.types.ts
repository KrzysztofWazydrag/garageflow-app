export type JobStatus =
  | 'Booked'
  | 'InWorkshop'
  | 'WaitingForCustomer'
  | 'WaitingForParts'
  | 'ReadyForCollection'
  | 'Completed'
  | 'Cancelled';

export type WorkshopCallback =
  | {
      status: 'NotRequired';
    }
  | {
      status: 'Required';
      dueAt: string;
    }
  | {
      status: 'Done';
      dueAt?: string;
      completedAt: string;
    };

export type WorkspaceView = 'Schedule' | 'Customers' | 'Callbacks';

export type Mechanic = {
  id: string;
  name: string;
};

export type TimelineHour = {
  label: string;
  value: number;
};

export type WorkshopSummaryMetric = {
  id: string;
  label: string;
  value: number;
};

export type Customer = {
  id: string;
  fullName: string;
  phoneNumber: string;
  registration: string;
  vehicleDescription: string;
  lastVisit: string;
};

export type WorkshopTimelineJob = {
  id: string;
  mechanicId: string;
  customerId: string;
  customerName: string;
  phoneNumber: string;
  registration: string;
  vehicleDescription: string;
  title: string;
  scheduledStart: string;
  scheduledEnd: string;
  status: JobStatus;
  callback: WorkshopCallback;
  notes: string;
};

export type CallbackQueueItem = {
  id: string;
  registration: string;
  customerName: string;
  title: string;
  dueAt?: string;
  completedAt?: string;
  status: 'Overdue' | 'DueToday' | 'Done';
};

export type NewJobFormValues = {
  customerId?: string;
  customerName: string;
  phoneNumber: string;
  registration: string;
  vehicleDescription: string;
  reason: string;
  mechanicId: string;
  scheduledStart: string;
  scheduledEnd: string;
  status: JobStatus;
  callbackRequired: boolean;
  callbackDueTime: string;
};
