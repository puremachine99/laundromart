import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, Length, MaxLength } from 'class-validator';

export enum RestartMode {
  ResumeRemaining = 'resume-remaining',
  ResetFull = 'reset-full'
}

export class RestartSessionDto {
  @IsUUID()
  machineId!: string;

  @IsString()
  @IsNotEmpty()
  tenantId!: string;

  @IsString()
  @IsNotEmpty()
  initiatedBy!: string;

  @IsEnum(RestartMode)
  mode!: RestartMode;

  @IsOptional()
  @IsString()
  @Length(4, 12)
  pin?: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  reason?: string;

  @IsOptional()
  @IsBoolean()
  manualOverride?: boolean;
}
