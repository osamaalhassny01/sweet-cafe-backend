import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findPublic(): import(".prisma/client").Prisma.PrismaPromise<{
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
    findPublicById(id: string): Promise<{
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
    create(data: CreateCategoryDto): import(".prisma/client").Prisma.Prisma__CategoryClient<{
        nameAr: string;
        nameEn: string;
        description: string;
        imageUrl: string;
        sortOrder: number;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, data: UpdateCategoryDto): import(".prisma/client").Prisma.Prisma__CategoryClient<{
        nameAr: string;
        nameEn: string;
        description: string;
        imageUrl: string;
        sortOrder: number;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    softDelete(id: string): import(".prisma/client").Prisma.Prisma__CategoryClient<{
        nameAr: string;
        nameEn: string;
        description: string;
        imageUrl: string;
        sortOrder: number;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
}
