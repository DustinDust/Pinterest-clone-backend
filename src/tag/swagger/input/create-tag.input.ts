import { ApiProperty } from '@nestjs/swagger';

export class CreateTagInput {
  @ApiProperty({
    required: true,
  })
  name: string;
}
