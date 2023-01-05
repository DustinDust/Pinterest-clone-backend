import { ApiResponseProperty } from '@nestjs/swagger';

export class UpdateUserOutput {
  @ApiResponseProperty()
  id: number;
  @ApiResponseProperty()
  username: string;
  @ApiResponseProperty()
  displayName: string;
  @ApiResponseProperty()
  avatarUrl: string;
  @ApiResponseProperty()
  createdAt: Date;
  @ApiResponseProperty()
  updatedAt: Date;
}
