"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var OrdersGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../prisma/prisma.service");
let OrdersGateway = OrdersGateway_1 = class OrdersGateway {
    constructor(configService, jwtService, prisma) {
        this.configService = configService;
        this.jwtService = jwtService;
        this.prisma = prisma;
        this.logger = new common_1.Logger(OrdersGateway_1.name);
    }
    handleConnection(client) {
        this.logger.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    broadcastNewOrder(order) {
        this.server.to('orders-room').emit('newOrder', order);
        this.logger.log(`Broadcasted new order: ${order.id}`);
    }
    broadcastOrderStatusUpdate(order) {
        this.server.to('orders-room').emit('orderStatusChanged', order);
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
    handleJoinCustomerRoom(client, phone) {
        client.join(`customer-${phone}`);
        return { joined: true, room: `customer-${phone}` };
    }
    async handleJoinAdminRoom(client, data) {
        const expectedKey = this.configService.get('app.adminApiKey');
        const isValidApiKey = data && data.apiKey && data.apiKey === expectedKey;
        const isValidToken = data?.token ? await this.isValidAdminToken(data.token) : false;
        if (!isValidApiKey && !isValidToken) {
            client.emit('error', { message: 'مفتاح المصادقة غير صالح' });
            return;
        }
        client.join('orders-room');
        this.logger.log(`Admin client ${client.id} joined orders room`);
    }
    async isValidAdminToken(token) {
        try {
            const payload = await this.jwtService.verifyAsync(token);
            if (!payload?.sub || payload.type !== 'admin')
                return false;
            const user = await this.prisma.adminUser.findUnique({
                where: { id: payload.sub },
            });
            return Boolean(user?.isActive);
        }
        catch {
            return false;
        }
    }
};
exports.OrdersGateway = OrdersGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], OrdersGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join-customer-room'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], OrdersGateway.prototype, "handleJoinCustomerRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('join-admin-room'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], OrdersGateway.prototype, "handleJoinAdminRoom", null);
exports.OrdersGateway = OrdersGateway = OrdersGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: { origin: '*' } }),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        jwt_1.JwtService,
        prisma_service_1.PrismaService])
], OrdersGateway);
//# sourceMappingURL=orders.gateway.js.map