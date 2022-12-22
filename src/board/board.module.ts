import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pin } from 'src/pin/pin.entity';
import { User } from 'src/user/user.entity';
import { Board } from './board.entity';
import { Tag } from 'src/tag/entities/tag.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Pin, User, Board, Tag])],
  providers: [BoardService],
  controllers: [BoardController],
  exports: [BoardService],
})
export class BoardModule {}
