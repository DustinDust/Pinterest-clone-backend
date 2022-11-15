import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
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
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private firebaseService: FirebaseService,
  ) {}

  @ApiBody({
    required: true,
    schema: {
      required: ['username', 'password'],
      properties: {
        username: {
          type: 'string',
          description: 'username',
        },
        password: {
          type: 'string',
          description: 'password',
        },
      },
    },
  })
  @ApiOkResponse({
    schema: {
      properties: {
        accessToken: {
          type: 'string',
          description: "user's access token",
        },
        refreshToken: {
          type: 'string',
          description: "user's refresh token",
        },
      },
    },
  })
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

  @ApiOkResponse({
    description: 'OK',
  })
  @ApiOperation({
    summary: "Test an user's access token",
    description: 'Require bearer token in header',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('test')
  async testJwt(@Request() req) {
    return req.user;
  }

  @ApiOperation({
    summary: 'Refresh a token',
    description: 'Refresh access token to get a new token',
  })
  @ApiOkResponse({
    schema: {
      properties: {
        accessToken: {
          type: 'string',
          description: 'new access token',
        },
        refreshToken: {
          type: 'string',
          description: 'refresh token',
        },
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Request() req) {
    return await this.authService.refreshToken(
      req.user.refreshToken,
      req.user.id,
    );
  }

  @ApiOperation({
    summary: 'Sign-up a new user',
    description: 'Sign an user app',
  })
  @Post('sign-up')
  @UseInterceptors(FileInterceptor('profile-picture'))
  @HttpCode(HttpStatus.OK)
  async signUp(
    @Body() dto: SignUpDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (dto.avatarUrl) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { hashPassword, hashRefeshToken, ...res } =
        await this.authService.signUpUser(dto);
      return res;
    } else if (file) {
      try {
        const url = await this.firebaseService.uploadFile(file);
        dto.avatarUrl = url;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { hashPassword, hashRefeshToken, ...res } =
          await this.authService.signUpUser(dto);
        return res;
      } catch (err) {
        throw new InternalServerErrorException(err);
      }
    } else {
      throw new BadRequestException('Must contain profile picture url');
    }
  }
}
