import { ApiResponseProperty } from '@nestjs/swagger';
import { Board } from 'src/board/board.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
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

  @ManyToMany((type) => User, (user) => user.following)
  @JoinTable()
  followers: User[];

  @ManyToMany((type) => User, (user) => user.followers)
  following: User[];

  @ApiResponseProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiResponseProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
