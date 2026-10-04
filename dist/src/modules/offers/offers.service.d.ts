import { PrismaService } from '../../prisma/prisma.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
export declare class OffersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findActive(): import(".prisma/client").Prisma.PrismaPromise<{
        description: string;
        imageUrl: string;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        titleAr: string;
        titleEn: string;
        discountPercent: number;
        startsAt: Date;
        endsAt: Date;
    }[]>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        description: string;
        imageUrl: string;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        titleAr: string;
        titleEn: string;
        discountPercent: number;
        startsAt: Date;
        endsAt: Date;
    }[]>;
    create(data: CreateOfferDto): import(".prisma/client").Prisma.Prisma__OfferClient<{
        description: string;
        imageUrl: string;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        titleAr: string;
        titleEn: string;
        discountPercent: number;
        startsAt: Date;
        endsAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, data: UpdateOfferDto): import(".prisma/client").Prisma.Prisma__OfferClient<{
        description: string;
        imageUrl: string;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        titleAr: string;
        titleEn: string;
        discountPercent: number;
        startsAt: Date;
        endsAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    softDelete(id: string): Promise<{
        description: string;
        imageUrl: string;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        titleAr: string;
        titleEn: string;
        discountPercent: number;
        startsAt: Date;
        endsAt: Date;
    }>;
}
