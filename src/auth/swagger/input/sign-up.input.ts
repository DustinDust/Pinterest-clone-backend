import { ApiProperty } from '@nestjs/swagger';

export class SignUpInput {
  @ApiProperty({
    required: true,
    description:
      "username can only alphanumeric string, undescore and dot. Underscore and dot can't  be at the start/end of the username, and can't be used multiple times in a row, or next to each other. Username must be between 8-20 characters length",
  })
  username: string;

  @ApiProperty({
    required: true,
    minLength: 6,
    maxLength: 20,
  })
  password: string;

  @ApiProperty({
    required: true,
    minLength: 6,
    maxLength: 20,
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
