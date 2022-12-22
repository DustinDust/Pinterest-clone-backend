import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';

export class RemoveTagOutput {
  @ApiResponseProperty()
  id: number;

  @ApiProperty({
    readOnly: true,
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
      },
    },
  })
  tag: { id: number }[];
}
