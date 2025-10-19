import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { connect, IClientOptions, MqttClient } from 'mqtt';
import { randomUUID } from 'crypto';
import { AppConfig } from '../../common/config/config.types';

type MessageHandler = (topic: string, payload: Buffer) => void;

@Injectable()
export class MqttClientService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MqttClientService.name);
  private client?: MqttClient;
  private readonly handlers = new Map<string, Set<MessageHandler>>();

  constructor(private readonly config: ConfigService<AppConfig, true>) {}

  onModuleInit(): void {
    if (this.client) {
      return;
    }

    const mqttConfig = this.config.get('mqtt', { infer: true });
    const clientId = `${mqttConfig.clientIdPrefix}-${randomUUID()}`;

    const options: IClientOptions = {
      clientId,
      username: mqttConfig.username,
      password: mqttConfig.password,
      reconnectPeriod: 3000,
      clean: true,
      rejectUnauthorized: false // TLS validation should be configured per deployment
    };

    this.logger.log(`Connecting to MQTT broker ${mqttConfig.url} as ${clientId}`);

    this.client = connect(mqttConfig.url, options);

    this.client.on('connect', () => {
      this.logger.log('MQTT connected');
    });

    this.client.on('reconnect', () => {
      this.logger.warn('MQTT reconnecting…');
    });

    this.client.on('error', (error) => {
      this.logger.error(`MQTT error: ${error.message}`, error.stack);
    });

    this.client.on('message', (topic, payload) => {
      const handlers = this.handlers.get(topic);
      handlers?.forEach((handler) => {
        try {
          handler(topic, payload);
        } catch (error) {
          this.logger.error(`Handler error for topic ${topic}`, (error as Error).stack);
        }
      });
    });
  }

  onModuleDestroy(): void {
    if (!this.client) {
      return;
    }

    this.logger.log('Disconnecting MQTT client');
    this.client.end(true);
  }

  publish(topic: string, payload: unknown, retain = false, qos: 0 | 1 | 2 = 1): void {
    if (!this.client || !this.client.connected) {
      this.logger.warn(`MQTT publish skipped, client not connected. Topic: ${topic}`);
      return;
    }

    const serialized = JSON.stringify(payload ?? {});

    this.client.publish(topic, serialized, { qos, retain }, (error) => {
      if (error) {
        this.logger.error(`Failed to publish to ${topic}`, error.stack);
      }
    });
  }

  isConnected(): boolean {
    return Boolean(this.client?.connected);
  }

  subscribe(topic: string, handler: MessageHandler, qos: 0 | 1 | 2 = 1): void {
    if (!this.client) {
      throw new Error('MQTT client not initialised yet');
    }

    const listeners = this.handlers.get(topic) ?? new Set<MessageHandler>();
    listeners.add(handler);
    this.handlers.set(topic, listeners);

    this.client.subscribe(topic, { qos }, (error) => {
      if (error) {
        this.logger.error(`Failed to subscribe to ${topic}`, error.stack);
      } else {
        this.logger.log(`Subscribed to ${topic} (QoS ${qos})`);
      }
    });
  }
}
