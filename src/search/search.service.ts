import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pin } from 'src/pin/pin.entity';
import { Tag } from 'src/tag/entities/tag.entity';
import { Like, Repository } from 'typeorm';
import { CreateSearchDto } from './dto/create-search.dto';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Tag) private tagRepository: Repository<Tag>,
    @InjectRepository(Pin) private pinRepository: Repository<Pin>,
  ) {}

  arrayUnique(array) {
    const a = array.concat();
    for (let i = 0; i < a.length; ++i) {
      for (let j = i + 1; j < a.length; ++j) {
        if (a[i].id === a[j].id) {
          a.splice(j--, 1);
        }
      }
    }

    return a;
  }

  async findPinWithTag(nameSearch: CreateSearchDto) {
    if (!nameSearch.name || nameSearch.name.length <= 0) {
      const [pins, count] = await this.pinRepository.findAndCount({
        skip: nameSearch.pageSize * (nameSearch.pageNum - 1),
        take: nameSearch.pageSize,
      });
      return { data: pins, count };
    }
    const tags = this.tagRepository.find({
      relations: { pins: true },
      where: { name: Like('%' + nameSearch.name + '%') },
    });
    let arrPinsAll = [];
    const sz = (await tags).length;
    for (let i = 0; i < sz; i++) {
      arrPinsAll = this.arrayUnique(arrPinsAll.concat((await tags)[i].pins));
    }
    const count = arrPinsAll.length;
    const startIndex = nameSearch.pageSize * (nameSearch.pageNum - 1);
    const arrPins = arrPinsAll.slice(
      startIndex,
      startIndex + nameSearch.pageSize,
    );
    return { data: arrPins, count };
  }
}
