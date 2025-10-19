import create from 'zustand';
import dayjs from 'dayjs';

export type MachineStatus = 'idle' | 'running' | 'faulted' | 'offline';

export interface Machine {
  id: string;
  name: string;
  type: 'washer' | 'dryer';
  status: MachineStatus;
  lastHeartbeat: string;
  priceCents: number;
}

export interface Session {
  id: string;
  machineId: string;
  startedAt: string;
  durationMinutes: number;
  remainingSeconds: number;
  paymentMethod: 'cash' | 'qris-static' | 'qris-dynamic';
}

interface MachineStoreState {
  machines: Machine[];
  sessions: Session[];
  updateSessionProgress: (machineId: string, elapsedSeconds: number) => void;
  setMachineStatus: (machineId: string, status: MachineStatus) => void;
}

const sampleMachines: Machine[] = [
  {
    id: 'machine-01',
    name: 'WM #01',
    type: 'washer',
    status: 'running',
    lastHeartbeat: dayjs().subtract(10, 'second').toISOString(),
    priceCents: 15000
  },
  {
    id: 'machine-02',
    name: 'WM #02',
    type: 'washer',
    status: 'idle',
    lastHeartbeat: dayjs().subtract(2, 'minute').toISOString(),
    priceCents: 15000
  },
  {
    id: 'machine-05',
    name: 'DR #05',
    type: 'dryer',
    status: 'faulted',
    lastHeartbeat: dayjs().subtract(8, 'minute').toISOString(),
    priceCents: 12000
  }
];

const sampleSessions: Session[] = [
  {
    id: 'session-01',
    machineId: 'machine-01',
    startedAt: dayjs().subtract(12, 'minute').toISOString(),
    durationMinutes: 30,
    remainingSeconds: 18 * 60,
    paymentMethod: 'qris-static'
  }
];

export const useMachineStore = create<MachineStoreState>()((set) => ({
  machines: sampleMachines,
  sessions: sampleSessions,
  updateSessionProgress: (machineId, elapsedSeconds) =>
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.machineId === machineId
          ? {
              ...session,
              remainingSeconds: Math.max(session.remainingSeconds - elapsedSeconds, 0)
            }
          : session
      )
    })),
  setMachineStatus: (machineId, status) =>
    set((state) => ({
      machines: state.machines.map((machine) =>
        machine.id === machineId
          ? {
              ...machine,
              status,
              lastHeartbeat: new Date().toISOString()
            }
          : machine
      )
    }))
}));
