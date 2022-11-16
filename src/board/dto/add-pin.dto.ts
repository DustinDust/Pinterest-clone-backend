import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, IsUrl, Min } from 'class-validator';

export class AddPinDto {
  @IsNumber()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  id?: number;

  @IsUrl()
  @IsOptional()
  url?: string;

  @IsString()
  @IsOptional()
  name?: string;
}
