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

  @ApiProperty({
    required: false,
    description:
      'Only provided if you want to add exisiting tags when saving pin',
    type: 'array',
    items: {
      type: 'number',
    },
  })
  tagIds: number[];

  @ApiProperty({
    required: false,
    description: 'Only provided if you want to add new tags when saving pin',
    type: 'array',
    items: {
      type: 'string',
    },
  })
  tagNames: string[];
}
