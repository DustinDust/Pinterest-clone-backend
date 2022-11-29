import { ApiResponseProperty } from '@nestjs/swagger';
import { Pin } from 'src/pin/pin.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

export enum Visibility {
  PUBLIC = 1,
  PRIVATE = 0,
}

@Entity()
export class Board {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: Visibility,
    default: Visibility.PUBLIC,
  })
  visibility: Visibility;

  @ManyToOne(() => User, (user) => user.boards)
  user: User;

  @ManyToMany(() => Pin, (pin) => pin.boards)
  @JoinTable()
  pins: Pin[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @Column({ nullable: true })
  thumbnail: string;
}
