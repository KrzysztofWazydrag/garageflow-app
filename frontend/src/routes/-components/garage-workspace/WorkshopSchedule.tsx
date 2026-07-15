import { JobStatus, Mechanic, TimelineHour, WorkshopCallback, WorkshopTimelineJob } from '../WorkshopTimeline.types';

import { WorkshopJobCard } from './WorkshopJobCard';

type WorkshopScheduleProps = {
  formatUtcTime: (isoTimestamp: string) => string;
  getJobsForMechanic: (mechanicId: string) => WorkshopTimelineJob[];
  getTimelineGridLine: (scheduledTime: string) => number;
  getTimelineHourGridColumn: (scheduledTime: string) => number;
  isCallbackOverdue: (callback: WorkshopCallback) => boolean;
  jobStatusCssModifiers: Record<JobStatus, string>;
  jobStatusLabels: Record<JobStatus, string>;
  jobStatusTooltips: Record<JobStatus, string>;
  mechanics: Mechanic[];
  onSelectJob: (jobId: string) => void;
  timelineHours: TimelineHour[];
};

export const WorkshopSchedule = ({
  formatUtcTime,
  getJobsForMechanic,
  getTimelineGridLine,
  getTimelineHourGridColumn,
  isCallbackOverdue,
  jobStatusCssModifiers,
  jobStatusLabels,
  jobStatusTooltips,
  mechanics,
  onSelectJob,
  timelineHours,
}: WorkshopScheduleProps) => (
  <section className="garage-workspace__schedule-panel" aria-label="Workshop schedule">
    <div className="garage-workspace__schedule-scroll">
      <div className="garage-workspace__timeline-header">
        <div className="garage-workspace__timeline-corner">Mechanic</div>
        <div className="garage-workspace__time-header">
          {timelineHours.map((timelineHour) => (
            <div
              className="garage-workspace__hour-label"
              key={timelineHour.value}
              style={{ gridColumn: getTimelineHourGridColumn(timelineHour.label) }}
            >
              {timelineHour.label}
            </div>
          ))}
        </div>
      </div>

      {mechanics.map((mechanic) => (
        <div className="garage-workspace__timeline-row" key={mechanic.id}>
          <div className="garage-workspace__mechanic-cell">{mechanic.name}</div>
          <div className="garage-workspace__timeline-lane">
            {getJobsForMechanic(mechanic.id).map((workshopJob) => (
              <WorkshopJobCard
                formatUtcTime={formatUtcTime}
                getTimelineGridLine={getTimelineGridLine}
                isCallbackOverdue={isCallbackOverdue}
                jobStatusCssModifiers={jobStatusCssModifiers}
                jobStatusLabels={jobStatusLabels}
                jobStatusTooltips={jobStatusTooltips}
                key={workshopJob.id}
                onSelectJob={onSelectJob}
                workshopJob={workshopJob}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  </section>
);
