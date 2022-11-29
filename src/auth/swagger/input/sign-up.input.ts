import { ApiProperty } from '@nestjs/swagger';

export class SignUpInput {
  @ApiProperty({
    required: true,
  })
  username: string;

  @ApiProperty({
    required: true,
  })
  password: string;

  @ApiProperty({
    required: true,
  })
  repass: string;

  @ApiProperty({
    required: true,
  })
  displayName: string;

  @ApiProperty({
    required: false,
    description: 'Can be omitted',
  })
  avatarUrl?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'can be omitted',
  })
  'profile-picture'?: string;
}
