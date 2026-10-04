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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const pagination_util_1 = require("../../common/utils/pagination.util");
const prisma_service_1 = require("../../prisma/prisma.service");
const response_builder_1 = require("../../shared/response/response-builder");
let ProductsService = class ProductsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findPublic(query) {
        return this.findMany(query, false);
    }
    async findAdmin(query) {
        return this.findMany(query, true);
    }
    async findMany(query, includeInactive) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 12;
        const where = this.buildWhere(query, includeInactive);
        const orderBy = this.buildOrderBy(query);
        const [data, total] = await this.prisma.$transaction([
            this.prisma.product.findMany({
                where,
                include: this.productDetailsInclude(),
                orderBy,
                skip: (0, pagination_util_1.paginationSkip)(page, limit),
                take: limit,
            }),
            this.prisma.product.count({ where }),
        ]);
        return (0, response_builder_1.paginatedResponse)(data, (0, pagination_util_1.buildPaginationMeta)(page, limit, total));
    }
    async findPublicById(id) {
        const product = await this.prisma.product.findFirst({
            where: { id, isActive: true },
            include: this.productDetailsInclude(),
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async findAdminById(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: this.productDetailsInclude(),
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    create(data) {
        const { sizes, addons, galleryImages, ...productData } = data;
        return this.prisma.product.create({
            data: {
                ...productData,
                description: data.description ?? "",
                imageUrl: data.imageUrl ?? "",
                oldPrice: data.oldPrice ?? 0,
                galleryImages: galleryImages ?? [],
                sizes: sizes?.length ? { create: sizes } : undefined,
                addons: addons?.length ? { create: addons } : undefined,
            },
            include: this.productDetailsInclude(),
        });
    }
    update(id, data) {
        const { sizes, addons, galleryImages, ...productData } = data;
        return this.prisma.product.update({
            where: { id },
            data: {
                ...productData,
                ...(galleryImages !== undefined ? { galleryImages } : {}),
                ...(sizes
                    ? {
                        sizes: {
                            deleteMany: {},
                            create: sizes,
                        },
                    }
                    : {}),
                ...(addons
                    ? {
                        addons: {
                            deleteMany: {},
                            create: addons,
                        },
                    }
                    : {}),
            },
            include: this.productDetailsInclude(),
        });
    }
    softDelete(id) {
        return this.prisma.product.update({
            where: { id },
            data: { isActive: false, isAvailable: false },
        });
    }
    buildWhere(query, includeInactive = false) {
        return {
            ...(includeInactive ? {} : { isActive: true }),
            ...(includeInactive && query.isActive !== undefined ? { isActive: query.isActive } : {}),
            ...(query.categoryId ? { categoryId: query.categoryId } : {}),
            ...(query.isAvailable !== undefined ? { isAvailable: query.isAvailable } : {}),
            ...(query.isFeatured !== undefined ? { isFeatured: query.isFeatured } : {}),
            ...(query.isBestSeller !== undefined ? { isBestSeller: query.isBestSeller } : {}),
            ...(query.minPrice !== undefined || query.maxPrice !== undefined
                ? {
                    price: {
                        ...(query.minPrice !== undefined ? { gte: query.minPrice } : {}),
                        ...(query.maxPrice !== undefined ? { lte: query.maxPrice } : {}),
                    },
                }
                : {}),
            ...(query.search
                ? {
                    OR: [
                        { nameAr: { contains: query.search, mode: 'insensitive' } },
                        { nameEn: { contains: query.search, mode: 'insensitive' } },
                        { description: { contains: query.search, mode: 'insensitive' } },
                    ],
                }
                : {}),
        };
    }
    buildOrderBy(query) {
        const sortBy = query.sortBy ?? 'sortOrder';
        const sortOrder = query.sortOrder ?? 'asc';
        return [{ [sortBy]: sortOrder }, { createdAt: 'desc' }];
    }
    productDetailsInclude() {
        return {
            category: true,
            sizes: { orderBy: { price: 'asc' } },
            addons: { where: { isActive: true }, orderBy: { price: 'asc' } },
        };
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map