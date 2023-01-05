import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async findOneById(id: number) {
    const user = await this.userRepo.findOneBy({ id: id });
    if (!user) {
      throw new NotFoundException('User not found');
    } else {
      return user;
    }
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

  async updateUserInfo(id: number, data: UpdateUserDto) {
    await this.userRepo.update(id, data);
    return await this.userRepo.findOneBy({ id });
  }

  async updateUser(id: number, data: DeepPartial<User>) {
    const res = await this.userRepo.update(id, data);
    return res;
  }
}
