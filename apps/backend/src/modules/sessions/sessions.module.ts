import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MqttModule } from '../../infrastructure/mqtt/mqtt.module';
import { SessionCommandEntity } from './entities/session-command.entity';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';
import { SessionOutboxService } from './session-outbox.service';

@Module({
  imports: [ConfigModule, MqttModule, TypeOrmModule.forFeature([SessionCommandEntity])],
  controllers: [SessionsController],
  providers: [SessionsService, SessionOutboxService],
  exports: [SessionsService]
})
export class SessionsModule {}
