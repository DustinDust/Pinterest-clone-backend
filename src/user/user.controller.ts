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
import { UnfollowOutput } from './swagger/output/unfollow.output';
import { FollowOutput } from './swagger/output/follow.output';
import { GetFollowersOutput } from './swagger/output/get-followers.output';
import { GetFollowingOutput } from './swagger/output/get-following.output';

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

  @ApiCommon()
  @ApiOkResponse({ type: GetFollowersOutput })
  @ApiParam({
    name: 'id',
    description: 'Id of the user whose followers you want to fetch',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get(':id/followers')
  async getFollowers(@Req() req, @Param('id', new ParseIntPipe()) id: number) {
    return await this.userService.getFollowers(id);
  }

  @ApiCommon()
  @ApiOkResponse({ type: GetFollowingOutput })
  @ApiParam({
    name: 'id',
    description: 'Id of the user whose following you want to fetch',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get(':id/following')
  async getFollowing(@Req() req, @Param('id', new ParseIntPipe()) id: number) {
    return await this.userService.getFollowing(id);
  }

  @ApiParam({
    name: 'id',
    description: 'Id of the user that the current user want to follow',
  })
  @ApiOkResponse({ type: FollowOutput, isArray: true })
  @ApiCommon()
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Put('follow/:id')
  async follow(@Req() req, @Param('id', new ParseIntPipe()) id: number) {
    const { hashPassword, hashRefeshToken, ...res } =
      await this.userService.follow(req.user.id, id);
    return res.following.map((v) => {
      return {
        id: v.id,
        displayName: v.displayName,
        avatarUrl: v.avatarUrl,
      };
    });
  }

  @ApiParam({
    name: 'id',
    description: 'Id of the user that the current user want to unfollow',
  })
  @ApiCommon()
  @ApiOkResponse({ type: UnfollowOutput, isArray: true })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Put('unfollow/:id')
  async unfollow(@Req() req, @Param('id', new ParseIntPipe()) id: number) {
    const { hashPassword, hashRefeshToken, ...res } =
      await this.userService.unfollow(req.user.id, id);
    return res.following.map((v) => {
      return {
        id: v.id,
        displayName: v.displayName,
        avatarUrl: v.avatarUrl,
      };
    });
  }
}
