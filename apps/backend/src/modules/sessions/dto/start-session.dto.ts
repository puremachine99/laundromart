import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsPositive, IsString, IsUUID, MaxLength } from 'class-validator';

export enum PaymentMethod {
  Cash = 'cash',
  QrisStatic = 'qris-static',
  QrisDynamic = 'qris-dynamic'
}

export class StartSessionDto {
  @IsUUID()
  machineId!: string;

  @IsString()
  @IsNotEmpty()
  tenantId!: string;

  @IsString()
  @IsNotEmpty()
  initiatedBy!: string;

  @IsEnum(PaymentMethod)
  paymentMethod!: PaymentMethod;

  @IsString()
  @IsNotEmpty()
  paymentReference!: string;

  @IsPositive()
  priceCents!: number;

  @IsBoolean()
  offline = false;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  offlineReason?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  notes?: string;
}
