import { ApiResponseProperty } from '@nestjs/swagger';

export class GetPinsOutput {
  @ApiResponseProperty()
  id: number;
  @ApiResponseProperty()
  url: string;
  @ApiResponseProperty()
  filename: string;
  @ApiResponseProperty()
  name: string;
  @ApiResponseProperty()
  createdAt: Date;
}
