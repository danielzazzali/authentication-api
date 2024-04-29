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
  @PrimaryGeneratedColumn({ name: 'forgotPasswordId' })
  forgotPasswordId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ name: 'code', length: 6 })
  code: string;

  @Column({ name: 'createdAt', type: 'timestamptz', default: () => `now()` })
  createdAt: Date;

  @Column({
    name: 'validUntil',
    type: 'timestamptz',
    default: () => `now() + INTERVAL '15 minutes'`,
  })
  validUntil: Date;

  @Column({ name: 'isUsed', type: 'boolean', default: false })
  isUsed: boolean;
}
