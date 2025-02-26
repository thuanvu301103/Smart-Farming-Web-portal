import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(3004, { cors: { origin: '*' } }) // ✅ Ensure correct port & CORS
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private logger = new Logger('NotificationGateway');

    @WebSocketServer()
    server: Server;

    constructor() {
        this.logger.log('✅ WebSocket Gateway Initialized'); // ✅ Check if this logs
    }

    handleConnection(client: Socket) {
        this.logger.log(`🟢 Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`🔴 Client disconnected: ${client.id}`);
    }
}
