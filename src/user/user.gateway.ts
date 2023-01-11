import { Injectable } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { instrument } from '@socket.io/admin-ui';
import { Socket } from 'dgram';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transports: ['websocket'],
  namespace: 'user',
})
@Injectable()
export class UserGateway implements OnGatewayConnection, OnGatewayInit {
  afterInit(server: any) {
    console.log('after init');
  }
  @WebSocketServer()
  server: Server;

  handleConnection(client: any, ...args: any[]) {
    console.log(`client ${client.id} connected!`);
  }
}
