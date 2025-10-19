import { useMemo } from 'react';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { useMachineStore } from '../store/useMachineStore';

export default function Dashboard() {
  const machines = useMachineStore((state) => state.machines);
  const sessions = useMachineStore((state) => state.sessions);

  const stats = useMemo(() => {
    const total = machines.length;
    const running = machines.filter((machine) => machine.status === 'running').length;
    const idle = machines.filter((machine) => machine.status === 'idle').length;
    const offline = machines.filter((machine) => machine.status === 'offline').length;
    const faulted = machines.filter((machine) => machine.status === 'faulted').length;

    return { total, running, idle, offline, faulted };
  }, [machines]);

  return (
    <div className="dashboard-grid">
      <section className="card">
        <h2 className="card__title">Live Overview</h2>
        <p className="card__meta">
          Monitor machine availability and spot issues before they impact customers.
        </p>
        <div className="machine-grid">
          <SummaryRow label="Total Machines" value={stats.total} />
          <SummaryRow label="Running" value={stats.running} variant="running" />
          <SummaryRow label="Idle" value={stats.idle} variant="idle" />
          <SummaryRow label="Faulted" value={stats.faulted} variant="offline" />
        </div>
      </section>

      <section className="card">
        <h2 className="card__title">Active Sessions</h2>
        <p className="card__meta">Tap a machine for manual restart or refund actions.</p>
        {sessions.length === 0 ? (
          <p>No active sessions right now.</p>
        ) : (
          <div className="machine-grid">
            {sessions.map((session) => {
              const machine = machines.find((item) => item.id === session.machineId);
              const eta = dayjs(session.startedAt)
                .add(session.durationMinutes, 'minute')
                .format('HH:mm');

              return (
                <div key={session.id} className="machine-grid__item">
                  <div>
                    <strong>{machine?.name ?? session.machineId}</strong>
                    <p className="card__meta">
                      Remaining {Math.ceil(session.remainingSeconds / 60)} min · ETA {eta}
                    </p>
                  </div>
                  <Link className="btn" to={`/machines/${session.machineId}`}>
                    Manage
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

interface SummaryRowProps {
  label: string;
  value: number;
  variant?: 'running' | 'idle' | 'offline';
}

function SummaryRow({ label, value, variant }: SummaryRowProps) {
  return (
    <div className="machine-grid__item">
      <span>{label}</span>
      <span className={`pill ${variant ? `pill--${variant}` : ''}`}>{value}</span>
    </div>
  );
}
