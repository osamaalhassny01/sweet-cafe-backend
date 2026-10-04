import { DeliveryZonesService } from './delivery-zones.service';
import { CreateDeliveryZoneDto } from './dto/create-delivery-zone.dto';
import { UpdateDeliveryZoneDto } from './dto/update-delivery-zone.dto';
export declare class DeliveryZonesController {
    private readonly deliveryZonesService;
    constructor(deliveryZonesService: DeliveryZonesService);
    findAll(): Promise<{
        nameAr: string;
        nameEn: string;
        description: string;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deliveryFee: import("@prisma/client/runtime/library").Decimal;
        estimatedMinutes: number;
        minOrderAmount: import("@prisma/client/runtime/library").Decimal;
        polygon: import("@prisma/client/runtime/library").JsonValue;
    }[] | {
        id: string;
        nameAr: string;
        nameEn: string;
        description: string;
        deliveryFee: number;
        estimatedMinutes: number;
        minOrderAmount: number;
        polygon: {};
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        nameAr: string;
        nameEn: string;
        description: string;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deliveryFee: import("@prisma/client/runtime/library").Decimal;
        estimatedMinutes: number;
        minOrderAmount: import("@prisma/client/runtime/library").Decimal;
        polygon: import("@prisma/client/runtime/library").JsonValue;
    }>;
    create(dto: CreateDeliveryZoneDto): Promise<{
        nameAr: string;
        nameEn: string;
        description: string;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deliveryFee: import("@prisma/client/runtime/library").Decimal;
        estimatedMinutes: number;
        minOrderAmount: import("@prisma/client/runtime/library").Decimal;
        polygon: import("@prisma/client/runtime/library").JsonValue;
    }>;
    update(id: string, dto: UpdateDeliveryZoneDto): Promise<{
        nameAr: string;
        nameEn: string;
        description: string;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deliveryFee: import("@prisma/client/runtime/library").Decimal;
        estimatedMinutes: number;
        minOrderAmount: import("@prisma/client/runtime/library").Decimal;
        polygon: import("@prisma/client/runtime/library").JsonValue;
    }>;
    delete(id: string): Promise<{
        nameAr: string;
        nameEn: string;
        description: string;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deliveryFee: import("@prisma/client/runtime/library").Decimal;
        estimatedMinutes: number;
        minOrderAmount: import("@prisma/client/runtime/library").Decimal;
        polygon: import("@prisma/client/runtime/library").JsonValue;
    }>;
}
