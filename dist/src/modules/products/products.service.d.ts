import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findPublic(query: ProductQueryDto): Promise<import("../../shared/response/api-response.interface").ApiPaginatedData<{
        category: {
            nameAr: string;
            nameEn: string;
            description: string;
            imageUrl: string;
            sortOrder: number;
            isActive: boolean;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
        sizes: {
            id: string;
            name: string;
            price: Prisma.Decimal;
            isDefault: boolean;
            productId: string;
        }[];
        addons: {
            nameAr: string;
            nameEn: string;
            isActive: boolean;
            id: string;
            price: Prisma.Decimal;
            productId: string;
        }[];
    } & {
        nameAr: string;
        nameEn: string;
        description: string;
        imageUrl: string;
        sortOrder: number;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        categoryId: string;
        isAvailable: boolean;
        isFeatured: boolean;
        isBestSeller: boolean;
        price: Prisma.Decimal;
        oldPrice: Prisma.Decimal;
        galleryImages: Prisma.JsonValue;
    }>>;
    findAdmin(query: ProductQueryDto): Promise<import("../../shared/response/api-response.interface").ApiPaginatedData<{
        category: {
            nameAr: string;
            nameEn: string;
            description: string;
            imageUrl: string;
            sortOrder: number;
            isActive: boolean;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
        sizes: {
            id: string;
            name: string;
            price: Prisma.Decimal;
            isDefault: boolean;
            productId: string;
        }[];
        addons: {
            nameAr: string;
            nameEn: string;
            isActive: boolean;
            id: string;
            price: Prisma.Decimal;
            productId: string;
        }[];
    } & {
        nameAr: string;
        nameEn: string;
        description: string;
        imageUrl: string;
        sortOrder: number;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        categoryId: string;
        isAvailable: boolean;
        isFeatured: boolean;
        isBestSeller: boolean;
        price: Prisma.Decimal;
        oldPrice: Prisma.Decimal;
        galleryImages: Prisma.JsonValue;
    }>>;
    private findMany;
    findPublicById(id: string): Promise<{
        category: {
            nameAr: string;
            nameEn: string;
            description: string;
            imageUrl: string;
            sortOrder: number;
            isActive: boolean;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
        sizes: {
            id: string;
            name: string;
            price: Prisma.Decimal;
            isDefault: boolean;
            productId: string;
        }[];
        addons: {
            nameAr: string;
            nameEn: string;
            isActive: boolean;
            id: string;
            price: Prisma.Decimal;
            productId: string;
        }[];
    } & {
        nameAr: string;
        nameEn: string;
        description: string;
        imageUrl: string;
        sortOrder: number;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        categoryId: string;
        isAvailable: boolean;
        isFeatured: boolean;
        isBestSeller: boolean;
        price: Prisma.Decimal;
        oldPrice: Prisma.Decimal;
        galleryImages: Prisma.JsonValue;
    }>;
    findAdminById(id: string): Promise<{
        category: {
            nameAr: string;
            nameEn: string;
            description: string;
            imageUrl: string;
            sortOrder: number;
            isActive: boolean;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
        sizes: {
            id: string;
            name: string;
            price: Prisma.Decimal;
            isDefault: boolean;
            productId: string;
        }[];
        addons: {
            nameAr: string;
            nameEn: string;
            isActive: boolean;
            id: string;
            price: Prisma.Decimal;
            productId: string;
        }[];
    } & {
        nameAr: string;
        nameEn: string;
        description: string;
        imageUrl: string;
        sortOrder: number;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        categoryId: string;
        isAvailable: boolean;
        isFeatured: boolean;
        isBestSeller: boolean;
        price: Prisma.Decimal;
        oldPrice: Prisma.Decimal;
        galleryImages: Prisma.JsonValue;
    }>;
    create(data: CreateProductDto): Prisma.Prisma__ProductClient<{
        category: {
            nameAr: string;
            nameEn: string;
            description: string;
            imageUrl: string;
            sortOrder: number;
            isActive: boolean;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
        sizes: {
            id: string;
            name: string;
            price: Prisma.Decimal;
            isDefault: boolean;
            productId: string;
        }[];
        addons: {
            nameAr: string;
            nameEn: string;
            isActive: boolean;
            id: string;
            price: Prisma.Decimal;
            productId: string;
        }[];
    } & {
        nameAr: string;
        nameEn: string;
        description: string;
        imageUrl: string;
        sortOrder: number;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        categoryId: string;
        isAvailable: boolean;
        isFeatured: boolean;
        isBestSeller: boolean;
        price: Prisma.Decimal;
        oldPrice: Prisma.Decimal;
        galleryImages: Prisma.JsonValue;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, data: UpdateProductDto): Prisma.Prisma__ProductClient<{
        category: {
            nameAr: string;
            nameEn: string;
            description: string;
            imageUrl: string;
            sortOrder: number;
            isActive: boolean;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        };
        sizes: {
            id: string;
            name: string;
            price: Prisma.Decimal;
            isDefault: boolean;
            productId: string;
        }[];
        addons: {
            nameAr: string;
            nameEn: string;
            isActive: boolean;
            id: string;
            price: Prisma.Decimal;
            productId: string;
        }[];
    } & {
        nameAr: string;
        nameEn: string;
        description: string;
        imageUrl: string;
        sortOrder: number;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        categoryId: string;
        isAvailable: boolean;
        isFeatured: boolean;
        isBestSeller: boolean;
        price: Prisma.Decimal;
        oldPrice: Prisma.Decimal;
        galleryImages: Prisma.JsonValue;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    softDelete(id: string): Prisma.Prisma__ProductClient<{
        nameAr: string;
        nameEn: string;
        description: string;
        imageUrl: string;
        sortOrder: number;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        categoryId: string;
        isAvailable: boolean;
        isFeatured: boolean;
        isBestSeller: boolean;
        price: Prisma.Decimal;
        oldPrice: Prisma.Decimal;
        galleryImages: Prisma.JsonValue;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    private buildWhere;
    private buildOrderBy;
    private productDetailsInclude;
}
