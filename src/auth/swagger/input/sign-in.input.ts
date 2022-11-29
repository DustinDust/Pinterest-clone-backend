import { ApiProperty } from '@nestjs/swagger';

export class SignInInput {
  @ApiProperty({
    required: true,
  })
  username: string;

  @ApiProperty({
    required: true,
  })
  password: string;
}
