import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class PageDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Type(() => Number)
  @ApiProperty()
  pageNum: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Type(() => Number)
  @ApiProperty()
  pageSize: number;
}
