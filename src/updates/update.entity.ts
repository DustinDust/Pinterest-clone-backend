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

  @Column({ nullable: true })
  event: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  text: string;

  @Column({ nullable: true })
  data: string;

  @CreateDateColumn()
  createdAt: Date;
}
