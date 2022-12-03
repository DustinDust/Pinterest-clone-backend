import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PinController } from './pin.controller';
import { Pin } from './pin.entity';
import { PinService } from './pin.service';

@Module({
  controllers: [PinController],
  providers: [PinService],
  imports: [TypeOrmModule.forFeature([Pin])],
})
export class PinModule {}
