export type AppEnvironment = 'development' | 'test' | 'production';

export interface AppConfig {
  app: {
    name: string;
    env: AppEnvironment;
    port: number;
    logLevel: 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';
    allowOfflineStart: boolean;
  };
  database: {
    url: string;
    schema: string;
  };
  redis: {
    url: string;
  };
  mqtt: {
    url: string;
    username?: string;
    password?: string;
    clientIdPrefix: string;
    statusTopicPrefix: string;
    commandTopicPrefix: string;
  };
  payments: {
    provider: 'xendit';
    mode: 'static' | 'dynamic';
    staticMatchWindowMs: number;
    staticFingerprintFields: string[];
    callbackSecret: string;
  };
  sessions: {
    outboxTable: string;
    deviceTokenTtlHours: number;
    ownerReportHour: string;
  };
  security: {
    jwtSecret: string;
  };
}
