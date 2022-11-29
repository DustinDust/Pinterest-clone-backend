import { ApiProperty } from '@nestjs/swagger';

export class updateBoardInput {
  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({
    enum: [0, 1],
    description: '0 means private, 1 means public',
    required: false,
  })
  visibility?: number;
  @ApiProperty({ required: false })
  thumbnail: string;
}
