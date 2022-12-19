import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board, Visibility } from 'src/board/board.entity';
import { PageDto } from 'src/pagination/page.dto';
import { Tag } from 'src/tag/entities/tag.entity';
import { Not, Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { RemoveTagDto } from './dto/remove-tag.dto';
import { Pin } from './pin.entity';

@Injectable()
export class PinService {
  constructor(
    @InjectRepository(Pin) private pinRepository: Repository<Pin>,
    @InjectRepository(Board) private boardRepository: Repository<Board>,
    @InjectRepository(Tag) private tagRepository: Repository<Tag>,
  ) {}

  async getPin(id: number) {
    return await this.pinRepository.findOne({
      relations: {tags: true },
      where: { id: id },
    });
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

  async saveTagToPin(
    tagDto: CreateTagDto,
    pinId: number,
  ) {
    console.log(tagDto);
    let tag: Tag;
    const pin = await this.pinRepository.findOne({
      relations: { tags: true },
      where: { id: pinId },
      select: { tags: { id: true } },
    });
    if (!pin) {
      throw new BadRequestException('pin not found!');
    }
    if (!tagDto.id) {
      tag = this.tagRepository.create();
      if (!tagDto.name) {
        throw new BadRequestException('Tag must have a name.');
      }
      tag.name = tagDto.name;
      await this.tagRepository.save(tag);
    } else {
      tag = await this.tagRepository.findOneBy({id: tagDto.id})
      if (!tag) {
        throw new BadRequestException('Tag does not exist.');
      }
    }
    pin.tags = [...pin.tags, tag];
    return await this.pinRepository.save(pin);
  }

  async removeTagFromPin(
    pinId: number,
    data: RemoveTagDto[],
  ) {
    const pin = await this.pinRepository.findOne({
      relations: {
        tags: true,
      },
      where: {
        id: pinId,
      },
      select: {
        id: true,
        tags: {
          id: true,
        },
      },
    });
    if (!pin) {
      throw new BadRequestException('Pin does not exist');
    }
    pin.tags = pin.tags.filter((t) => {
      return data.findIndex((tag) => t.id === tag.id) < 0;
    });
    return await this.pinRepository.save(pin);
  }
}
