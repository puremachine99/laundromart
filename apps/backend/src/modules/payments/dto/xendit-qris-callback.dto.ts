import { Type } from 'class-transformer';
import {
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested
} from 'class-validator';

export class XenditQrPaymentDetailDto {
  @IsString()
  @IsNotEmpty()
  payment_method!: string;

  @IsString()
  @IsNotEmpty()
  currency!: string;

  @IsOptional()
  @IsString()
  issuer_reference?: string;

  @IsOptional()
  @IsString()
  channel_code?: string;

  @IsOptional()
  @IsString()
  card_masked_number?: string;
}

export class XenditQrisCallbackDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsNotEmpty()
  external_id!: string;

  @IsString()
  @IsNotEmpty()
  reference_id!: string;

  @IsString()
  @IsNotEmpty()
  qr_string!: string;

  @IsNumber()
  @IsPositive()
  amount!: number;

  @IsString()
  @IsNotEmpty()
  status!: string;

  @IsISO8601()
  created!: string;

  @IsISO8601()
  updated!: string;

  @ValidateNested()
  @Type(() => XenditQrPaymentDetailDto)
  payment_detail!: XenditQrPaymentDetailDto;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @IsOptional()
  @IsInt()
  net_amount?: number;
}
