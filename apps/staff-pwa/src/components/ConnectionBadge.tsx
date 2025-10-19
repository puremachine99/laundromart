import { useEffect, useState } from 'react';

export default function ConnectionBadge() {
  const [online, setOnline] = useState<boolean>(() => navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <span className={`pill ${online ? 'pill--running' : 'pill--offline'}`}>
      {online ? 'Online' : 'Offline'}
    </span>
  );
}
