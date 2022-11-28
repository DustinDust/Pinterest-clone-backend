import { Controller, Get, Injectable, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  OmitType,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards';
import { User } from './user.entity';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({
    summary: 'get current user',
    description: 'Fetch user information given the right credentials',
  })
  @ApiOkResponse({
    type: OmitType(User, ['hashPassword', 'hashRefeshToken']),
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid access token',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Pass your access token here, prepended with "Bearer"',
    example:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  @ApiBearerAuth('access-token')
  @Get()
  @UseGuards(JwtAuthGuard)
  async getUser(@Req() req) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hashPassword, hashRefeshToken, ...res } =
      await this.userService.findOneById(req.user.id);
    return res;
  }
}
