import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, IsUrl, Min } from 'class-validator';

export class AddPinDto {
  @ApiProperty({
    required: false,
    description:
      'Only provided should you want to add an already existed pin to a board. Otherwise, leave null',
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  id?: number;

  @ApiProperty({
    required: false,
    description:
      'Only provided should this is a completely new pin. If "id" is presented, leave this as null',
  })
  @IsUrl()
  @IsOptional()
  url?: string;

  @ApiProperty({
    required: false,
    description:
      'Only provided should this is a completely new pin. If "id" is presented, leave this as null',
  })
  @IsString()
  @IsOptional()
  name?: string;
}
