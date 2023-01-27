import { ApiResponseProperty } from '@nestjs/swagger';

export class UpdateCommentOutput {
  @ApiResponseProperty()
  id: number;
  @ApiResponseProperty()
  content: string;
  @ApiResponseProperty()
  createdAt: Date;
  @ApiResponseProperty()
  updateAt: Date;
}
