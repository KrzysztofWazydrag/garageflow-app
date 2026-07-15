import { CallbackQueueItem } from '../WorkshopTimeline.types';

type CallbackDirectoryProps = {
  callbackItems: CallbackQueueItem[];
  formatUtcTime: (isoTimestamp: string) => string;
};

const callbackStatusLabels: Record<CallbackQueueItem['status'], string> = {
  Overdue: 'Overdue callback',
  DueToday: 'Due today',
  Done: 'Callback done',
};

export const CallbackDirectory = ({ callbackItems, formatUtcTime }: CallbackDirectoryProps) => (
  <section className="garage-workspace__directory-panel" aria-labelledby="callbacks-heading">
    <div className="garage-workspace__section-heading">
      <p className="garage-workspace__eyebrow">Follow-up</p>
      <h1 id="callbacks-heading">Callbacks</h1>
      <p>Overdue calls first, then calls due later today and completed follow-ups.</p>
    </div>

    <div
      className="garage-workspace__table garage-workspace__table--callbacks"
      role="table"
      aria-label="Callback follow-up list"
    >
      <div className="garage-workspace__table-row garage-workspace__table-row--head" role="row">
        <span role="columnheader">State</span>
        <span role="columnheader">Registration</span>
        <span role="columnheader">Customer / job</span>
        <span role="columnheader">Time</span>
      </div>

      {callbackItems.map((callbackItem) => (
        <div className="garage-workspace__table-row" role="row" key={callbackItem.id}>
          <span
            className={`garage-workspace__callback-chip garage-workspace__callback-chip--${callbackItem.status.toLowerCase()}`}
            role="cell"
          >
            {callbackStatusLabels[callbackItem.status]}
          </span>
          <span role="cell">{callbackItem.registration}</span>
          <span role="cell">
            {callbackItem.customerName} · {callbackItem.title}
          </span>
          <span role="cell">
            {callbackItem.status === 'Done' && callbackItem.completedAt
              ? `Contacted ${formatUtcTime(callbackItem.completedAt)}`
              : callbackItem.dueAt
                ? `Due ${formatUtcTime(callbackItem.dueAt)}`
                : 'No time'}
          </span>
        </div>
      ))}
    </div>
  </section>
);
