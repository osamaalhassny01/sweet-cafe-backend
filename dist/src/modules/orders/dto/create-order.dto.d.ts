import { OrderType, PaymentMethod } from '@prisma/client';
export declare class CreateOrderItemDto {
    productId: string;
    sizeId: string;
    addonIds: string[];
    quantity: number;
}
export declare class CreateOrderDto {
    customerName: string;
    customerPhone: string;
    address: string;
    buildingNumber: string;
    floor: string;
    landmark: string;
    latitude: number;
    longitude: number;
    deliveryZoneId: string;
    paymentMethod: PaymentMethod;
    orderType: OrderType;
    notes: string;
    offerId?: string;
    items: CreateOrderItemDto[];
}
