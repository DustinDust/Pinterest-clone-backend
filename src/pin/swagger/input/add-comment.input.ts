import { ApiProperty } from '@nestjs/swagger';

export class AddCommentInput {
  @ApiProperty({
    required: false,
    description:
      'content of comment you want to add to pin',
  })
  content?: string;
}
