import { Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult
} from '@nestjs/terminus';
import { MqttClientService } from '../../infrastructure/mqtt/mqtt.service';

@Injectable()
export class MqttHealthIndicator extends HealthIndicator {
  constructor(private readonly mqttClient: MqttClientService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const isConnected = this.mqttClient.isConnected();

    if (isConnected) {
      return this.getStatus(key, true);
    }

    throw new HealthCheckError(`${key} disconnected`, this.getStatus(key, false));
  }
}
