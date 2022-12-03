import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';

export class GetUserOutput {
  @ApiResponseProperty({
    type: 'integer',
  })
  id: number;
  @ApiResponseProperty({
    type: 'string',
  })
  username: string;
  @ApiResponseProperty({
    type: 'string',
  })
  displayname: string;
  @ApiResponseProperty({
    type: 'string',
  })
  avatarUrl: string;
  @ApiResponseProperty({
    type: 'string',
    format: 'date-time',
  })
  createdAt: string;
  @ApiResponseProperty({
    type: 'string',
    format: 'date-time',
  })
  updatedAt: string;
}
