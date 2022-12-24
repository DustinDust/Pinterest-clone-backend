import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Visibility } from 'src/board/board.entity';

export class GetPinsFromNameTagOutput {
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
        url: { type: 'string' },
        thumbnail: { type: 'string' },
        fileuuid: { type: 'string' },
        name: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  data: {
    id: number;
    url: string;
    thumbnail: string;
    fileuuid: string;
    name: string;
    createdAt: Date;
  }[];
}
