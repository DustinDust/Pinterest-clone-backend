import { ApiResponseProperty } from '@nestjs/swagger';

export class GetTagOutput {
  @ApiResponseProperty()
  id: number;

  @ApiResponseProperty()
  name: string;

  @ApiResponseProperty()
  createdAt: Date;
  
  @ApiResponseProperty()
  updateAt: Date;
}
