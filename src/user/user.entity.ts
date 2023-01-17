import { ApiResponseProperty } from '@nestjs/swagger';
import { Board } from 'src/board/board.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Pin } from 'src/pin/pin.entity';
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

  @OneToMany(() => Pin, (pin) => pin.user)
  pins: Pin[]

  // @OneToMany(() => Comment, (comment) => comment.user)
  // comments: Comment[]

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
