import { Injectable } from '@nestjs/common';

export interface MachineSummary {
  id: string;
  tenantId: string;
  branchId: string;
  name: string;
  type: 'washer' | 'dryer';
  status: 'idle' | 'running' | 'faulted' | 'offline';
  lastHeartbeatAt?: string;
  priceCents?: number;
}

@Injectable()
export class MachinesService {
  async listMachines(): Promise<MachineSummary[]> {
    // TODO: replace with real repository once entity modelling is completed.
    return [];
  }
}
