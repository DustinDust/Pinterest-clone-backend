import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Req,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { JwtAuthGuard, JwtRefreshGuard, LocalAuthGuard } from './guards';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseService } from 'src/firebase/firebase.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { SignUpInput } from './swagger/input/sign-up.input';
import { SignInInput } from './swagger/input/sign-in.input';
import { ApiCommon } from 'src/decorators/common-api.docs';
import { SignUpOutput } from './swagger/output/sign-up.output';
import { SignInOutput } from './swagger/output/sign-in.output';
import { RefreshOutput } from './swagger/output/refresh.output';
import { randomUUID } from 'crypto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private firebaseService: FirebaseService,
  ) {}

  @ApiOkResponse({ type: SignInOutput })
  @ApiBody({ type: SignInInput })
  @ApiUnauthorizedResponse({
    description: 'Failed to sign user in with that credentials',
  })
  @ApiOperation({
    summary: 'Sign in route',
    description: 'Sign an user in',
  })
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() loginDto: LoginDto, @Request() req) {
    return await this.authService.signInUser(req.user.id, req.user.username);
  }

  @ApiCommon()
  @ApiOperation({
    summary: "Test an user's access token",
    description: 'Require bearer token in header',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('test')
  async testJwt(@Request() req) {
    return req.user;
  }

  @ApiOperation({
    summary: 'Refresh a token',
    description: 'Refresh access token to get a new token',
  })
  @ApiOkResponse({ type: RefreshOutput })
  @ApiCommon()
  @ApiBearerAuth('refresh-token')
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Request() req) {
    return await this.authService.refreshToken(
      req.user.refreshToken,
      req.user.id,
    );
  }

  @ApiOkResponse({ type: SignUpOutput })
  @ApiBody({ type: SignUpInput })
  @ApiInternalServerErrorResponse({
    description: 'File upload or user creation has faulted',
  })
  @ApiBadRequestResponse({
    description: 'Username has already been in use',
  })
  @ApiOperation({
    summary: 'Sign-up a new user',
    description: 'Sign an user app',
  })
  @ApiConsumes('multipart/form-data')
  @Post('sign-up')
  @UseInterceptors(FileInterceptor('profile-picture'))
  @HttpCode(HttpStatus.OK)
  async signUp(
    @Body() dto: SignUpDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (dto.avatarUrl) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { hashPassword, hashRefeshToken, boards, ...res } =
        await this.authService.signUpUser(dto);
      return res;
    } else if (file) {
      // console.log(file);
      try {
        const url = await this.firebaseService.uploadFile(
          file,
          `${dto.username}-${randomUUID()}`,
          'userpfp',
        );
        dto.avatarUrl = url;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { hashPassword, hashRefeshToken, boards, ...res } =
          await this.authService.signUpUser(dto);
        return res;
      } catch (err) {
        throw new InternalServerErrorException(err);
      }
    } else {
      dto.avatarUrl = 'https://i.stack.imgur.com/34AD2.jpg';
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { hashPassword, hashRefeshToken, boards, ...res } =
        await this.authService.signUpUser(dto);
      return res;
    }
  }

  @ApiBearerAuth('access-token')
  @ApiOkResponse({
    description: 'Successfully sign user out',
  })
  @ApiCommon()
  @UseGuards(JwtAuthGuard)
  @Post('sign-out/')
  async signOut(@Request() req) {
    await this.signOut(req.user.id);
  }
}
