import {
  Injectable,
  Logger,
  UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, timingSafeEqual } from 'crypto';
import { AppConfig } from '../../common/config/config.types';
import { XenditQrisCallbackDto } from './dto/xendit-qris-callback.dto';

export interface StaticQrisMatch {
  amount: number;
  fingerprint: string;
  fingerprintFields: string[];
  paymentMethod: string;
  referenceId: string;
  externalId: string;
  issuerReference?: string;
  status: string;
}

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly fingerprintFields: string[];

  constructor(private readonly config: ConfigService<AppConfig, true>) {
    this.fingerprintFields = this.config.get('payments.staticFingerprintFields', {
      infer: true
    });
  }

  verifyCallbackToken(receivedToken: string | undefined): void {
    const { callbackSecret } = this.config.get('payments', { infer: true });

    if (!receivedToken) {
      throw new UnauthorizedException('Missing callback token');
    }

    const expected = Buffer.from(callbackSecret);
    const actual = Buffer.from(receivedToken);

    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
      this.logger.warn('Rejected callback due to invalid token');
      throw new UnauthorizedException('Invalid callback token');
    }
  }

  handleStaticQrisCallback(payload: XenditQrisCallbackDto): StaticQrisMatch {
    const fingerprint = this.buildFingerprint(payload);

    return {
      amount: payload.amount,
      fingerprint,
      fingerprintFields: this.fingerprintFields,
      paymentMethod: payload.payment_detail.payment_method,
      referenceId: payload.reference_id,
      externalId: payload.external_id,
      issuerReference: payload.payment_detail.issuer_reference,
      status: payload.status
    };
  }

  buildStaticPaymentChecksum(payload: XenditQrisCallbackDto): string {
    const secret = this.config.get('payments', { infer: true }).callbackSecret;
    const canonical = this.buildFingerprint(payload);
    const hash = createHmac('sha256', secret).update(canonical).digest('hex');

    return hash;
  }

  private buildFingerprint(payload: XenditQrisCallbackDto): string {
    const parts = this.fingerprintFields.map((field) => {
      const value = this.extractValue(payload, field);
      return `${field}:${value ?? 'n/a'}`;
    });

    parts.push(`amount:${payload.amount}`);

    return parts.join('|');
  }

  private extractValue(source: Record<string, any>, path: string): string | undefined {
    const value = path.split('.').reduce<any>((acc, key) => {
      if (acc === null || acc === undefined) {
        return undefined;
      }
      return acc[key];
    }, source);

    return typeof value === 'string' ? value : undefined;
  }
}
