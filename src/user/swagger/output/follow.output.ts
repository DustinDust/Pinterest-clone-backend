import { ApiProperty } from '@nestjs/swagger';

export class FollowOutput {
  @ApiProperty()
  id: number;
  @ApiProperty()
  displayName: string;
  @ApiProperty()
  avatarUrl: string;
}
