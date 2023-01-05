/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
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
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseService } from 'src/firebase/firebase.service';
import { UpdateUserInput } from './swagger/input/update-user.input';
import { randomUUID } from 'crypto';
import { UpdateUserOutput } from './swagger/output/update-user.output';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private firebaseService: FirebaseService,
  ) {}

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

  @ApiOperation({
    summary: 'Update user',
    description: 'Update user with JSON body',
  })
  @ApiConsumes('multipart/form')
  @ApiBody({ type: UpdateUserInput })
  @ApiCommon()
  @ApiOkResponse({ type: UpdateUserOutput })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiBearerAuth('access-token')
  @Put()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('profile-picture'))
  async updateUser(
    @Req() req,
    @Body() dto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (dto.avatarUrl) {
      const { hashPassword, hashRefeshToken, ...res } =
        await this.userService.updateUserInfo(req.user.id, dto);
      return res;
    } else if (file) {
      const url = await this.firebaseService.uploadFile(
        file,
        `${dto.username}-${randomUUID()}`,
        'userpfp',
      );
      dto.avatarUrl = url;
      const { hashPassword, hashRefeshToken, ...res } =
        await this.userService.updateUserInfo(req.user.id, dto);
      return res;
    } else {
      const { hashPassword, hashRefeshToken, ...res } =
        await this.userService.updateUserInfo(req.user.id, dto);
      return res;
    }
  }
}
