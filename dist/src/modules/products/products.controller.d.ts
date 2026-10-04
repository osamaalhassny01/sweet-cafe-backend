import { ProductQueryDto } from './dto/product-query.dto';
import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(query: ProductQueryDto): Promise<import("../../shared/response/api-response.interface").ApiPaginatedData<{
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
            price: import("@prisma/client/runtime/library").Decimal;
            isDefault: boolean;
            productId: string;
        }[];
        addons: {
            nameAr: string;
            nameEn: string;
            isActive: boolean;
            id: string;
            price: import("@prisma/client/runtime/library").Decimal;
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
        price: import("@prisma/client/runtime/library").Decimal;
        oldPrice: import("@prisma/client/runtime/library").Decimal;
        galleryImages: import("@prisma/client/runtime/library").JsonValue;
    }>>;
    findFeatured(query: ProductQueryDto): Promise<import("../../shared/response/api-response.interface").ApiPaginatedData<{
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
            price: import("@prisma/client/runtime/library").Decimal;
            isDefault: boolean;
            productId: string;
        }[];
        addons: {
            nameAr: string;
            nameEn: string;
            isActive: boolean;
            id: string;
            price: import("@prisma/client/runtime/library").Decimal;
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
        price: import("@prisma/client/runtime/library").Decimal;
        oldPrice: import("@prisma/client/runtime/library").Decimal;
        galleryImages: import("@prisma/client/runtime/library").JsonValue;
    }>>;
    findBestSellers(query: ProductQueryDto): Promise<import("../../shared/response/api-response.interface").ApiPaginatedData<{
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
            price: import("@prisma/client/runtime/library").Decimal;
            isDefault: boolean;
            productId: string;
        }[];
        addons: {
            nameAr: string;
            nameEn: string;
            isActive: boolean;
            id: string;
            price: import("@prisma/client/runtime/library").Decimal;
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
        price: import("@prisma/client/runtime/library").Decimal;
        oldPrice: import("@prisma/client/runtime/library").Decimal;
        galleryImages: import("@prisma/client/runtime/library").JsonValue;
    }>>;
    findByCategory(categoryId: string, query: ProductQueryDto): Promise<import("../../shared/response/api-response.interface").ApiPaginatedData<{
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
            price: import("@prisma/client/runtime/library").Decimal;
            isDefault: boolean;
            productId: string;
        }[];
        addons: {
            nameAr: string;
            nameEn: string;
            isActive: boolean;
            id: string;
            price: import("@prisma/client/runtime/library").Decimal;
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
        price: import("@prisma/client/runtime/library").Decimal;
        oldPrice: import("@prisma/client/runtime/library").Decimal;
        galleryImages: import("@prisma/client/runtime/library").JsonValue;
    }>>;
    findOne(id: string): Promise<{
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
            price: import("@prisma/client/runtime/library").Decimal;
            isDefault: boolean;
            productId: string;
        }[];
        addons: {
            nameAr: string;
            nameEn: string;
            isActive: boolean;
            id: string;
            price: import("@prisma/client/runtime/library").Decimal;
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
        price: import("@prisma/client/runtime/library").Decimal;
        oldPrice: import("@prisma/client/runtime/library").Decimal;
        galleryImages: import("@prisma/client/runtime/library").JsonValue;
    }>;
}
