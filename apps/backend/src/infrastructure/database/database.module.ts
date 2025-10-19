import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfig } from '../../common/config/config.types';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService<AppConfig, true>) => {
        const database = config.get('database', { infer: true });
        const app = config.get('app', { infer: true });

        return {
          type: 'postgres' as const,
          url: database.url,
          schema: database.schema,
          autoLoadEntities: true,
          synchronize: false,
          logging: app.env !== 'production'
        };
      }
    })
  ]
})
export class DatabaseModule {}
