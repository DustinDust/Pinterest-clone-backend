import { ApiResponseProperty } from '@nestjs/swagger';

export class RefreshOutput {
  @ApiResponseProperty()
  accessToken: string;

  @ApiResponseProperty()
  refreshToken: string;
}
