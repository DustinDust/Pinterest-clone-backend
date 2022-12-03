import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pin } from './pin.entity';

@Injectable()
export class PinService {
  constructor(@InjectRepository(Pin) private pinRepository: Repository<Pin>) {}

  async getPin(id: number) {
    return await this.pinRepository.findOneBy({ id: id });
  }
}
