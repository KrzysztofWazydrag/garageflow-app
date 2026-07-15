import { WorkspaceView } from '../WorkshopTimeline.types';

type WorkspaceNavigationProps = {
  activeView: WorkspaceView;
  onNewJob: () => void;
  onViewChange: (workspaceView: WorkspaceView) => void;
};

const workspaceViews: WorkspaceView[] = ['Schedule', 'Customers', 'Callbacks'];

export const WorkspaceNavigation = ({ activeView, onNewJob, onViewChange }: WorkspaceNavigationProps) => (
  <header className="garage-workspace__topbar" role="banner" aria-label="GarageFlow workspace">
    <div className="garage-workspace__brand-group">
      <p className="garage-workspace__brand">GarageFlow</p>
      <p className="garage-workspace__context">Workshop follow-up</p>
    </div>

    <nav className="garage-workspace__nav" aria-label="Workspace sections">
      {workspaceViews.map((workspaceView) => (
        <button
          aria-current={activeView === workspaceView ? 'page' : undefined}
          className={`garage-workspace__nav-button${
            activeView === workspaceView ? ' garage-workspace__nav-button--active' : ''
          }`}
          key={workspaceView}
          onClick={() => onViewChange(workspaceView)}
          type="button"
        >
          {workspaceView}
        </button>
      ))}
    </nav>

    <button className="garage-workspace__primary-action" onClick={onNewJob} type="button">
      + New job
    </button>
  </header>
);
