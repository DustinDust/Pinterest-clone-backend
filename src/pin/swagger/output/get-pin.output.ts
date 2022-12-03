import { ApiResponseProperty } from '@nestjs/swagger';

export class GetPinOutput {
  @ApiResponseProperty()
  id: number;
  @ApiResponseProperty()
  filename: string;
  @ApiResponseProperty()
  name: string;
  @ApiResponseProperty()
  createdAt: Date;
  @ApiResponseProperty()
  url: string;
}
