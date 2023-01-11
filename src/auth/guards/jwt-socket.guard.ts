import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Socket } from 'socket.io';
import { AuthService } from '../auth.service';
import { WsException } from '@nestjs/websockets';

export class JwtSocketGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const bearerToken = context
      .switchToWs()
      .getClient<Socket>()
      .handshake.headers.authorization.split(' ')[1];
    try {
      const decodedUser = await this.authService.validateUserJwtToken(
        bearerToken,
        'access',
      );
      if (decodedUser) {
        return true;
      }
    } catch (unauth) {
      throw new WsException(unauth);
    }
  }
}
