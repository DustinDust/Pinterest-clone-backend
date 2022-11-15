import { Board } from 'src/board/board.entity';
import { Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Pin {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => Board, (board) => board.pins)
  boards: Board[];
}
