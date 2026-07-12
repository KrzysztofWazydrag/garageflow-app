export type JobStatus =
  | 'booked'
  | 'checked-in'
  | 'diagnosing'
  | 'waiting-for-parts'
  | 'in-progress'
  | 'ready-for-collection'
  | 'completed';

export type Mechanic = {
  id: string;
  name: string;
};

export type TimelineHour = {
  label: string;
  value: number;
};

export type WorkshopTimelineJob = {
  id: string;
  mechanicId: string;
  registration: string;
  title: string;
  scheduledStart: string;
  scheduledEnd: string;
  status: JobStatus;
};
