import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pin } from 'src/pin/pin.entity';
import { Tag } from 'src/tag/entities/tag.entity';
import { Like, Repository } from 'typeorm';
import { CreateSearchDto } from './dto/create-search.dto';
import { UpdateSearchDto } from './dto/update-search.dto';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Tag) private tagRepository: Repository<Tag>,
    @InjectRepository(Pin) private pinRepository: Repository<Pin>,
  ) {}

  arrayUnique(array){
    var a = array.concat();
      for(var i=0; i<a.length; ++i) {
          for(var j=i+1; j<a.length; ++j) {
              if(a[i].id === a[j].id){
                  a.splice(j--, 1);
              }
          }
      }

      return a;
  }

  async findPinWithTag(nameSearch: CreateSearchDto) {
    let tags = this.tagRepository.find({
      relations: { pins: true },
      where:{name: Like("%" + nameSearch.name + "%")},
    });
    let arrPinsAll = [];
    let sz = (await tags).length;
    for(let i = 0; i < sz; i++){
      arrPinsAll= this.arrayUnique(arrPinsAll.concat((await tags)[i].pins))
    }
    let count = arrPinsAll.length;
    let startIndex = nameSearch.pageSize * (nameSearch.pageNum - 1)
    let arrPins = arrPinsAll.slice(startIndex, startIndex+nameSearch.pageSize);
    return {data: arrPins, count};
  }
}
