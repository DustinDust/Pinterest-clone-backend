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
    type: 'array',
    items: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'integer' },
        content: { type: 'string' },
        createdAt: { type: 'date' },
        updatedAt: { type: 'date' },
      },
    },
  })
  comments: {
    id: number;
    content: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
}
