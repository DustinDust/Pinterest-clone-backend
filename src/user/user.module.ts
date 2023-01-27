import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserGateway } from './user.gateway';
import { UpdatesModule } from 'src/updates/updates.module';

@Module({
  controllers: [UserController],
  providers: [UserService, UserGateway],
  imports: [TypeOrmModule.forFeature([User]), UpdatesModule],
  exports: [UserService],
})
export class UserModule {}
