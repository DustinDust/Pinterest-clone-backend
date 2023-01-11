import { ApiProperty } from '@nestjs/swagger';

export class GetFollowersOutput {
  @ApiProperty()
  count: number;
  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        displayName: { type: 'string' },
        avatarUrl: { type: 'string' },
      },
    },
  })
  followers: {
    id: number;
    displayName: string;
    avatarUrl: string;
  }[];
}
