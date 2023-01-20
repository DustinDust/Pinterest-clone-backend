import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserGateway } from './user.gateway';
import { Comment } from 'src/comment/entities/comment.entity';

@Module({
  controllers: [UserController],
  providers: [UserService, UserGateway],
  imports: [TypeOrmModule.forFeature([User])],
  exports: [UserService],
})
export class UserModule {}
