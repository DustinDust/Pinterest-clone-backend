import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
} from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  @Matches(/^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/, {
    message:
      "username can only alphanumeric string, undescore and dot. Underscore and dot can't  be at the start/end of the username, and can't be used multiple times in a row, or next to each other. Username must be between 8-20 characters length",
  })
  username?: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  displayName?: string;

  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
}
