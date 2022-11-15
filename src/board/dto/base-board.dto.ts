import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class BaseBoardDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsIn([1, 0])
  visibility: number;
}
