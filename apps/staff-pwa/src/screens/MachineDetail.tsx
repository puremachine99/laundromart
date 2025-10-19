import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { useMachineStore } from '../store/useMachineStore';

export default function MachineDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const machine = useMachineStore((state) => state.machines.find((item) => item.id === id));
  const session = useMachineStore((state) =>
    state.sessions.find((item) => item.machineId === id)
  );
  const [pin, setPin] = useState('');
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState('');

  const eta = useMemo(() => {
    if (!session) {
      return null;
    }
    return dayjs(session.startedAt)
      .add(session.durationMinutes, 'minute')
      .format('HH:mm');
  }, [session]);

  if (!machine) {
    return (
      <section className="card">
        <p>Machine not found.</p>
        <button type="button" className="btn" onClick={() => navigate(-1)}>
          Back
        </button>
      </section>
    );
  }

  const handleRestart = (mode: 'resume-remaining' | 'reset-full') => {
    if (mode === 'reset-full' && (!pin || !reason)) {
      setStatus('PIN and reason required for full reset.');
      return;
    }

    setStatus(`Restart queued (${mode}). PIN validated.`);
  };

  const handleRefund = () => {
    if (!reason) {
      setStatus('Reason is required for refunds.');
      return;
    }

    setStatus('Refund request recorded. Confirm in cashier log.');
  };

  return (
    <section className="card">
      <h2 className="card__title">{machine.name}</h2>
      <p className="card__meta">
        Status: <span className={`pill pill--${machine.status}`}>{machine.status}</span>
      </p>
      <p className="card__meta">
        Last heartbeat: {dayjs(machine.lastHeartbeat).format('HH:mm:ss')} · Price Rp{' '}
        {machine.priceCents.toLocaleString('id-ID')}
      </p>

      {session ? (
        <p className="card__meta">
          Active session ends {eta} · Payment {session.paymentMethod.toUpperCase()}
        </p>
      ) : (
        <p className="card__meta">No active session.</p>
      )}

      <div className="pos-form">
        <label>
          PIN (4-12 digits)
          <input value={pin} onChange={(event) => setPin(event.target.value)} placeholder="••••" />
        </label>

        <label>
          Reason / Notes
          <textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Example: Customer requested early stop due to overloading."
          />
        </label>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button type="button" className="btn" onClick={() => handleRestart('resume-remaining')}>
            Restart (resume)
          </button>
          <button type="button" className="btn" onClick={() => handleRestart('reset-full')}>
            Restart (reset)
          </button>
          <button type="button" className="btn" onClick={handleRefund}>
            Refund Session
          </button>
        </div>

        {status && <p className="card__meta">{status}</p>}
      </div>
    </section>
  );
}
