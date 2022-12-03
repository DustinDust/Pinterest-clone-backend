import { ApiResponseProperty } from '@nestjs/swagger';


export class GetAllTagOutput {
  @ApiResponseProperty()
  id: number;
  @ApiResponseProperty()
  name: string;
  @ApiResponseProperty()
  createdAt: Date;
  @ApiResponseProperty()
  updateAt: Date;
}
