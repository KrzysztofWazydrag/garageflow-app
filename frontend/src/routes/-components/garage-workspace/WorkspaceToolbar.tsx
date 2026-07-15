type WorkspaceToolbarProps = {
  callbackDueCount: number;
  jobCount: number;
  onSearchChange: (searchValue: string) => void;
  overdueCount: number;
  searchValue: string;
  workshopDateLabel: string;
};

export const WorkspaceToolbar = ({
  callbackDueCount,
  jobCount,
  onSearchChange,
  overdueCount,
  searchValue,
  workshopDateLabel,
}: WorkspaceToolbarProps) => (
  <section className="garage-workspace__toolbar" aria-label="Schedule controls">
    <div>
      <p className="garage-workspace__eyebrow">Today</p>
      <h1 className="garage-workspace__title">Workshop Schedule</h1>
      <p className="garage-workspace__date">{workshopDateLabel}</p>
    </div>

    <div className="garage-workspace__toolbar-controls">
      <label className="garage-workspace__search">
        <span>Search registration or customer</span>
        <input
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="AB12 CDE or customer"
          type="search"
          value={searchValue}
        />
      </label>

      <div className="garage-workspace__summary-line" aria-label="Operational summary">
        <span>{jobCount} jobs</span>
        <span>{callbackDueCount} callbacks due</span>
        <span>{overdueCount} overdue</span>
      </div>
    </div>
  </section>
);
