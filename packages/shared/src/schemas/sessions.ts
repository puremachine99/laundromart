import { z } from 'zod';

export const SessionCommandSchema = z.object({
  machineId: z.string().uuid(),
  tenantId: z.string(),
  command: z.enum(['start', 'restart', 'stop', 'refund']),
  correlationId: z.string().uuid(),
  payload: z.record(z.any()),
  createdAt: z.string().datetime(),
  processedAt: z.string().datetime().nullable().optional()
});

export type SessionCommand = z.infer<typeof SessionCommandSchema>;
