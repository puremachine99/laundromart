import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'LaundroMart Owner Console',
  description:
    'Monitor branches, configure pricing, and gain insight into machine telemetry across the LaundroMart network.'
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <header className="app-header">
            <div className="app-header__inner">
              <h1 className="app-title">LaundroMart Owner Console</h1>
              <p className="app-subtitle">
                Real-time occupancy, payment reconciliation, and operational controls.
              </p>
            </div>
          </header>
          <main className="app-main">{children}</main>
          <footer className="app-footer">
            &copy; {new Date().getFullYear()} LaundroMart Platform
          </footer>
        </div>
      </body>
    </html>
  );
}
