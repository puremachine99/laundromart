import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './modules/health/health.module';
import { configuration } from './common/config/configuration';
import { DatabaseModule } from './infrastructure/database/database.module';
import { MqttModule } from './infrastructure/mqtt/mqtt.module';
import { QueuesModule } from './infrastructure/queues/queues.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { MachinesModule } from './modules/machines/machines.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      load: [configuration]
    }),
    DatabaseModule,
    QueuesModule,
    MqttModule,
    HealthModule,
    PaymentsModule,
    SessionsModule,
    MachinesModule
  ]
})
export class AppModule {}
