import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Update } from './update.entity';
import { Repository } from 'typeorm';
import { PageDto } from 'src/pagination/page.dto';

@Injectable()
export class UpdatesService {
  constructor(
    @InjectRepository(Update) private updateRepository: Repository<Update>,
  ) {}

  async findAllByUserId(user_id: number, page: PageDto) {
    const [data, count] = await this.updateRepository.findAndCount({
      relations: {
        user: true,
      },
      where: {
        user: {
          id: user_id,
        },
      },
      select: {
        user: {
          id: true,
        },
        createdAt: true,
        data: true,
        text: true,
        title: true,
        id: true,
        event: true,
      },
      skip: page.pageSize * (page.pageNum - 1),
      take: page.pageSize,
    });
    return {
      data,
      count,
    };
  }
}
