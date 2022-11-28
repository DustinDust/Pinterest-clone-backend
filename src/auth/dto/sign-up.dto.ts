import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
  })
  username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
  })
  repass: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
  })
  displayName: string;

  @ApiProperty({
    required: false,
    description: 'Can be replaced with a file upload from user in the form',
  })
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
}
