import { hash } from 'bcryptjs';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  Index,
} from 'typeorm';
import { AbstractEntity } from './abstract.entity';

@Entity({ name: 'users' })
export class User extends AbstractEntity {
  @Column({ nullable: false })
  @Index('LOGIN_VALUE_INDEX', { unique: true })
  login: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;
}
