import { ApiProperty } from '@nestjs/swagger';

export class GetUpdatesOutput {
  @ApiProperty({
    required: true,
  })
  id: number;

  @ApiProperty({
    required: false,
  })
  title?: string;

  @ApiProperty({
    required: false,
  })
  event?: string;

  @ApiProperty({
    type: 'object',
    description: 'Could be anything, depends on the type of the event',
    required: false,
  })
  data?: any;

  @ApiProperty({
    required: false,
  })
  text?: string;

  @ApiProperty({
    required: true,
  })
  createdAt: Date;

  @ApiProperty({
    type: 'object',
    required: true,
    properties: {
      id: {
        type: 'number',
        description: 'id of the user the updates were meant for',
      },
    },
  })
  user: {
    id: number;
  };
}
