import { OffersService } from './offers.service';
export declare class OffersController {
    private readonly offersService;
    constructor(offersService: OffersService);
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
}
