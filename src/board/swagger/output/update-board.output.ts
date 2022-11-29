import { ApiResponseProperty } from '@nestjs/swagger';
import { Visibility } from 'src/board/board.entity';

export class UpdateBoardOutput {
  @ApiResponseProperty()
  id: number;
  @ApiResponseProperty()
  name: string;
  @ApiResponseProperty()
  description: string;
  @ApiResponseProperty()
  visibility: Visibility;
  @ApiResponseProperty()
  thumbnail: string;
}
