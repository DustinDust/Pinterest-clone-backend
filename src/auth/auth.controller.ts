import {
  BadRequestException,
  Body,
  Controller,
  Get,
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

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private firebaseService: FirebaseService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(@Request() req) {
    return await this.authService.signInUser(req.user.id, req.user.username);
  }

  @UseGuards(JwtAuthGuard)
  @Get('test')
  async testJwt(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refreshToken(@Request() req) {
    return await this.authService.refreshToken(
      req.user.refreshToken,
      req.user.id,
    );
  }

  @Post('sign-up')
  @UseInterceptors(FileInterceptor('profile-picture'))
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
