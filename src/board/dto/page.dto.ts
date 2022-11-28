import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class PageDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Type(() => Number)
  @ApiProperty({
    description: 'Index of page you want to fetch. Used in pagination queries',
  })
  pageNum: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Type(() => Number)
  @ApiProperty({
    description:
      'Size of the page you want to fetch. Used in pagination queries',
  })
  pageSize: number;
}
