import { CallbackQueueItem } from '../WorkshopTimeline.types';

type CallbackQueueProps = {
  callbackItems: CallbackQueueItem[];
  formatUtcTime: (isoTimestamp: string) => string;
  onMarkCallbackDone: (jobId: string) => void;
  onSelectJob: (jobId: string) => void;
};

export const CallbackQueue = ({
  callbackItems,
  formatUtcTime,
  onMarkCallbackDone,
  onSelectJob,
}: CallbackQueueProps) => (
  <aside className="garage-workspace__callback-panel" aria-label="Callback queue">
    <div className="garage-workspace__panel-heading">
      <h2>Callback queue</h2>
      <p>Due calls for today</p>
    </div>

    <div className="garage-workspace__callback-list">
      {callbackItems.length > 0 ? (
        callbackItems.map((callbackItem) => (
          <article
            aria-label={`${callbackItem.registration} ${
              callbackItem.status === 'Overdue' ? 'Overdue callback' : 'Callback due'
            }`}
            className={`garage-workspace__callback-item garage-workspace__callback-item--${callbackItem.status.toLowerCase()}`}
            key={callbackItem.id}
          >
            <button
              className="garage-workspace__callback-open"
              onClick={() => onSelectJob(callbackItem.id)}
              type="button"
            >
              <span>
                <span className="garage-workspace__callback-state">
                  {callbackItem.status === 'Overdue' ? 'Overdue' : 'Due today'}
                </span>
                <span className="garage-workspace__callback-registration">{callbackItem.registration}</span>
                <span className="garage-workspace__callback-copy">
                  {callbackItem.customerName} · {callbackItem.title}
                </span>
              </span>
              {callbackItem.dueAt && <span>{formatUtcTime(callbackItem.dueAt)}</span>}
            </button>
            <button
              aria-label={`Mark callback for ${callbackItem.registration} as contacted`}
              className="garage-workspace__mini-action"
              onClick={() => onMarkCallbackDone(callbackItem.id)}
              type="button"
            >
              Mark contacted
            </button>
          </article>
        ))
      ) : (
        <p className="garage-workspace__empty-state">No callbacks due today.</p>
      )}
    </div>
  </aside>
);
