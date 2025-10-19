import { z } from 'zod';

export const StaticQrisFingerprintSchema = z.object({
  amount: z.number().nonnegative(),
  fingerprint: z.string(),
  fingerprintFields: z.array(z.string()),
  paymentMethod: z.string(),
  referenceId: z.string(),
  externalId: z.string(),
  issuerReference: z.string().optional(),
  status: z.string()
});

export type StaticQrisFingerprint = z.infer<typeof StaticQrisFingerprintSchema>;
