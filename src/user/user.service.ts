import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserGateway } from './user.gateway';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private userGateway: UserGateway,
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

  async getFollowers(id: number) {
    const res = await this.userRepo.findOne({
      relations: {
        followers: true,
      },
      where: {
        id: id,
      },
      select: {
        followers: {
          avatarUrl: true,
          displayName: true,
          id: true,
        },
      },
    });
    return {
      count: res.followers.length,
      followers: res.followers,
    };
  }

  async getFollowing(id: number) {
    const res = await this.userRepo.findOne({
      relations: {
        following: true,
      },
      where: {
        id: id,
      },
      select: {
        following: {
          avatarUrl: true,
          displayName: true,
          id: true,
        },
      },
    });
    return {
      count: res.following.length,
      following: res.following,
    };
  }

  async follow(userId: number, followUserId: number) {
    const user = await this.userRepo.findOne({
      relations: {
        following: true,
      },
      where: {
        id: userId,
      },
    });
    const followUser = await this.userRepo.findOneBy({ id: followUserId });
    const isFollowed =
      user.following.filter((x) => x.id === followUser.id).length > 0;
    if (!isFollowed) {
      user.following.push(followUser);
      const res = await this.userRepo.save(user);
      try {
        this.userGateway.server.emit(`${followUser.id}`, {
          event: 'follow',
          data: {
            id: user.id,
            displayName: user.displayName,
            avatarUrl: user.avatarUrl,
          },
        });
      } catch (err: any) {
        console.log(err);
      }
      return res;
    } else {
      throw new BadRequestException('Already followed user');
    }
  }

  async unfollow(userId: number, followerId: number) {
    const user = await this.userRepo.findOne({
      relations: {
        following: true,
      },
      where: {
        id: userId,
      },
    });
    const following = user.following.filter((v) => v.id !== followerId);
    user.following = following;
    return await this.userRepo.save(user);
  }
}
