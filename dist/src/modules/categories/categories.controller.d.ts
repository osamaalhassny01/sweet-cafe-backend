import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        nameAr: string;
        nameEn: string;
        description: string;
        imageUrl: string;
        sortOrder: number;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        nameAr: string;
        nameEn: string;
        description: string;
        imageUrl: string;
        sortOrder: number;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
