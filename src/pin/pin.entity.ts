import { Board } from 'src/board/board.entity';
import { Tag } from 'src/tag/entities/tag.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
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
