import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  APP_NAME: z.string().default('laundromart-backend'),
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace'])
    .default('info'),
  PORT: z.coerce.number().int().min(0).max(65535).default(3000),
  DATABASE_URL: z
    .string()
    .default('postgres://postgres:postgres@localhost:5432/laundromart'),
  DB_SCHEMA: z.string().default('public'),
  REDIS_URL: z.string().default('redis://localhost:6379/0'),
  MQTT_URL: z.string().default('mqtt://localhost:1883'),
  MQTT_USERNAME: z.string().optional(),
  MQTT_PASSWORD: z.string().optional(),
  MQTT_CLIENT_ID_PREFIX: z.string().default('laundromart-api'),
  MQTT_STATUS_TOPIC_PREFIX: z.string().default('machines/status'),
  MQTT_COMMAND_TOPIC_PREFIX: z.string().default('machines/commands'),
  XENDIT_CALLBACK_SECRET: z.string().default('local-dev-secret'),
  QRIS_MODE: z.enum(['static', 'dynamic']).default('static'),
  QRIS_STATIC_MATCH_WINDOW_MS: z.coerce.number().int().positive().default(90000),
  QRIS_STATIC_FINGERPRINT_FIELDS: z.string().default('payment_method,issuer_reference'),
  SESSION_OUTBOX_TABLE: z.string().default('integration_outbox'),
  DEVICE_TOKEN_TTL_HOURS: z.coerce.number().int().positive().default(24),
  OWNER_REPORT_HOUR: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'Use HH:MM (24h) format')
    .default('21:00'),
  JWT_SECRET: z
    .string()
    .min(32, 'JWT secret should be at least 32 characters for strength')
    .default('local-development-jwt-secret-change-me'),
  ALLOW_OFFLINE_START: z.coerce.boolean().default(true)
});

export type EnvVars = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): EnvVars {
  const parsed = envSchema.safeParse(config);

  if (!parsed.success) {
    const formatted = parsed.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');
    throw new Error(`Invalid environment configuration - ${formatted}`);
  }

  return parsed.data;
}
