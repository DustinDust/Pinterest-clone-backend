import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Update {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.updates)
  user: User;

  @Column()
  title: string;

  @Column()
  text: string;

  @Column()
  data: string;

  @CreateDateColumn()
  createdAt: Date;
}
