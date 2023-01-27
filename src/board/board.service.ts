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
import { BaseBoardDto } from './dto/base-board.dto';
import { PageDto } from '../pagination/page.dto';
import { RemovePinDto } from './dto/remove-pin.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { ThumbnailService } from 'src/thumbnail/thumbnail.service';
import { randomUUID } from 'node:crypto';
import { AddPinWithTagDto } from './dto/add-tag.dto';
import { Tag } from 'src/tag/entities/tag.entity';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board) private boardRepository: Repository<Board>,
    @InjectRepository(User) private userRepsitory: Repository<User>,
    @InjectRepository(Pin) private pinRepository: Repository<Pin>,
    @InjectRepository(Tag) private tagRepository: Repository<Tag>,
    private thumbnailService: ThumbnailService,
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
    pinTagDto: AddPinWithTagDto,
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
    const tags = [];
    if (pinTagDto.tagIds !== undefined && pinTagDto.tagIds.length > 0) {
      for (const tagId of pinTagDto.tagIds) {
        try {
          const tagIdNum = Number(tagId);
          const tag = await this.tagRepository.findOneBy({ id: tagIdNum });
          tags.push(tag);
        } catch (err) {
          continue;
        }
      }
    }
    if (pinTagDto.tagNames !== undefined && pinTagDto.tagNames.length > 0) {
      if (Array.isArray(pinTagDto.tagNames)) {
        for (const tagName of pinTagDto.tagNames) {
          const tag = this.tagRepository.create();
          tag.name = tagName;
          await this.tagRepository.save(tag);
          tags.push(tag);
        }
      } else {
        const tag = this.tagRepository.create();
        tag.name = pinTagDto.tagNames;
        await this.tagRepository.save(tag);
        tags.push(tag);
      }
    }
    if (!pinTagDto.id) {
      if (!image && !pinTagDto.url) {
        throw new BadRequestException(
          'Url or file is required to create completely new pin',
        );
      }
      pin = this.pinRepository.create();
      pin.fileuuid = randomUUID();
      let url: string;
      let thumbnailUrl: string;
      let thumbtry: {
        thumbnail?: Buffer;
        err?: any;
        ext?: string;
        mime?: string;
      };
      if (pinTagDto.url) {
        url = pinTagDto.url;
        thumbtry = await this.thumbnailService.createFromUrl(pinTagDto.url);
      } else {
        pinTagDto;
        url = await this.firebaseService.uploadFile(image, pin.fileuuid);
        thumbtry = await this.thumbnailService.createFromBuffer(image.buffer);
      }
      if (!pinTagDto.name) {
        throw new BadRequestException('Pin must have a name.');
      }
      if (thumbtry.err) {
        thumbnailUrl = url;
      } else {
        thumbnailUrl = await this.firebaseService.uploadFromBuffer(
          thumbtry.thumbnail,
          `${pin.fileuuid}-thumbnail`,
          'thumbnail',
          { contentType: thumbtry.mime },
        );
      }
      pin.name = pinTagDto.name;
      pin.url = url;
      pin.thumbnail = thumbnailUrl;
      pin.tags = tags;
      const userCur = await this.userRepsitory.findOneBy({ id: userId });
      if (!userCur) {
        throw new BadRequestException('Wrong user.');
      } else {
        pin.user = userCur;
      }
      await this.pinRepository.save(pin);
    } else {
      pin = await this.pinRepository.findOne({
        relations: { tags: true, user: true },
        where: { id: pinTagDto.id },
        select: { tags: { id: true } },
      });
      if (!pin) {
        throw new BadRequestException('Pin does not exist.');
      }
      pin.tags = [...pin.tags, ...tags];
      await this.pinRepository.save(pin);
    }
    board.pins = [...board.pins, pin];
    if (!board.thumbnail) {
      board.thumbnail = pin.thumbnail;
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

  async getBoardsByUser(curUserId: number, userId: number, page: PageDto) {
    if (curUserId === userId) {
      const [boards, count] = await this.boardRepository.findAndCount({
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
        take: page.pageSize,
        skip: page.pageSize * (page.pageNum - 1),
      });
      return { boards, count };
    } else {
      const [boards, count] = await this.boardRepository.findAndCount({
        relations: { user: true },
        where: { user: { id: userId }, visibility: Visibility.PUBLIC },
        select: { user: {} },
        take: page.pageSize,
        skip: page.pageSize * (page.pageNum - 1),
      });
      return { boards, count };
    }
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
    const [boardPins, count] = await this.pinRepository.findAndCount({
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
    return {
      data: {
        id: board.id,
        description: board.description,
        name: board.name,
        visibility: board.visibility,
        pins: boardPins,
      },
      count,
    };
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
        if (pin.fileuuid) {
          this.firebaseService.removeFile(`/${pin.fileuuid}`);
          this.firebaseService.removeFile(`thumbnail/${pin.fileuuid}`);
        }
      }
    }
    return await this.boardRepository.save(board);
  }
}
