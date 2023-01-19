import { ApiResponseProperty } from '@nestjs/swagger';

export class DeleteCommentOutput {
  @ApiResponseProperty()
  raw: any;

  @ApiResponseProperty()
  affected: number | null;
}
