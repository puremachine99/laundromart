'use client';

import { useMemo } from 'react';

type BranchSummary = {
  id: string;
  name: string;
  machinesOnline: number;
  machinesOffline: number;
  activeSessions: number;
  revenueToday: number;
};

const sampleBranches: BranchSummary[] = [
  {
    id: 'branch-1',
    name: 'LaundroMart Senopati',
    machinesOnline: 12,
    machinesOffline: 1,
    activeSessions: 5,
    revenueToday: 185000
  },
  {
    id: 'branch-2',
    name: 'LaundroMart Kelapa Gading',
    machinesOnline: 15,
    machinesOffline: 0,
    activeSessions: 8,
    revenueToday: 232000
  }
];

export default function Page() {
  const totals = useMemo(() => {
    return sampleBranches.reduce(
      (acc, branch) => {
        acc.machinesOnline += branch.machinesOnline;
        acc.machinesOffline += branch.machinesOffline;
        acc.activeSessions += branch.activeSessions;
        acc.revenueToday += branch.revenueToday;
        return acc;
      },
      {
        machinesOnline: 0,
        machinesOffline: 0,
        activeSessions: 0,
        revenueToday: 0
      }
    );
  }, []);

  return (
    <div className="grid">
      <section className="card">
        <h2 className="card__title">Network Snapshot</h2>
        <p className="card__meta">
          Aggregate performance across every LaundroMart branch in your network.
        </p>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
          <SnapshotItem label="Machines Online" value={totals.machinesOnline} />
          <SnapshotItem label="Machines Offline" value={totals.machinesOffline} />
          <SnapshotItem label="Active Sessions" value={totals.activeSessions} />
          <SnapshotItem
            label="Revenue Today"
            value={`Rp ${totals.revenueToday.toLocaleString('id-ID')}`}
          />
        </div>
      </section>

      <section className="card">
        <h2 className="card__title">Branches</h2>
        <p className="card__meta">Realtime occupancy and live revenue per branch.</p>
        <div className="grid" style={{ gap: '12px' }}>
          {sampleBranches.map((branch) => (
            <article key={branch.id} className="card" style={{ margin: 0 }}>
              <h3 className="card__title">{branch.name}</h3>
              <p className="card__meta">
                {branch.machinesOnline} machines online · {branch.activeSessions} active sessions
              </p>
              <p className="card__meta">
                Revenue today:{' '}
                <strong>Rp {branch.revenueToday.toLocaleString('id-ID')}</strong>
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

type SnapshotItemProps = {
  label: string;
  value: number | string;
};

function SnapshotItem({ label, value }: SnapshotItemProps) {
  return (
    <div>
      <p className="card__meta" style={{ marginBottom: 4 }}>
        {label}
      </p>
      <p style={{ margin: 0, fontSize: '1.4rem', fontWeight: 600 }}>{value}</p>
    </div>
  );
}
