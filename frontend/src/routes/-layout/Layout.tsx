import { Outlet } from '@tanstack/react-router';
import './Layout.css';

export const Layout = () => {
  return (
    <div className="app">
      <header className="app__header" aria-label="GarageFlow workspace">
        <div className="app__header-inner">
          <div className="app__brand-group">
            <p className="app__brand">GarageFlow</p>
            <p className="app__product-context">Workshop operations</p>
          </div>
          <div className="app__section" aria-label="Current section">
            <span className="app__section-name">Workshop Timeline</span>
            <span className="app__prototype-badge">Static prototype</span>
          </div>
        </div>
      </header>
      <main className="app__main">
        <Outlet />
      </main>
    </div>
  );
};
