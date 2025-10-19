import { FormEvent, useState } from 'react';
import { useMachineStore } from '../store/useMachineStore';

type PaymentMethod = 'cash' | 'qris-static';

export default function PointOfSale() {
  const machines = useMachineStore((state) => state.machines);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [machineId, setMachineId] = useState<string>(machines[0]?.id ?? '');
  const [amount, setAmount] = useState<number>(15000);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<string>('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('Session queued. Scan QR and start the machine.');
  };

  return (
    <section className="card">
      <h2 className="card__title">Point of Sale</h2>
      <p className="card__meta">
        Create a wash or dry session, capture payment details, and print thermal receipts.
      </p>

      <form className="pos-form" onSubmit={handleSubmit}>
        <label>
          Machine
          <select value={machineId} onChange={(event) => setMachineId(event.target.value)}>
            {machines.map((machine) => (
              <option key={machine.id} value={machine.id}>
                {machine.name} · Rp {machine.priceCents.toLocaleString('id-ID')}
              </option>
            ))}
          </select>
        </label>

        <label>
          Payment method
          <select
            value={paymentMethod}
            onChange={(event) => setPaymentMethod(event.target.value as PaymentMethod)}
          >
            <option value="cash">Cash</option>
            <option value="qris-static">QRIS Static</option>
          </select>
        </label>

        <label>
          Amount (Rp)
          <input
            type="number"
            value={amount}
            onChange={(event) => setAmount(Number(event.target.value))}
            min={0}
            step={1000}
          />
        </label>

        <label>
          Notes / Offline reason
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Offline start requires reason · e.g. QR scanner down"
          />
        </label>

        <button type="submit" className="btn">
          Queue Session
        </button>

        {status && <p className="card__meta">{status}</p>}
      </form>
    </section>
  );
}
