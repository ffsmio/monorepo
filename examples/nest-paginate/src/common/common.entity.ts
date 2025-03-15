import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('system_common')
@Index('idx_system_common_channel_key_code', ['channelCode', 'key', 'code'], {
  unique: true,
})
export class SystemCommon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'channel_code', default: 'all' })
  channelCode: string;

  @Column()
  key: string;

  @Column()
  code: string;

  @Column()
  value: string;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ nullable: true })
  metadata: string | null;

  @Column({ nullable: true })
  description: string;

  @BeforeInsert()
  @BeforeUpdate()
  normalize() {
    if (this.channelCode) {
      this.channelCode = this.channelCode.toLowerCase();
    }

    if (this.key) {
      this.key = this.key.toLowerCase();
    }

    if (this.code) {
      this.code = this.code.toLowerCase();
    }

    if (this.value) {
      this.value = this.value.trim();
    }

    if (this.metadata) {
      this.metadata = this.metadata.trim();
    }

    if (this.description) {
      this.description = this.description.trim();
    }

    if (!this.order || this.order < 0) {
      this.order = 0;
    } else {
      this.order = Math.floor(this.order);
    }
  }
}
