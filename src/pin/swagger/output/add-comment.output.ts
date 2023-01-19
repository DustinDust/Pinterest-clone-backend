import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';

export class AddCommentOutput {
  @ApiResponseProperty()
  id: number;
  @ApiResponseProperty()
  url: string;
  @ApiResponseProperty()
  fileuuid: string;
  @ApiResponseProperty()
  name: string;
  @ApiResponseProperty()
  createdAt: Date;
  @ApiResponseProperty()
  thumbnail: string;
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
