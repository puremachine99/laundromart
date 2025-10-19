import { AppConfig } from './config.types';
import { validateEnv } from './env.validation';

export const configuration = (): AppConfig => {
  const env = validateEnv(process.env);

  return {
    app: {
      name: env.APP_NAME,
      env: env.NODE_ENV,
      port: env.PORT,
      logLevel: env.LOG_LEVEL,
      allowOfflineStart: env.ALLOW_OFFLINE_START
    },
    database: {
      url: env.DATABASE_URL,
      schema: env.DB_SCHEMA
    },
    redis: {
      url: env.REDIS_URL
    },
    mqtt: {
      url: env.MQTT_URL,
      username: env.MQTT_USERNAME,
      password: env.MQTT_PASSWORD,
      clientIdPrefix: env.MQTT_CLIENT_ID_PREFIX,
      statusTopicPrefix: env.MQTT_STATUS_TOPIC_PREFIX,
      commandTopicPrefix: env.MQTT_COMMAND_TOPIC_PREFIX
    },
    payments: {
      provider: 'xendit',
      mode: env.QRIS_MODE,
      staticMatchWindowMs: env.QRIS_STATIC_MATCH_WINDOW_MS,
      staticFingerprintFields: env.QRIS_STATIC_FINGERPRINT_FIELDS
        .split(',')
        .map((field) => field.trim())
        .filter(Boolean),
      callbackSecret: env.XENDIT_CALLBACK_SECRET
    },
    sessions: {
      outboxTable: env.SESSION_OUTBOX_TABLE,
      deviceTokenTtlHours: env.DEVICE_TOKEN_TTL_HOURS,
      ownerReportHour: env.OWNER_REPORT_HOUR
    },
    security: {
      jwtSecret: env.JWT_SECRET
    }
  };
};

export type { AppConfig };
