import { ApiResponseProperty } from '@nestjs/swagger';
import { Visibility } from 'src/board/board.entity';

export class GetAllBoardOutput {
  @ApiResponseProperty()
  id: number;
  @ApiResponseProperty()
  name: string;
  @ApiResponseProperty()
  description: string;
  @ApiResponseProperty()
  visibility: Visibility;
  @ApiResponseProperty()
  createdAt: Date;
  @ApiResponseProperty()
  updateAt: Date;
  @ApiResponseProperty()
  thumbnail: string;
}
