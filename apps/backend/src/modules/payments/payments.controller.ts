import { Body, Controller, Headers, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { XenditQrisCallbackDto } from './dto/xendit-qris-callback.dto';

@Controller('payments/webhooks')
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  @Post('xendit/qris')
  @HttpCode(HttpStatus.OK)
  handleXenditQrCallback(
    @Headers('x-callback-token') callbackToken: string,
    @Body() payload: XenditQrisCallbackDto
  ) {
    this.payments.verifyCallbackToken(callbackToken);

    const match = this.payments.handleStaticQrisCallback(payload);
    const checksum = this.payments.buildStaticPaymentChecksum(payload);

    return {
      received: true,
      match,
      checksum
    };
  }
}
