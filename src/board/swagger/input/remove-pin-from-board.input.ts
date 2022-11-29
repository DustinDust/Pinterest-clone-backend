import { ApiProperty } from '@nestjs/swagger';

export class RemovePinInput {
  @ApiProperty({ required: true, type: 'integer' })
  id: number;
}
