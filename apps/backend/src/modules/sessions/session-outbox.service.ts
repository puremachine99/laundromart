import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import {
  SessionCommandEntity,
  SessionCommandType
} from './entities/session-command.entity';

export interface EnqueueSessionCommandParams {
  machineId: string;
  tenantId: string;
  command: SessionCommandType;
  payload: Record<string, unknown>;
  initiatedBy: string;
  correlationId?: string;
}

@Injectable()
export class SessionOutboxService {
  constructor(
    @InjectRepository(SessionCommandEntity)
    private readonly repository: Repository<SessionCommandEntity>
  ) {}

  async enqueueCommand(params: EnqueueSessionCommandParams): Promise<SessionCommandEntity> {
    const entity = this.repository.create({
      ...params,
      correlationId: params.correlationId ?? randomUUID()
    });

    return this.repository.save(entity);
  }

  async markProcessed(id: string): Promise<void> {
    await this.repository.update(id, {
      processedAt: new Date()
    });
  }
}
