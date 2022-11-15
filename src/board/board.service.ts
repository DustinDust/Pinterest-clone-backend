import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pin } from 'src/pin/pin.entity';
import { User } from 'src/user/user.entity';
import { ArrayContains, Repository } from 'typeorm';
import { Board, Visibility } from './board.entity';
import { BaseBoardDto } from './dto/base-board.dto';
import { PageDto } from './dto/page.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board) private boardRepository: Repository<Board>,
    @InjectRepository(User) private userRepsitory: Repository<User>,
    @InjectRepository(Pin) private pinRepository: Repository<Pin>,
  ) {}

  async createBoard(userId: number, boardDto: BaseBoardDto) {
    const board = this.boardRepository.create();
    board.name = boardDto.name;
    board.description = boardDto.description;
    board.visibility =
      boardDto.visibility === 0 ? Visibility.PRIVATE : Visibility.PUBLIC;
    try {
      const user = await this.userRepsitory.findOneBy({ id: userId });
      board.user = user;
      return await this.boardRepository.save(board);
    } catch (e) {
      throw new UnauthorizedException(e);
    }
  }

  async savePinToBoard(userId: number, pin: any, boardId: number) {
    const board = await this.boardRepository.findOneBy({ id: boardId });
    if (!board) {
      throw new NotFoundException('Board not found!');
    }
    if (board.user.id !== userId) {
      throw new UnauthorizedException(
        'User does not have authority to modify this board',
      );
    }
    if (!pin.id) {
      // TODO: create a pin
    } else {
      pin = this.pinRepository.findOneBy({ id: pin.id });
    }
    board.pins.push(pin);
    return await this.boardRepository.save(board);
  }

  async updateBoardInfomation(
    userId: number,
    boardId: number,
    boardDto: UpdateBoardDto,
  ) {
    const board = await this.boardRepository.findOneBy({ id: boardId });
    if (!board) {
      throw new NotFoundException('Board not found!');
    }
    if (board.user.id !== userId) {
      throw new UnauthorizedException(
        'User does not have authority to modify this board',
      );
    }
    if (boardDto.name) {
      board.name = boardDto.name;
    }
    if (boardDto.description) {
      board.description = boardDto.description;
    }
    if (boardDto.visibility) {
      board.visibility =
        boardDto.visibility === 0 ? Visibility.PRIVATE : Visibility.PUBLIC;
    }
    return await this.boardRepository.save(board);
  }

  async deleteBoard(userId: number, boardId: number) {
    const board = await this.boardRepository.findOne({
      relations: {
        user: true,
      },
      where: {
        id: boardId,
      },
    });
    if (!board) {
      throw new NotFoundException('Board not found!');
    }
    if (board.user.id !== userId) {
      throw new UnauthorizedException(
        'User does not have authority to modify this board',
      );
    }
    return await this.boardRepository.delete(board);
  }

  async getBoardsByUser(curUserId: number, userId: number) {
    const boards = await this.boardRepository.find({
      relations: {
        user: true,
      },
      where: {
        user: {
          id: userId,
        },
      },
    });
    if (userId !== curUserId) {
      const res = boards.filter((b) => b.visibility === Visibility.PUBLIC);
      return res;
    }
    return boards;
  }

  async getPins(boardId: number, userId: number, page: PageDto) {
    const board = await this.boardRepository.findOne({
      relations: {
        user: true,
        pins: false,
      },
      where: {
        id: boardId,
      },
    });
    if (!board) {
      throw new NotFoundException('Board not found!');
    }
    if (board.visibility === Visibility.PRIVATE) {
      if (board.user.id !== userId) {
        throw new UnauthorizedException(
          'User does not have authority to view this board',
        );
      }
    }
    return await this.pinRepository.find({
      relations: {
        boards: true,
      },
      where: {
        boards: ArrayContains([board]),
      },
      take: page.pageSize,
      skip: (page.pageNum - 1) * page.pageSize,
    });
  }
}
