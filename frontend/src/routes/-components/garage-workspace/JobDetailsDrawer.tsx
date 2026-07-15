import { FormEvent, useEffect, useMemo, useState } from 'react';

import { JobStatus, Mechanic, WorkshopTimelineJob } from '../WorkshopTimeline.types';

import { Tooltip } from './Tooltip';

type JobTransitionAction = {
  label: string;
  nextStatus: JobStatus;
  variant?: 'danger';
};

type JobDetailsDrawerProps = {
  formatUtcTime: (isoTimestamp: string) => string;
  isCallbackOverdue: (callback: WorkshopTimelineJob['callback']) => boolean;
  jobStatusLabels: Record<JobStatus, string>;
  jobStatusTooltips: Record<JobStatus, string>;
  mechanics: Mechanic[];
  onClose: () => void;
  onMarkCallbackDone: (jobId: string) => void;
  onScheduleCallback: (jobId: string, dueDate: string, dueTime: string) => void;
  onUpdateJobNotes: (jobId: string, notes: string) => void;
  onUpdateJobStatus: (jobId: string, nextStatus: JobStatus) => void;
  workshopJob: WorkshopTimelineJob | undefined;
  workshopDay: string;
};

const transitionActionsByStatus: Record<JobStatus, JobTransitionAction[]> = {
  Booked: [
    { label: 'Start job', nextStatus: 'InWorkshop' },
    { label: 'Cancel job', nextStatus: 'Cancelled', variant: 'danger' },
  ],
  InWorkshop: [
    { label: 'Waiting for customer', nextStatus: 'WaitingForCustomer' },
    { label: 'Waiting for parts', nextStatus: 'WaitingForParts' },
    { label: 'Ready for collection', nextStatus: 'ReadyForCollection' },
    { label: 'Cancel job', nextStatus: 'Cancelled', variant: 'danger' },
  ],
  WaitingForCustomer: [
    { label: 'Resume work', nextStatus: 'InWorkshop' },
    { label: 'Ready for collection', nextStatus: 'ReadyForCollection' },
    { label: 'Cancel job', nextStatus: 'Cancelled', variant: 'danger' },
  ],
  WaitingForParts: [
    { label: 'Resume work', nextStatus: 'InWorkshop' },
    { label: 'Ready for collection', nextStatus: 'ReadyForCollection' },
    { label: 'Cancel job', nextStatus: 'Cancelled', variant: 'danger' },
  ],
  ReadyForCollection: [
    { label: 'Complete job', nextStatus: 'Completed' },
    { label: 'Resume work', nextStatus: 'InWorkshop' },
  ],
  Completed: [],
  Cancelled: [],
};

export const JobDetailsDrawer = ({
  formatUtcTime,
  isCallbackOverdue,
  jobStatusLabels,
  jobStatusTooltips,
  mechanics,
  onClose,
  onMarkCallbackDone,
  onScheduleCallback,
  onUpdateJobNotes,
  onUpdateJobStatus,
  workshopDay,
  workshopJob,
}: JobDetailsDrawerProps) => {
  const [isAddingCallback, setIsAddingCallback] = useState(false);
  const [callbackDueDate, setCallbackDueDate] = useState(workshopDay);
  const [callbackDueTime, setCallbackDueTime] = useState('15:00');

  useEffect(() => {
    if (!workshopJob) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, workshopJob]);

  useEffect(() => {
    if (workshopJob?.callback.status === 'Required') {
      setCallbackDueDate(workshopJob.callback.dueAt.slice(0, 10));
      setCallbackDueTime(formatUtcTime(workshopJob.callback.dueAt));
    } else {
      setCallbackDueDate(workshopDay);
      setCallbackDueTime('15:00');
      setIsAddingCallback(false);
    }
  }, [formatUtcTime, workshopDay, workshopJob]);

  const mechanicName = useMemo(
    () => mechanics.find((mechanic) => mechanic.id === workshopJob?.mechanicId)?.name ?? 'Unassigned',
    [mechanics, workshopJob],
  );

  if (!workshopJob) {
    return null;
  }

  const transitionActions = transitionActionsByStatus[workshopJob.status];
  const currentStatusLabel = jobStatusLabels[workshopJob.status];
  const currentStatusTooltip = jobStatusTooltips[workshopJob.status];

  const handleCallbackSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onScheduleCallback(workshopJob.id, callbackDueDate, callbackDueTime);
    setIsAddingCallback(false);
  };

  return (
    <div className="garage-workspace__drawer-backdrop">
      <aside aria-labelledby="job-details-heading" aria-modal="true" className="garage-workspace__drawer" role="dialog">
        <div className="garage-workspace__drawer-header">
          <div>
            <p className="garage-workspace__eyebrow">Workshop job</p>
            <h2 id="job-details-heading">{workshopJob.registration}</h2>
          </div>
          <Tooltip text="Close job details">
            <button
              aria-label="Close job details"
              className="garage-workspace__icon-button"
              onClick={onClose}
              type="button"
            >
              x
            </button>
          </Tooltip>
        </div>

        <div className="garage-workspace__detail-stack">
          <section className="garage-workspace__detail-card" aria-label="Job details">
            <p>
              <strong>{workshopJob.customerName}</strong>
              <span>{workshopJob.phoneNumber}</span>
            </p>
            <p>
              <strong>{workshopJob.vehicleDescription}</strong>
              <span>{workshopJob.title}</span>
            </p>
            <p>
              <strong>{mechanicName}</strong>
              <span>
                {workshopJob.scheduledStart} - {workshopJob.scheduledEnd}
              </span>
            </p>
            <p>
              <strong>Current status</strong>
              <Tooltip text={currentStatusTooltip}>
                <span className="garage-workspace__inline-badge">{currentStatusLabel}</span>
              </Tooltip>
            </p>
          </section>

          <section className="garage-workspace__detail-card" aria-label="Job workflow actions">
            <h3>Workflow</h3>
            {transitionActions.length > 0 ? (
              <div className="garage-workspace__action-grid">
                {transitionActions.map((transitionAction) => (
                  <button
                    className={
                      transitionAction.variant === 'danger'
                        ? 'garage-workspace__danger-action'
                        : 'garage-workspace__secondary-action'
                    }
                    key={transitionAction.label}
                    onClick={() => onUpdateJobStatus(workshopJob.id, transitionAction.nextStatus)}
                    type="button"
                  >
                    {transitionAction.label}
                  </button>
                ))}
              </div>
            ) : (
              <p className="garage-workspace__empty-state">No further status actions for this job.</p>
            )}
          </section>

          <section className="garage-workspace__detail-card" aria-label="Callback controls">
            <h3>Callback</h3>
            {workshopJob.callback.status === 'NotRequired' && !isAddingCallback && (
              <button
                className="garage-workspace__secondary-action"
                onClick={() => setIsAddingCallback(true)}
                type="button"
              >
                Add callback
              </button>
            )}

            {(isAddingCallback || workshopJob.callback.status === 'Required') && (
              <form className="garage-workspace__compact-form" onSubmit={handleCallbackSubmit}>
                {workshopJob.callback.status === 'Required' && (
                  <p className={isCallbackOverdue(workshopJob.callback) ? 'garage-workspace__danger-copy' : undefined}>
                    {isCallbackOverdue(workshopJob.callback) ? 'Overdue callback' : 'Callback required'} · Due{' '}
                    {formatUtcTime(workshopJob.callback.dueAt)}
                  </p>
                )}
                <label>
                  <span>Callback due date</span>
                  <input
                    onChange={(event) => setCallbackDueDate(event.target.value)}
                    required
                    type="date"
                    value={callbackDueDate}
                  />
                </label>
                <label>
                  <span>Callback due time</span>
                  <input
                    onChange={(event) => setCallbackDueTime(event.target.value)}
                    required
                    type="time"
                    value={callbackDueTime}
                  />
                </label>
                <div className="garage-workspace__drawer-actions">
                  <button className="garage-workspace__secondary-action" type="submit">
                    {workshopJob.callback.status === 'Required' ? 'Update callback' : 'Save callback'}
                  </button>
                  {workshopJob.callback.status === 'Required' && (
                    <button
                      className="garage-workspace__primary-action"
                      onClick={() => onMarkCallbackDone(workshopJob.id)}
                      type="button"
                    >
                      Mark as contacted
                    </button>
                  )}
                </div>
              </form>
            )}

            {workshopJob.callback.status === 'Done' && (
              <p className="garage-workspace__success-copy">
                Callback done · Contacted {formatUtcTime(workshopJob.callback.completedAt)}
              </p>
            )}
          </section>

          <label className="garage-workspace__notes-field">
            <span>Visit notes</span>
            <textarea
              onChange={(event) => onUpdateJobNotes(workshopJob.id, event.target.value)}
              rows={4}
              value={workshopJob.notes}
            />
          </label>
        </div>
      </aside>
    </div>
  );
};
