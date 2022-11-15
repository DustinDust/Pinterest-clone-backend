import { PartialType } from '@nestjs/swagger';
import { BaseBoardDto } from './base-board.dto';

export class UpdateBoardDto extends PartialType(BaseBoardDto) {}
