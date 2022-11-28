import { ApiResponseProperty } from '@nestjs/swagger';
import { Board } from 'src/board/board.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @ApiResponseProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiResponseProperty()
  @Column({ unique: true })
  username: string;

  @ApiResponseProperty()
  @Column()
  displayName: string;

  @ApiResponseProperty()
  @Column({ nullable: true })
  avatarUrl: string;

  @ApiResponseProperty()
  @Column()
  hashPassword: string;

  @ApiResponseProperty()
  @Column({ nullable: true })
  hashRefeshToken: string;

  @ApiResponseProperty()
  @OneToMany(() => Board, (board) => board.user)
  boards: Board[];

  @ApiResponseProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiResponseProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
