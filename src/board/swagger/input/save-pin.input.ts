import { ApiProperty } from '@nestjs/swagger';

export class SavePinInput {
  @ApiProperty({
    required: false,
    description:
      'Only provided should you want to add an already existed pin to a board. Otherwise, leave null',
  })
  id?: number;

  @ApiProperty({
    required: false,
    description:
      'Only provided should this is a completely new pin. If "id" is presented, leave this as null',
  })
  url?: string;

  @ApiProperty({
    required: false,
    description:
      'Only provided should this is a complete new pin and no url is provided. Otherwise this should be null',
    type: 'string',
    format: 'binary',
  })
  image?: string;

  @ApiProperty({
    required: false,
    description:
      'Only provided should this is a completely new pin. If "id" is presented, leave this as null',
  })
  name?: string;
}
