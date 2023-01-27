import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentInput {
  @ApiProperty({ required: true })
  content?: string;
}
