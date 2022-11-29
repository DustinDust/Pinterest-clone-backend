import { ApiResponseProperty } from '@nestjs/swagger';

export class DeleteBoardOutput {
  @ApiResponseProperty()
  raw: any;

  @ApiResponseProperty()
  affected: number | null;
}
