import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards';
import { ApiCommon } from 'src/decorators/common-api.docs';
import { GetUserOutput } from './swagger/output/get-user.output';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({
    summary: 'get current user',
    description: 'Fetch user information given the right credentials',
  })
  @ApiOkResponse({ type: GetUserOutput })
  @ApiCommon()
  @ApiParam({
    name: 'id',
    description: 'id of the user whose info you wish to fetch',
    type: 'integer',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiBearerAuth('access-token')
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUser(@Req() req, @Param('id', new ParseIntPipe()) id: number) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hashRefeshToken, hashPassword, ...res } =
      await this.userService.findOneById(id);
    return res;
  }
}
