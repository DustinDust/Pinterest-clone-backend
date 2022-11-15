import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  repass: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  displayName: string;

  @ApiProperty()
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
}
