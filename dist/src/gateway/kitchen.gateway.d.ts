import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
export declare class KitchenGateway {
    private readonly prisma;
    server: Server;
    constructor(prisma: PrismaService);
    handleConnection(client: Socket): void;
    broadcastNewOrder(order: any): void;
    broadcastOrderStatusUpdate(order: any): void;
    broadcastItemStatusUpdate(orderId: string, itemId: string, itemStatus: string): void;
    broadcastTableUpdate(table: any): void;
    handleUpdateItemStatus(client: Socket, data: {
        orderId: string;
        itemId: string;
        itemStatus: string;
    }): Promise<{
        id: string;
        orderId: string;
        productId: string | null;
        productName: string;
        sizeName: string | null;
        quantity: number;
        unitPrice: import("@prisma/client/runtime/library").Decimal;
        totalPrice: import("@prisma/client/runtime/library").Decimal;
        addons: import("@prisma/client/runtime/library").JsonValue;
        itemStatus: import(".prisma/client").$Enums.ItemStatus;
        note: string | null;
        startedAt: Date | null;
        completedAt: Date | null;
    }>;
    handleCompleteOrder(client: Socket, data: {
        orderId: string;
    }): Promise<{
        table: {
            number: number;
            id: string;
            status: import(".prisma/client").$Enums.TableStatus;
            createdAt: Date;
            updatedAt: Date;
            seats: number;
            area: string;
            qrCode: string;
            isActive: boolean;
        } | null;
        items: {
            id: string;
            orderId: string;
            productId: string | null;
            productName: string;
            sizeName: string | null;
            quantity: number;
            unitPrice: import("@prisma/client/runtime/library").Decimal;
            totalPrice: import("@prisma/client/runtime/library").Decimal;
            addons: import("@prisma/client/runtime/library").JsonValue;
            itemStatus: import(".prisma/client").$Enums.ItemStatus;
            note: string | null;
            startedAt: Date | null;
            completedAt: Date | null;
        }[];
    } & {
        id: string;
        totalPrice: import("@prisma/client/runtime/library").Decimal;
        completedAt: Date | null;
        orderNumber: string;
        customerName: string | null;
        customerPhone: string | null;
        customerAddress: string | null;
        orderType: import(".prisma/client").$Enums.OrderType;
        paymentMethod: import(".prisma/client").$Enums.PaymentMethod;
        notes: string | null;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        deliveryFee: import("@prisma/client/runtime/library").Decimal;
        discount: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.OrderStatus;
        tableId: string | null;
        servedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
