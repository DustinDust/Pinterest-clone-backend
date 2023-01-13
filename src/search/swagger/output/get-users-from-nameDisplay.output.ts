import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';

export class GetUsersFromNameDisplayOutput {
  @ApiResponseProperty()
  pageIndex: number;
  @ApiResponseProperty()
  pageSize: number;
  @ApiResponseProperty()
  total: number;
  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        displayName: { type: 'string' },
        username: { type: 'string' },
        avatarUrl: { type: 'string' },
      },
    },
  })
  data: {
    id: number;
    displayName: string;
    username: string;
    avatarUrl: string;
  }[];
}
