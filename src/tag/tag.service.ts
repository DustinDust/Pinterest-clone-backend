import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagService {
  constructor(@InjectRepository(Tag) private tagRepository: Repository<Tag>) {}

  async create(createTagDto: CreateTagDto) {
    const tag = this.tagRepository.create();
    tag.name = createTagDto.name;
    return await this.tagRepository.save(tag);
  }

  async findAll() {
    return await this.tagRepository.find();
  }

  async findOne(tagId: number) {
    const tag = await this.tagRepository.findOneBy({ id: tagId });
    if (!tag) {
      throw new BadRequestException('Tag not found!');
    }
    return tag;
  }

  async update(tagId: number, updateTagDto: UpdateTagDto) {
    await this.tagRepository.update(tagId, updateTagDto);
    const updatedTag = await this.tagRepository.findOneBy({ id: tagId });
    if (updatedTag) {
      return updatedTag;
    }
    throw new BadRequestException('Tag not found!');
  }

  async remove(tagId: number) {
    const tag = await this.tagRepository.findOneBy({ id: tagId });
    if (!tag) {
      throw new BadRequestException('Tag not found!');
    }
    return await this.tagRepository.delete({ id: tagId });
  }
}
