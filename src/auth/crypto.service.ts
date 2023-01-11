import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CryptoService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}
  async encrypt(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async check(password: string, hashPassword: string) {
    return await bcrypt.compare(password, hashPassword);
  }

  async generateJwt(payload: any) {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRESIN'),
    });
  }

  async verifyJwt(payload: string, mode: 'access' | 'refresh') {
    if (mode === 'access') {
      return await this.jwtService.verifyAsync(payload, {
        secret: this.configService.get('JWT_SECRET'),
      });
    } else {
      return await this.jwtService.verifyAsync(payload, {
        secret: this.configService.get('JWT_REFRESHSECRET'),
      });
    }
  }

  async generateRefreshToken(payload: any) {
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESHSECRET'),
    });
  }
}
