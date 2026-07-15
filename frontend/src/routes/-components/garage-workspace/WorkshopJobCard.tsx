import { JobStatus, WorkshopCallback, WorkshopTimelineJob } from '../WorkshopTimeline.types';

import { Tooltip } from './Tooltip';

type WorkshopJobCardProps = {
  formatUtcTime: (isoTimestamp: string) => string;
  getTimelineGridLine: (scheduledTime: string) => number;
  isCallbackOverdue: (callback: WorkshopCallback) => boolean;
  jobStatusCssModifiers: Record<JobStatus, string>;
  jobStatusLabels: Record<JobStatus, string>;
  jobStatusTooltips: Record<JobStatus, string>;
  onSelectJob: (jobId: string) => void;
  workshopJob: WorkshopTimelineJob;
};

const CallbackStatus = ({
  formatUtcTime,
  isCallbackOverdue,
  workshopCallback,
}: Pick<WorkshopJobCardProps, 'formatUtcTime' | 'isCallbackOverdue'> & {
  workshopCallback: WorkshopCallback;
}) => {
  if (workshopCallback.status === 'NotRequired') {
    return null;
  }

  if (workshopCallback.status === 'Done') {
    return (
      <p className="garage-workspace__job-callback garage-workspace__job-callback--done">
        Callback done
        <span>Contacted {formatUtcTime(workshopCallback.completedAt)}</span>
      </p>
    );
  }

  const isOverdue = isCallbackOverdue(workshopCallback);

  return (
    <p
      className={`garage-workspace__job-callback ${
        isOverdue ? 'garage-workspace__job-callback--overdue' : 'garage-workspace__job-callback--required'
      }`}
    >
      <span>{isOverdue ? 'Overdue callback' : 'Callback required'}</span>
      <span>Due {formatUtcTime(workshopCallback.dueAt)}</span>
    </p>
  );
};

export const WorkshopJobCard = ({
  formatUtcTime,
  getTimelineGridLine,
  isCallbackOverdue,
  jobStatusCssModifiers,
  jobStatusLabels,
  jobStatusTooltips,
  onSelectJob,
  workshopJob,
}: WorkshopJobCardProps) => {
  const gridColumnStart = getTimelineGridLine(workshopJob.scheduledStart);
  const gridColumnEnd = getTimelineGridLine(workshopJob.scheduledEnd);
  const isOverdue = isCallbackOverdue(workshopJob.callback);
  const jobStatusLabel = jobStatusLabels[workshopJob.status];
  const statusModifier = jobStatusCssModifiers[workshopJob.status];
  const jobAriaLabel = `${workshopJob.registration} ${jobStatusLabel}${isOverdue ? ' Overdue callback' : ''}`;

  return (
    <article
      aria-label={jobAriaLabel}
      className={`garage-workspace__job-card garage-workspace__job-card--${statusModifier}${
        isOverdue ? ' garage-workspace__job-card--overdue' : ''
      }`}
      style={{ gridColumn: `${gridColumnStart} / ${gridColumnEnd}` }}
    >
      <button className="garage-workspace__job-button" onClick={() => onSelectJob(workshopJob.id)} type="button">
        <div className="garage-workspace__job-card-header">
          <p className="garage-workspace__job-registration">{workshopJob.registration}</p>
          <Tooltip text={jobStatusTooltips[workshopJob.status]}>
            <span className={`garage-workspace__status garage-workspace__status--${statusModifier}`}>
              {jobStatusLabel}
            </span>
          </Tooltip>
        </div>
        <p className="garage-workspace__job-title">{workshopJob.title}</p>
        <p className="garage-workspace__job-meta">
          {workshopJob.scheduledStart} - {workshopJob.scheduledEnd} · {workshopJob.customerName}
        </p>
        <CallbackStatus
          formatUtcTime={formatUtcTime}
          isCallbackOverdue={isCallbackOverdue}
          workshopCallback={workshopJob.callback}
        />
      </button>
    </article>
  );
};
