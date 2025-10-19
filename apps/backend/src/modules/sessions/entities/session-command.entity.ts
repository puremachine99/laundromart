import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

export type SessionCommandType = 'start' | 'stop' | 'restart' | 'refund';

@Entity({
  name: 'session_command_outbox'
})
export class SessionCommandEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  machineId!: string;

  @Column({ type: 'varchar', length: 32 })
  command!: SessionCommandType;

  @Column({ type: 'jsonb' })
  payload!: Record<string, unknown>;

  @Column({ type: 'varchar', length: 64 })
  correlationId!: string;

  @Column({ type: 'varchar', length: 64 })
  initiatedBy!: string;

  @Column({ type: 'varchar', length: 32 })
  tenantId!: string;

  @Column({ type: 'int', default: 0 })
  retryCount!: number;

  @Column({ type: 'timestamp with time zone', nullable: true })
  processedAt?: Date | null;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt!: Date;
}
