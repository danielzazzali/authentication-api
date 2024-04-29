import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('users')
@Unique(['email', 'rut'])
export class User {
  @PrimaryGeneratedColumn({ name: 'userId' })
  userId: number;

  @Column({ name: 'email', type: 'varchar', unique: true, nullable: false })
  email: string;

  @Column({ name: 'rut', type: 'varchar', unique: true, nullable: true })
  rut: string;

  @Column({ name: 'firstName', type: 'varchar', nullable: true })
  firstName: string;

  @Column({ name: 'lastName', type: 'varchar', nullable: true })
  lastName: string;

  @Column({ name: 'hashedPassword', type: 'varchar', nullable: false })
  hashedPassword: string;
}
