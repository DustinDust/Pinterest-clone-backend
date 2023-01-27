import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { CryptoService } from './crypto.service';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private cryptoService: CryptoService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.findOneByUsername(username);
    if (!user) {
      return null;
    }
    const checkPass = await this.cryptoService.check(
      password,
      user.hashPassword,
    );
    if (!checkPass) {
      return null;
    }
    return user;
  }

  async validateUserJwtToken(token: string, mode: 'refresh' | 'access') {
    const data = await this.cryptoService.verifyJwt(token, mode);
    if (data.id) {
      const user = await this.userService.findOneById(data.id);
      return user;
    } else {
      throw new UnauthorizedException();
    }
  }

  async signInUser(id: number, username: string) {
    const accessToken = await this.cryptoService.generateJwt({
      id,
      username,
    });
    const refreshToken = await this.cryptoService.generateRefreshToken({
      id,
      username,
    });
    const hashRefeshToken = await this.cryptoService.encrypt(refreshToken);
    const res = await this.userService.updateUser(id, { hashRefeshToken });
    if (res.affected < 0) {
      throw new InternalServerErrorException(res.raw);
    }
    return {
      id,
      accessToken,
      refreshToken,
    };
  }

  async signUpUser(dto: SignUpDto) {
    const exisited = await this.userService.findOneByUsername(dto.username);
    if (exisited) {
      throw new BadRequestException(
        `User with username ${dto.username} has alreay existed`,
      );
    }
    if (dto.password !== dto.repass) {
      throw new BadRequestException(`
        Password does not match
      `);
    }
    const hashPassword = await this.cryptoService.encrypt(dto.password);
    const user = this.userService.createNewUser({
      username: dto.username,
      hashPassword: hashPassword,
      avatarUrl: dto.avatarUrl,
      displayName: dto.displayName,
    });
    return user;
  }

  async refreshToken(refreshToken: string, id: number) {
    const user = await this.userService.findOneById(id);
    const check = await this.cryptoService.check(
      refreshToken,
      user.hashRefeshToken,
    );
    if (check) {
      const accessToken = await this.cryptoService.generateJwt({
        id: user.id,
        username: user.username,
      });
      return {
        accessToken,
        refreshToken,
      };
    } else {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async signOut(userId: number) {
    return await this.userService.updateUser(userId, {
      hashRefeshToken: null,
      deviceToken: null,
    });
  }
}
