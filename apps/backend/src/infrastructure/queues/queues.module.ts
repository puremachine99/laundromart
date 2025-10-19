import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QueueBaseOptions } from 'bullmq';
import { AppConfig } from '../../common/config/config.types';

export const BULLMQ_OPTIONS = 'BULLMQ_OPTIONS';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: BULLMQ_OPTIONS,
      inject: [ConfigService],
      useFactory: (config: ConfigService<AppConfig, true>): QueueBaseOptions => {
        const redis = config.get('redis', { infer: true });
        const redisUrl = new URL(redis.url);

        return {
          connection: {
            host: redisUrl.hostname,
            port: Number(redisUrl.port || 6379),
            db: Number(redisUrl.pathname.replace('/', '') || 0),
            password: redisUrl.password || undefined,
            username: redisUrl.username || undefined
          }
        };
      }
    }
  ],
  exports: [BULLMQ_OPTIONS]
})
export class QueuesModule {}
