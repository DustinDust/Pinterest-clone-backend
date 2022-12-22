import { ApiProperty } from '@nestjs/swagger';

export class SaveTagInput {
  @ApiProperty({
    required: false,
    description:
      'Only provided should you want to add an already existed tag to a pin. Otherwise, leave null',
  })
  id?: number;

  @ApiProperty({
    required: false,
    description:
      'Only provided should this is a completely new tag. If "id" is presented, leave this as null',
  })
  name?: string;
}
