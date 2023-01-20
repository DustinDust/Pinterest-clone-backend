import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class AddCommentDto {
  @IsString()
  @IsOptional()
  content?: string;
}
