import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board, Visibility } from 'src/board/board.entity';
import { PageDto } from 'src/pagination/page.dto';
import { Not, Repository } from 'typeorm';
import { Pin } from './pin.entity';

@Injectable()
export class PinService {
  constructor(
    @InjectRepository(Pin) private pinRepository: Repository<Pin>,
    @InjectRepository(Board) private boardRepository: Repository<Board>,
  ) {}

  async getPin(id: number) {
    return await this.pinRepository.findOneBy({ id: id });
  }

  async getBoardsByPin(id: number, userId: number, page: PageDto) {
    const [boards, count] = await this.boardRepository.findAndCount({
      relations: {
        user: true,
        pins: true,
      },
      select: {
        id: true,
        name: true,
        thumbnail: true,
        pins: {},
        user: {
          id: true,
          avatarUrl: true,
          displayName: true,
          username: true,
        },
      },
      where: {
        visibility: Visibility.PUBLIC,
        pins: {
          id: id,
        },
        user: {
          id: Not(id),
        },
      },
      take: page.pageSize,
      skip: page.pageSize * (page.pageNum - 1),
    });
    return {
      data: boards,
      total: count,
    };
  }
}
