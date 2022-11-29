import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FirebaseService } from 'src/firebase/firebase.service';
import { Pin } from 'src/pin/pin.entity';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Board, Visibility } from './board.entity';
import { AddPinDto } from './dto/add-pin.dto';
import { BaseBoardDto } from './dto/base-board.dto';
import { PageDto } from './dto/page.dto';
import { RemovePinDto } from './dto/remove-pin.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board) private boardRepository: Repository<Board>,
    @InjectRepository(User) private userRepsitory: Repository<User>,
    @InjectRepository(Pin) private pinRepository: Repository<Pin>,
    private firebaseService: FirebaseService,
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
      await this.boardRepository.save(board);
      return {
        id: board.id,
        ...boardDto,
        user: {
          id: user.id,
        },
      };
    } catch (e) {
      throw new UnauthorizedException(e);
    }
  }

  async savePinToBoard(
    userId: number,
    pinDto: AddPinDto,
    boardId: number,
    image: Express.Multer.File,
  ) {
    let pin: Pin;
    const board = await this.boardRepository.findOne({
      relations: { user: true, pins: true },
      where: { id: boardId },
      select: { user: { id: true }, pins: { id: true } },
    });
    if (!board) {
      throw new BadRequestException('Board not found!');
    }
    if (board.user.id !== userId) {
      throw new ForbiddenException(
        'User does not have authority to modify this board',
      );
    }
    if (!pinDto.id) {
      if (!image && !pinDto.url) {
        throw new BadRequestException(
          'Url or file is required to create completely new pin',
        );
      }
      pin = this.pinRepository.create();
      let url: string;
      if (pinDto.url) {
        url = pinDto.url;
      } else {
        url = await this.firebaseService.uploadFile(image);
        pin.url = url;
        pin.filename = image.originalname;
      }
      if (!pinDto.name) {
        throw new BadRequestException('Pin must have a name.');
      }
      pin.name = pinDto.name;
      await this.pinRepository.save(pin);
    } else {
      pin = await this.pinRepository.findOneBy({ id: pinDto.id });
      if (!pin) {
        throw new BadRequestException('Pin does not exist.');
      }
    }
    board.pins = [...board.pins, pin];
    if (!board.thumbnail) {
      board.thumbnail = pin.url;
    }
    return await this.boardRepository.save(board);
  }

  async updateBoardInfomation(
    userId: number,
    boardId: number,
    boardDto: UpdateBoardDto,
  ) {
    const board = await this.boardRepository.findOne({
      relations: {
        user: true,
      },
      where: { id: boardId },
    });
    if (!board) {
      throw new BadRequestException('Board not found!');
    }
    if (board.user.id !== userId) {
      throw new ForbiddenException(
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
    await this.boardRepository.save(board);
    return {
      id: boardId,
      ...boardDto,
    };
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
      throw new BadRequestException('Board not found!');
    }
    if (board.user.id !== userId) {
      throw new ForbiddenException(
        'User does not have authority to modify this board',
      );
    }
    return await this.boardRepository.delete({
      id: boardId,
    });
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
      select: {
        user: {},
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
      throw new BadRequestException('Board not found!');
    }
    if (board.visibility === Visibility.PRIVATE) {
      if (board.user.id !== userId) {
        throw new UnauthorizedException(
          'User does not have authority to view this board',
        );
      }
    }
    const boardPins = await this.pinRepository.find({
      relations: {
        boards: true,
      },
      where: {
        boards: {
          id: boardId,
        },
      },
      select: {
        boards: {},
      },
      take: page.pageSize,
      skip: page.pageSize * (page.pageNum - 1),
    });
    return boardPins;
  }

  async removePinsFromBoard(
    userId: number,
    boardId: number,
    data: RemovePinDto[],
  ) {
    const board = await this.boardRepository.findOne({
      relations: {
        user: true,
        pins: true,
      },
      where: {
        id: boardId,
      },
      select: {
        id: true,
        user: {
          id: true,
        },
        pins: {
          id: true,
        },
      },
    });
    if (!board) {
      throw new BadRequestException('Board does not exist');
    }
    if (board.user.id !== userId) {
      throw new ForbiddenException(
        'User does not have authority over this board',
      );
    }
    board.pins = board.pins.filter((p) => {
      return data.findIndex((pin) => p.id === pin.id) < 0;
    });
    if (board.pins.length <= 0) {
      board.thumbnail = null;
    } else {
      board.thumbnail = board.pins[0].url;
    }
    for (const datum of data) {
      const pin = await this.pinRepository.findOne({
        relations: { boards: true },
        where: { id: datum.id },
      });
      if (pin.boards.length === 0) {
        if (pin.filename) {
          this.firebaseService.removeFile(pin.filename);
        }
      }
    }
    return await this.boardRepository.save(board);
  }
}
