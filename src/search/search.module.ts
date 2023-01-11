import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pin } from 'src/pin/pin.entity';
import { Tag } from 'src/tag/entities/tag.entity';
import { User } from 'src/user/user.entity';

@Module({
  controllers: [SearchController],
  providers: [SearchService],
  imports: [TypeOrmModule.forFeature([Pin, Tag, User])],
})
export class SearchModule {}
