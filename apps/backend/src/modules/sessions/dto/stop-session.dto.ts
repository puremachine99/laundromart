import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID, Length, MaxLength } from 'class-validator';

export class StopSessionDto {
  @IsUUID()
  machineId!: string;

  @IsString()
  @IsNotEmpty()
  tenantId!: string;

  @IsString()
  @IsNotEmpty()
  initiatedBy!: string;

  @IsOptional()
  @IsBoolean()
  manualOverride?: boolean;

  @IsOptional()
  @IsString()
  @Length(4, 12)
  pin?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  reason?: string;
}
