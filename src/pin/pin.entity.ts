import { Board } from 'src/board/board.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Tag } from 'src/tag/entities/tag.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Pin {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => Board, (board) => board.pins)
  boards: Board[];

  @ManyToMany(() => Tag, (tag) => tag.pins)
  tags: Tag[];

  @ManyToOne(() => User, (user) => user.pins)
  user: User;

  @OneToMany(() => Comment, (comment) => comment.pin)
  comments: Comment[];

  @Column({ nullable: false })
  url: string;

  @Column({ nullable: false })
  thumbnail: string;

  @Column({ nullable: false })
  fileuuid: string;

  @Column({ nullable: false })
  name: string;

  @CreateDateColumn()
  createdAt: Date;
}
