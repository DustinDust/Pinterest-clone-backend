import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';

export class RemovePinOutput {
  @ApiResponseProperty()
  id: number;
  @ApiProperty({
    readOnly: true,
    type: 'object',
    properties: {
      id: { type: 'integer' },
    },
  })
  user: {
    id: number;
  };
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
  pin: { id: number }[];
}
