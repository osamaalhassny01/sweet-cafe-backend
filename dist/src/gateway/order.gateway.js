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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
let OrderGateway = class OrderGateway {
    handleConnection(client) {
        client.join('orders-room');
    }
    broadcastNewOrder(order) {
        this.server.to('orders-room').emit('new-order', order);
    }
    broadcastOrderStatusUpdate(order) {
        this.server.to(`customer-${order.customerPhone}`).emit('order-status-updated', {
            orderId: order.id,
            orderNumber: order.orderNumber,
            status: order.status,
            pickedUpAt: order.pickedUpAt,
            deliveredAt: order.deliveredAt,
        });
        this.server.to('orders-room').emit('order-status-updated', order);
    }
    handleJoinCustomerRoom(client, phone) {
        client.join(`customer-${phone}`);
        return { joined: true };
    }
    handleJoinAdminRoom(client) {
        client.join('orders-room');
        return { joined: true };
    }
};
exports.OrderGateway = OrderGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], OrderGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join-customer-room'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], OrderGateway.prototype, "handleJoinCustomerRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('join-admin-room'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], OrderGateway.prototype, "handleJoinAdminRoom", null);
exports.OrderGateway = OrderGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: { origin: '*' } }),
    (0, common_1.Injectable)()
], OrderGateway);
//# sourceMappingURL=order.gateway.js.map