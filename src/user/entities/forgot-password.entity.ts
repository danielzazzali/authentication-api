import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('forgot_password')
export class ForgotPassword {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ length: 6 })
  code: string;

  @Column('timestamptz', { default: () => `now()` })
  createdAt: Date;

  @Column('timestamptz', {
    default: () => `now() + INTERVAL '15 minutes'`,
  })
  validUntil: Date;
}
