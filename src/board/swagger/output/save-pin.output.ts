import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Visibility } from 'src/board/board.entity';

export class SavePinOutput {
  @ApiResponseProperty()
  id: number;
  @ApiResponseProperty()
  name: string;
  @ApiResponseProperty()
  description: string;
  @ApiResponseProperty({ enum: [0, 1] })
  visibility: Visibility;
  @ApiProperty({
    readOnly: true,
    type: 'object',
    properties: {
      id: { type: 'integer' },
    },
  })
  user: {
    id: string;
  };
  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'integer' },
        url: { type: 'string' },
        filename: { type: 'string' },
        name: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        tags: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
            },
          },
        },
      },
    },
  })
  pins: {
    id: number;
    url: string;
    filename: string;
    name: string;
    tags: { id: number }[];
    createdAt: Date;
  }[];
  @ApiResponseProperty()
  createdAt: Date;
  @ApiResponseProperty()
  updateAt: Date;
  @ApiResponseProperty()
  thumbnail: string;
}
