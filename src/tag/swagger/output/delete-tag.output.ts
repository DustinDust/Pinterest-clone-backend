import { ApiResponseProperty } from '@nestjs/swagger';

export class DeleteTagOutput {
  @ApiResponseProperty()
  raw: any;

  @ApiResponseProperty()
  affected: number | null;
}
