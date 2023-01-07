import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';

export class GetBoardsAndUserFromPin {
  @ApiResponseProperty()
  id: number;
  @ApiResponseProperty()
  name: string;
  @ApiResponseProperty()
  thumbnail: string;
  @ApiProperty({
    type: 'object',
    properties: {
      id: { type: 'number' },
      username: { type: 'string' },
      displayName: { type: 'string' },
      avatarUrl: { type: 'string' },
    },
  })
  user: {
    id: number;
    username: string;
    displayName: string;
    avatarUrl: string;
  };
}
