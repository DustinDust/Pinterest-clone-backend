import { Module } from '@nestjs/common';
import { UpdatesService } from './updates.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Update } from './update.entity';

@Module({
  providers: [UpdatesService],
  imports: [TypeOrmModule.forFeature([Update])],
  exports: [UpdatesService],
})
export class UpdatesModule {}
