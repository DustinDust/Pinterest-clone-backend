import { ApiProperty } from '@nestjs/swagger';

export class CreateBoardInput {
  @ApiProperty({
    required: true,
  })
  name: string;
  @ApiProperty({
    required: true,
  })
  description: string;
  @ApiProperty({
    required: true,
    enum: [0, 1],
    type: 'integer',
    description: '0 - Private, 1 - public',
  })
  visibility: number;
}
