import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';

export class CreateBoardOutput {
  @ApiResponseProperty()
  id: number;
  @ApiResponseProperty()
  name: string;
  @ApiResponseProperty()
  description: string;
  @ApiResponseProperty()
  visibility: string;
  @ApiProperty({
    type: 'object',
    readOnly: true,
    properties: {
      id: { type: 'integer' },
    },
  })
  user: {
    id: number;
  };
}
