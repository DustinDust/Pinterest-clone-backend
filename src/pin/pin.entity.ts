import { ApiResponseProperty } from '@nestjs/swagger';
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

  @Column({ nullable: true })
  filename: string;

  @Column({ nullable: true })
  name: string;

  @CreateDateColumn()
  createdAt: Date;
}
