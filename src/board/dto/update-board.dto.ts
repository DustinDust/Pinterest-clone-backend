import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUrl } from 'class-validator';
import { BaseBoardDto } from './base-board.dto';

export class UpdateBoardDto extends PartialType(BaseBoardDto) {
  @IsUrl()
  @IsNotEmpty()
  @IsOptional()
  thumbnail: string;
}
