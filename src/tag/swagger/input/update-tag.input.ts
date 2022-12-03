import { ApiProperty } from '@nestjs/swagger';

export class UpdateTagInput {
  @ApiProperty({ required: false })
  name?: string;
}
