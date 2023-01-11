import { ApiProperty } from '@nestjs/swagger';

export class UnfollowOutput {
  @ApiProperty()
  id: number;
  @ApiProperty()
  displayName: string;
  @ApiProperty()
  avatarUrl: string;
}
