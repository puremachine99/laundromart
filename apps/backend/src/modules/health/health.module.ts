import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { MqttHealthIndicator } from './mqtt.health-indicator';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [MqttHealthIndicator]
})
export class HealthModule {}
