import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';

@WebSocketGateway({ cors: { origin: '*' } })
@Injectable()
export class OrdersGateway {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(OrdersGateway.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  broadcastNewOrder(order: any) {
    this.server.to('orders-room').emit('newOrder', order);
    this.logger.log(`Broadcasted new order: ${order.id}`);
  }

  broadcastOrderStatusUpdate(order: any) {
    // Notify React Dashboard
    this.server.to('orders-room').emit('orderStatusChanged', order);
    
    // Notify specific Flutter app customer
    if (order.customerPhone) {
      this.server.to(`customer-${order.customerPhone}`).emit('orderStatusChanged', {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        pickedUpAt: order.pickedUpAt,
        deliveredAt: order.deliveredAt,
      });
    }
  }

  @SubscribeMessage('join-customer-room')
  handleJoinCustomerRoom(@ConnectedSocket() client: Socket, @MessageBody() phone: string) {
    client.join(`customer-${phone}`);
    return { joined: true, room: `customer-${phone}` };
  }

  @SubscribeMessage('join-admin-room')
  async handleJoinAdminRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { token?: string; apiKey?: string },
  ) {
    // Validate either JWT token or API key
    const expectedKey = this.configService.get<string>('app.adminApiKey');
    const isValidApiKey = data && data.apiKey && data.apiKey === expectedKey;
    const isValidToken = data?.token ? await this.isValidAdminToken(data.token) : false;
    
    if (!isValidApiKey && !isValidToken) {
      client.emit('error', { message: 'مفتاح المصادقة غير صالح' });
      return;
    }
    
    client.join('orders-room');
    this.logger.log(`Admin client ${client.id} joined orders room`);
  }

  private async isValidAdminToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      if (!payload?.sub || payload.type !== 'admin') return false;

      const user = await this.prisma.adminUser.findUnique({
        where: { id: payload.sub },
      });
      return Boolean(user?.isActive);
    } catch {
      return false;
    }
  }
}
