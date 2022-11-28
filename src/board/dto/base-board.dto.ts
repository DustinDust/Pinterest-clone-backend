import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class BaseBoardDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsNumber()
  @IsIn([1, 0])
  @ApiProperty({
    enum: [0, 1],
    description: '0 means private, 1 means public',
  })
  visibility: number;
}
