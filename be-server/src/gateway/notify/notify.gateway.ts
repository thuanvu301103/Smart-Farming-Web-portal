import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
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

    private clients = new Map(); // Store user ID → Socket ID mapping

    constructor() {
        this.logger.log('WebSocket Gateway Initialized'); // ✅ Check if this logs
    }

    handleConnection(client: Socket) {
        const query = client.handshake.query;
        let userId = query.userId; // No need for `[0]` unless it's an array

        if (Array.isArray(userId)) {
            userId = userId[0];
        }

        if (userId) {
            this.registerClient(userId, client.id);
            this.logger.log(`Client connected: ${client.id} - userId: ${userId}`);
        } else {
            this.logger.warn(`Client connected without userId: ${client.id}`);
            client.disconnect(); // Optionally disconnect unknown clients
        }
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
        this.clients.forEach((value, key) => {
            if (value === client.id) this.clients.delete(key);
        });
    }

    // Store user ID when they log in
    registerClient(userId: string, clientId: string) {
        this.clients.set(userId, clientId);
    }

    sendToClient(userId: string, data) {
        const clientId = this.clients.get(userId);
        if (clientId) {
            const client: Socket = this.server.sockets.sockets.get(clientId);
            if (client) {
                client.emit('receiveNotification', data);
            }
        }
    }
}
