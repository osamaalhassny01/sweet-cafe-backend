import { Server, Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
export declare class OrdersGateway {
    private readonly configService;
    private readonly jwtService;
    private readonly prisma;
    server: Server;
    private readonly logger;
    constructor(configService: ConfigService, jwtService: JwtService, prisma: PrismaService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    broadcastNewOrder(order: any): void;
    broadcastOrderStatusUpdate(order: any): void;
    handleJoinCustomerRoom(client: Socket, phone: string): {
        joined: boolean;
        room: string;
    };
    handleJoinAdminRoom(client: Socket, data: {
        token?: string;
        apiKey?: string;
    }): Promise<void>;
    private isValidAdminToken;
}
