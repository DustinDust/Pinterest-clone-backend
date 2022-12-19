import { ApiProperty } from '@nestjs/swagger';

export class RemoveTagInput {
  @ApiProperty({ required: true, type: 'integer' })
  id: number;
}
