import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { AppConfig } from '../../common/config/config.types';
import { MqttClientService } from '../../infrastructure/mqtt/mqtt.service';
import { SessionCommandEntity } from './entities/session-command.entity';
import { SessionOutboxService } from './session-outbox.service';
import { RestartMode, RestartSessionDto } from './dto/restart-session.dto';
import { StartSessionDto } from './dto/start-session.dto';
import { StopSessionDto } from './dto/stop-session.dto';

@Injectable()
export class SessionsService {
  private readonly logger = new Logger(SessionsService.name);

  constructor(
    private readonly outbox: SessionOutboxService,
    private readonly mqtt: MqttClientService,
    private readonly config: ConfigService<AppConfig, true>
  ) {}

  async startSession(dto: StartSessionDto): Promise<SessionCommandEntity> {
    const appConfig = this.config.get('app', { infer: true });

    if (dto.offline && !appConfig.allowOfflineStart) {
      throw new ForbiddenException('Offline start is disabled by configuration');
    }

    if (dto.offline && !dto.offlineReason) {
      throw new BadRequestException('Offline start requires a reason');
    }

    const payload = {
      priceCents: dto.priceCents,
      paymentMethod: dto.paymentMethod,
      paymentReference: dto.paymentReference,
      metadata: {
        offline: dto.offline,
        offlineReason: dto.offlineReason,
        notes: dto.notes
      }
    };

    const record = await this.outbox.enqueueCommand({
      machineId: dto.machineId,
      tenantId: dto.tenantId,
      command: 'start',
      payload,
      initiatedBy: dto.initiatedBy
    });

    this.publishCommand(dto.machineId, 'start', {
      correlationId: record.correlationId,
      initiatedBy: dto.initiatedBy,
      payload
    });

    return record;
  }

  async restartSession(dto: RestartSessionDto): Promise<SessionCommandEntity> {
    if (dto.mode === RestartMode.ResetFull && !dto.pin) {
      throw new BadRequestException('PIN is required for full reset');
    }

    const correlationId = randomUUID();
    const payload = {
      mode: dto.mode,
      initiatedBy: dto.initiatedBy,
      reason: dto.reason,
      manualOverride: dto.manualOverride ?? false
    };

    const record = await this.outbox.enqueueCommand({
      machineId: dto.machineId,
      tenantId: dto.tenantId,
      command: 'restart',
      payload,
      initiatedBy: dto.initiatedBy,
      correlationId
    });

    this.publishCommand(dto.machineId, 'restart', {
      correlationId,
      payload
    });

    return record;
  }

  async stopSession(dto: StopSessionDto): Promise<SessionCommandEntity> {
    if (dto.manualOverride && !dto.pin) {
      throw new BadRequestException('PIN required for manual overrides');
    }

    const payload = {
      manualOverride: dto.manualOverride ?? false,
      initiatedBy: dto.initiatedBy,
      reason: dto.reason
    };

    const record = await this.outbox.enqueueCommand({
      machineId: dto.machineId,
      tenantId: dto.tenantId,
      command: 'stop',
      payload,
      initiatedBy: dto.initiatedBy
    });

    this.publishCommand(dto.machineId, 'stop', {
      correlationId: record.correlationId,
      payload
    });

    return record;
  }

  private publishCommand(
    machineId: string,
    command: string,
    payload: Record<string, unknown>
  ): void {
    const mqttConfig = this.config.get('mqtt', { infer: true });
    const topic = `${mqttConfig.commandTopicPrefix}/${machineId}`;

    this.logger.debug(`Publishing ${command} command to ${topic}`);
    this.mqtt.publish(
      topic,
      {
        command,
        ...payload
      },
      false,
      1
    );
  }
}
