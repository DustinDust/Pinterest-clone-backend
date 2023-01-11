import { ApiProperty } from '@nestjs/swagger';

export class GetFollowingOutput {
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
  following: {
    id: number;
    displayName: string;
    avatarUrl: string;
  }[];
}
