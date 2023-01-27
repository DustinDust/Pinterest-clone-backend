import { Board } from 'src/board/board.entity';
import { Update } from 'src/updates/update.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Pin } from 'src/pin/pin.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  displayName: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column()
  hashPassword: string;

  @Column({ nullable: true })
  hashRefeshToken: string;

  @OneToMany(() => Board, (board) => board.user)
  boards: Board[];

  @OneToMany(() => Pin, (pin) => pin.user)
  pins: Pin[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @ManyToMany(() => User, (user) => user.following)
  @JoinTable()
  followers: User[];

  @ManyToMany(() => User, (user) => user.followers)
  following: User[];

  @OneToMany(() => Update, (update) => update.user)
  updates: Update[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  deviceToken: string;
}
