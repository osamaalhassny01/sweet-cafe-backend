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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KitchenGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let KitchenGateway = class KitchenGateway {
    constructor(prisma) {
        this.prisma = prisma;
    }
    handleConnection(client) {
        client.join('kitchen-room');
    }
    broadcastNewOrder(order) {
        this.server.to('kitchen-room').emit('new-order', order);
    }
    broadcastOrderStatusUpdate(order) {
        this.server.to('kitchen-room').emit('order-status-updated', order);
    }
    broadcastItemStatusUpdate(orderId, itemId, itemStatus) {
        this.server.to('kitchen-room').emit('item-status-updated', { orderId, itemId, itemStatus });
    }
    broadcastTableUpdate(table) {
        this.server.to('kitchen-room').emit('table-updated', table);
    }
    async handleUpdateItemStatus(client, data) {
        const item = await this.prisma.orderItem.update({
            where: { id: data.itemId },
            data: {
                itemStatus: data.itemStatus,
                startedAt: data.itemStatus === 'PREPARING' ? new Date() : undefined,
                completedAt: data.itemStatus === 'READY' ? new Date() : undefined,
            },
        });
        const orderItems = await this.prisma.orderItem.findMany({ where: { orderId: data.orderId } });
        const allReady = orderItems.every(i => i.itemStatus === 'READY');
        if (allReady) {
            await this.prisma.order.update({ where: { id: data.orderId }, data: { status: 'READY' } });
        }
        this.broadcastItemStatusUpdate(data.orderId, data.itemId, data.itemStatus);
        return item;
    }
    async handleCompleteOrder(client, data) {
        const order = await this.prisma.order.update({
            where: { id: data.orderId },
            data: { status: 'DELIVERED', servedAt: new Date() },
            include: { items: true, table: true },
        });
        if (order.tableId) {
            await this.prisma.table.update({
                where: { id: order.tableId },
                data: { status: 'AVAILABLE' },
            });
        }
        this.broadcastOrderStatusUpdate(order);
        return order;
    }
};
exports.KitchenGateway = KitchenGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_a = typeof socket_io_1.Server !== "undefined" && socket_io_1.Server) === "function" ? _a : Object)
], KitchenGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('update-item-status'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _b : Object, Object]),
    __metadata("design:returntype", Promise)
], KitchenGateway.prototype, "handleUpdateItemStatus", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('complete-order'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _c : Object, Object]),
    __metadata("design:returntype", Promise)
], KitchenGateway.prototype, "handleCompleteOrder", null);
exports.KitchenGateway = KitchenGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: { origin: '*' } }),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], KitchenGateway);
//# sourceMappingURL=kitchen.gateway.js.map