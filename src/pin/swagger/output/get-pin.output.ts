import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';

export class GetPinOutput {
  @ApiResponseProperty()
  id: number;
  @ApiResponseProperty()
  filename: string;
  @ApiResponseProperty()
  name: string;
  @ApiResponseProperty()
  createdAt: Date;
  @ApiResponseProperty()
  url: string;
  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  tags: {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  }[];

  @ApiProperty({
    type: 'object',
    properties: {
      id: { type: 'number' },
      username: { type: 'string' },
      displayName: { type: 'string' },
      avatarUrl: { type: 'string' },
      followersCount: { type: 'number' },
    },
  })
  user: {
    id: number;
    username: string;
    displayName: string;
    avatarUrl: string;
    followersCount: number;
  };

  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'integer' },
        content: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            username: { type: 'string' },
            displayName: { type: 'string' },
            avatarUrl: { type: 'string' },
          },
        },
      },
    },
  })
  comments: {
    id: number;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    user: {
      id: number;
      username: string;
      displayName: string;
      avatarUrl: string;
    };
  }[];
}
