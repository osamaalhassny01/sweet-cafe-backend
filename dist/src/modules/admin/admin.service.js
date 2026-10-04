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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const categories_service_1 = require("../categories/categories.service");
const offers_service_1 = require("../offers/offers.service");
const orders_service_1 = require("../orders/orders.service");
const products_service_1 = require("../products/products.service");
const prisma_service_1 = require("../../prisma/prisma.service");
const pagination_util_1 = require("../../common/utils/pagination.util");
let AdminService = class AdminService {
    constructor(categoriesService, productsService, ordersService, offersService, prisma) {
        this.categoriesService = categoriesService;
        this.productsService = productsService;
        this.ordersService = ordersService;
        this.offersService = offersService;
        this.prisma = prisma;
    }
    createCategory(dto) {
        return this.categoriesService.create(dto);
    }
    findAllCategories() {
        return this.categoriesService.findAll();
    }
    updateCategory(id, dto) {
        return this.categoriesService.update(id, dto);
    }
    deleteCategory(id) {
        return this.categoriesService.softDelete(id);
    }
    createProduct(dto) {
        return this.productsService.create(dto);
    }
    updateProduct(id, dto) {
        return this.productsService.update(id, dto);
    }
    deleteProduct(id) {
        return this.productsService.softDelete(id);
    }
    async findOrders(query) {
        const { page = 1, limit = 10, status, type, startDate, endDate, search, sortBy = 'createdAt', sortOrder = 'desc', } = query;
        const where = {};
        if (status) {
            where.status = status;
        }
        if (type) {
            where.orderType = type;
        }
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) {
                where.createdAt.gte = new Date(startDate);
            }
            if (endDate) {
                where.createdAt.lte = new Date(endDate);
            }
        }
        if (search) {
            where.OR = [
                { orderNumber: { contains: search, mode: 'insensitive' } },
                { customerName: { contains: search, mode: 'insensitive' } },
                { customerPhone: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [data, total] = await Promise.all([
            this.prisma.order.findMany({
                where,
                skip: (0, pagination_util_1.paginationSkip)(page, limit),
                take: limit,
                orderBy: { [sortBy]: sortOrder },
                include: {
                    items: true,
                    deliveryZone: true,
                },
            }),
            this.prisma.order.count({ where }),
        ]);
        return {
            data,
            meta: (0, pagination_util_1.buildPaginationMeta)(page, limit, total),
        };
    }
    findOrder(id) {
        return this.ordersService.findOne(id);
    }
    updateOrderStatus(id, dto) {
        return this.ordersService.updateStatus(id, dto);
    }
    createOffer(dto) {
        return this.offersService.create(dto);
    }
    findAllOffers() {
        return this.offersService.findAll();
    }
    updateOffer(id, dto) {
        return this.offersService.update(id, dto);
    }
    deleteOffer(id) {
        return this.offersService.softDelete(id);
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [categories_service_1.CategoriesService,
        products_service_1.ProductsService,
        orders_service_1.OrdersService,
        offers_service_1.OffersService,
        prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map