import { ApiResponseProperty } from '@nestjs/swagger';
import { Board } from 'src/board/board.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Pin {
  @ApiResponseProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiResponseProperty()
  @ManyToMany(() => Board, (board) => board.pins)
  boards: Board[];

  @ApiResponseProperty()
  @Column({ nullable: false })
  url: string;

  @ApiResponseProperty()
  @Column({ nullable: true })
  filename: string;

  @ApiResponseProperty()
  @Column({ nullable: true })
  name: string;

  @ApiResponseProperty()
  @CreateDateColumn()
  createdAt: Date;
}
