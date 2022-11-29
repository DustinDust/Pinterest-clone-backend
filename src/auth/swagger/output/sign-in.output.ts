import { ApiResponseProperty } from '@nestjs/swagger';

export class SignInOutput {
  @ApiResponseProperty()
  accessToken: string;

  @ApiResponseProperty()
  refreshToken: string;
}
