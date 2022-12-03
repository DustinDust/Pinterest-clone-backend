import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';

export class CreateTagOutput {
  @ApiResponseProperty()
  id: number;
  @ApiResponseProperty()
  name: string;
  @ApiResponseProperty()
  createdAt: Date;
  @ApiResponseProperty()
  updateAt: Date;
}
