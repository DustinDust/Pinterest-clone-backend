import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async findOneById(id: number) {
    return await this.userRepo.findOneBy({ id: id });
  }

  async findOneByUsername(username: string) {
    return await this.userRepo.findOneBy({
      username: username,
    });
  }

  async createNewUser(data: DeepPartial<User>) {
    const user = this.userRepo.create(data);
    return await this.userRepo.save(user);
  }

  async updateUser(id: number, data: DeepPartial<User>) {
    const res = await this.userRepo.update(id, data);
    return res;
  }
}
