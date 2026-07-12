import './WorkshopTimeline.css';

import { JobStatus, Mechanic, TimelineHour, WorkshopTimelineJob } from './WorkshopTimeline.types';

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

const workshopJobs: WorkshopTimelineJob[] = [
  {
    id: 'job-1',
    mechanicId: 'dave',
    registration: 'AB12 CDE',
    title: 'MOT Check',
    scheduledStart: '08:30',
    scheduledEnd: '10:00',
    status: 'booked',
  },
  {
    id: 'job-2',
    mechanicId: 'dave',
    registration: 'MW18 LDN',
    title: 'Brake pads',
    scheduledStart: '10:30',
    scheduledEnd: '12:30',
    status: 'in-progress',
  },
  {
    id: 'job-3',
    mechanicId: 'liam',
    registration: 'YP21 MOT',
    title: 'Diagnosis',
    scheduledStart: '09:30',
    scheduledEnd: '11:30',
    status: 'diagnosing',
  },
  {
    id: 'job-4',
    mechanicId: 'liam',
    registration: 'HF09 VAN',
    title: 'Ready for collection',
    scheduledStart: '13:30',
    scheduledEnd: '15:00',
    status: 'ready-for-collection',
  },
  {
    id: 'job-5',
    mechanicId: 'sarah',
    registration: 'GF66 SRV',
    title: 'Service',
    scheduledStart: '08:00',
    scheduledEnd: '11:00',
    status: 'checked-in',
  },
  {
    id: 'job-6',
    mechanicId: 'sarah',
    registration: 'LK14 WFP',
    title: 'Parts hold',
    scheduledStart: '12:00',
    scheduledEnd: '14:00',
    status: 'waiting-for-parts',
  },
  {
    id: 'job-7',
    mechanicId: 'sarah',
    registration: 'TX70 CMP',
    title: 'Final checks',
    scheduledStart: '15:00',
    scheduledEnd: '16:30',
    status: 'completed',
  },
];

const jobStatusLabels: Record<JobStatus, string> = {
  booked: 'Booked',
  'checked-in': 'Checked in',
  diagnosing: 'Diagnosing',
  'waiting-for-parts': 'Waiting for parts',
  'in-progress': 'In progress',
  'ready-for-collection': 'Ready for collection',
  completed: 'Completed',
};

const TIMELINE_START_HOUR = 8;
const TIMELINE_SLOT_MINUTES = 30;

const getTimelineGridLine = (scheduledTime: string) => {
  const [hours, minutes] = scheduledTime.split(':').map(Number);
  const elapsedMinutes = (hours - TIMELINE_START_HOUR) * 60 + minutes;

  return elapsedMinutes / TIMELINE_SLOT_MINUTES + 1;
};

const getTimelineHourGridColumn = (scheduledTime: string) => Math.min(getTimelineGridLine(scheduledTime) + 1, 19);

const getJobsForMechanic = (mechanicId: string) =>
  workshopJobs.filter((workshopJob) => workshopJob.mechanicId === mechanicId);

const StatusBadge = ({ jobStatus }: { jobStatus: JobStatus }) => (
  <span className={`workshop-timeline__status workshop-timeline__status--${jobStatus}`}>
    {jobStatusLabels[jobStatus]}
  </span>
);

const TimelineJobBlock = ({ workshopJob }: { workshopJob: WorkshopTimelineJob }) => {
  const gridColumnStart = getTimelineGridLine(workshopJob.scheduledStart);
  const gridColumnEnd = getTimelineGridLine(workshopJob.scheduledEnd);

  return (
    <article
      className="workshop-timeline__job"
      style={{ gridColumn: `${gridColumnStart} / ${gridColumnEnd}` }}
      aria-label={`${workshopJob.registration} ${workshopJob.title}`}
    >
      <p className="workshop-timeline__job-registration">{workshopJob.registration}</p>
      <p className="workshop-timeline__job-title">{workshopJob.title}</p>
      <div className="workshop-timeline__job-meta">
        <span>
          {workshopJob.scheduledStart} - {workshopJob.scheduledEnd}
        </span>
        <StatusBadge jobStatus={workshopJob.status} />
      </div>
    </article>
  );
};

export const WorkshopTimeline = () => {
  return (
    <section className="workshop-timeline" aria-labelledby="workshop-timeline-title">
      <div className="workshop-timeline__header">
        <div>
          <h1 className="workshop-timeline__title" id="workshop-timeline-title">
            Workshop Timeline
          </h1>
          <p className="workshop-timeline__subtitle">Today&apos;s garage schedule by mechanic and job status.</p>
        </div>
        <div className="workshop-timeline__search">
          <label htmlFor="registration-search">Quick registration search</label>
          <input id="registration-search" name="registration-search" placeholder="AB12 CDE" type="search" />
        </div>
      </div>

      <div className="workshop-timeline__board" aria-label="Workshop schedule">
        <div className="workshop-timeline__header-row">
          <div className="workshop-timeline__corner">Mechanic</div>
          {timelineHours.map((timelineHour) => (
            <div
              className="workshop-timeline__hour"
              key={timelineHour.value}
              style={{ gridColumn: getTimelineHourGridColumn(timelineHour.label) }}
            >
              {timelineHour.label}
            </div>
          ))}
        </div>

        {mechanics.map((mechanic) => (
          <div className="workshop-timeline__row" key={mechanic.id}>
            <div className="workshop-timeline__mechanic">{mechanic.name}</div>
            <div className="workshop-timeline__lane">
              {getJobsForMechanic(mechanic.id).map((workshopJob) => (
                <TimelineJobBlock key={workshopJob.id} workshopJob={workshopJob} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
