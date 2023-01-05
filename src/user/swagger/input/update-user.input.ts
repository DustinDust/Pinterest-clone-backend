import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserInput {
  @ApiProperty({
    description:
      "Only if you want to update username. Username can only alphanumeric string, undescore and dot. Underscore and dot can't  be at the start/end of the username, and can't be used multiple times in a row, or next to each other. Username must be between 8-20 characters length",
    required: false,
  })
  username?: string;

  @ApiProperty({
    description: 'Only if you want to update display name',
    required: false,
  })
  displayName?: string;

  @ApiProperty({
    description:
      'Only if you want to update your profile picture to an exited image url',
    required: false,
  })
  avatarUrl?: string;

  @ApiProperty({
    required: false,
    description:
      'Only if you want to update your profile picture to a new, uploaded image',
    type: 'string',
    format: 'binary',
  })
  'profile-picture'?: string;
}
