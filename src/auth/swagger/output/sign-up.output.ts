import { ApiResponseProperty } from '@nestjs/swagger';

export class SignUpOutput {
  @ApiResponseProperty()
  username: string;
  @ApiResponseProperty()
  displayName: string;
  @ApiResponseProperty()
  avatarUrl: string;
  @ApiResponseProperty()
  id: number;
  @ApiResponseProperty()
  createdAt: Date;
  @ApiResponseProperty()
  updatedAt: Date;
}
