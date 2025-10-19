import { NavLink, Outlet, useNavigation } from 'react-router-dom';
import ConnectionBadge from './components/ConnectionBadge';
import InstallPrompt from './components/InstallPrompt';

export default function App() {
  const navigation = useNavigation();

  return (
    <div className="app">
      <header className="app__header">
        <div>
          <h1 className="app__title">LaundroMart Staff Console</h1>
          <p className="app__subtitle">
            Operate machines, reconcile payments, and keep service running even when offline.
          </p>
        </div>
        <div className="app__status">
          <ConnectionBadge />
          <InstallPrompt />
        </div>
      </header>

      <nav className="app__nav">
        <NavLink to="/" end>
          Dashboard
        </NavLink>
        <NavLink to="/pos">Point of Sale</NavLink>
      </nav>

      <main className="app__main" data-loading={navigation.state !== 'idle'}>
        <Outlet />
      </main>
    </div>
  );
}
