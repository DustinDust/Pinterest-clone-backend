import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  repass: string;

  @IsNotEmpty()
  @IsString()
  displayName: string;

  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
}
