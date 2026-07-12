import { Link, Outlet } from '@tanstack/react-router';
import './Layout.css';

export const Layout = () => {
  return (
    <div className="app">
      <header className="app__header">
        <Link className="app__brand" to={'/'}>
          GarageFlow App
        </Link>
      </header>
      <nav className="app__navigation">
        <ul className="app__menu">
          <li className="app__menu-item">
            <Link className="app__menu-link" to={'/'}>
              Home
            </Link>
          </li>
        </ul>
      </nav>
      <main className="app__main">
        <Outlet />
      </main>
    </div>
  );
};
