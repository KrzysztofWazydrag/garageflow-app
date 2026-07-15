import { Outlet } from '@tanstack/react-router';
import './Layout.css';

export const Layout = () => {
  return (
    <div className="app">
      <main className="app__main">
        <Outlet />
      </main>
    </div>
  );
};
