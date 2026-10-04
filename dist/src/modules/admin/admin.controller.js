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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const admin_roles_decorator_1 = require("../../common/decorators/admin-roles.decorator");
const admin_token_guard_1 = require("../../common/guards/admin-token.guard");
const create_category_dto_1 = require("../categories/dto/create-category.dto");
const update_category_dto_1 = require("../categories/dto/update-category.dto");
const create_offer_dto_1 = require("../offers/dto/create-offer.dto");
const update_offer_dto_1 = require("../offers/dto/update-offer.dto");
const update_order_status_dto_1 = require("../orders/dto/update-order-status.dto");
const create_product_dto_1 = require("../products/dto/create-product.dto");
const update_product_dto_1 = require("../products/dto/update-product.dto");
const admin_service_1 = require("./admin.service");
const delivery_zones_service_1 = require("../delivery-zones/delivery-zones.service");
const create_delivery_zone_dto_1 = require("../delivery-zones/dto/create-delivery-zone.dto");
const update_delivery_zone_dto_1 = require("../delivery-zones/dto/update-delivery-zone.dto");
const prisma_service_1 = require("../../prisma/prisma.service");
const admin_order_query_dto_1 = require("../orders/dto/admin-order-query.dto");
const products_service_1 = require("../products/products.service");
const product_query_dto_1 = require("../products/dto/product-query.dto");
let AdminController = class AdminController {
    constructor(adminService, deliveryZonesService, productsService, prisma) {
        this.adminService = adminService;
        this.deliveryZonesService = deliveryZonesService;
        this.productsService = productsService;
        this.prisma = prisma;
    }
    findCategories() {
        return this.adminService.findAllCategories();
    }
    createCategory(dto) {
        return this.adminService.createCategory(dto);
    }
    updateCategory(id, dto) {
        return this.adminService.updateCategory(id, dto);
    }
    deleteCategory(id) {
        return this.adminService.deleteCategory(id);
    }
    findProducts(query) {
        return this.productsService.findAdmin(query);
    }
    findProduct(id) {
        return this.productsService.findAdminById(id);
    }
    createProduct(dto) {
        return this.adminService.createProduct(dto);
    }
    updateProduct(id, dto) {
        return this.adminService.updateProduct(id, dto);
    }
    deleteProduct(id) {
        return this.adminService.deleteProduct(id);
    }
    findOrders(query) {
        return this.adminService.findOrders(query);
    }
    findOrder(id) {
        return this.adminService.findOrder(id);
    }
    updateOrderStatus(id, dto) {
        return this.adminService.updateOrderStatus(id, dto);
    }
    async getDashboardStats() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const [totalOrders, todayOrders, totalRevenue, todayRevenue, totalProducts, totalCategories, pendingOrders, ordersByStatus, recentOrders, topProducts,] = await Promise.all([
            this.prisma.order.count(),
            this.prisma.order.count({ where: { createdAt: { gte: today } } }),
            this.prisma.order.aggregate({
                _sum: { totalAmount: true },
                where: { status: { notIn: ['CANCELLED'] } },
            }),
            this.prisma.order.aggregate({
                _sum: { totalAmount: true },
                where: { status: { notIn: ['CANCELLED'] }, createdAt: { gte: today } },
            }),
            this.prisma.product.count({ where: { isActive: true } }),
            this.prisma.category.count({ where: { isActive: true } }),
            this.prisma.order.count({ where: { status: { in: ['NEW', 'PENDING'] } } }),
            this.prisma.order.groupBy({
                by: ['status'],
                _count: { _all: true },
            }),
            this.prisma.order.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                include: { items: true, deliveryZone: true },
            }),
            this.prisma.orderItem.groupBy({
                by: ['productName'],
                _sum: { quantity: true },
                _count: { _all: true },
                orderBy: { _sum: { quantity: 'desc' } },
                take: 5,
            }),
        ]);
        return {
            totalOrders,
            todayOrders,
            totalRevenue: totalRevenue._sum.totalAmount || 0,
            todayRevenue: todayRevenue._sum.totalAmount || 0,
            totalProducts,
            totalCategories,
            pendingOrders,
            ordersByStatus: ordersByStatus.map(item => ({
                status: item.status,
                count: item._count._all,
            })),
            recentOrders,
            topProducts: topProducts.map(item => ({
                name: item.productName,
                quantity: item._sum.quantity,
                orderCount: item._count._all,
            })),
        };
    }
    async getRevenueTimeline(days = '30') {
        const daysNum = parseInt(days, 10) || 30;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - daysNum);
        startDate.setHours(0, 0, 0, 0);
        const data = await this.prisma.$queryRaw `
      SELECT DATE("createdAt") as date, COALESCE(SUM("totalAmount"), 0) as revenue
      FROM "Order"
      WHERE "createdAt" >= ${startDate} AND "status" != 'CANCELLED'
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `;
        return data.map(item => ({
            date: item.date,
            revenue: Number(item.revenue),
        }));
    }
    async getOrdersTimeline(days = '30') {
        const daysNum = parseInt(days, 10) || 30;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - daysNum);
        startDate.setHours(0, 0, 0, 0);
        const data = await this.prisma.$queryRaw `
      SELECT DATE("createdAt") as date, COUNT(*) as count
      FROM "Order"
      WHERE "createdAt" >= ${startDate}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `;
        return data.map(item => ({
            date: item.date,
            count: Number(item.count),
        }));
    }
    findOffers() {
        return this.adminService.findAllOffers();
    }
    createOffer(dto) {
        return this.adminService.createOffer(dto);
    }
    updateOffer(id, dto) {
        return this.adminService.updateOffer(id, dto);
    }
    deleteOffer(id) {
        return this.adminService.deleteOffer(id);
    }
    findDeliveryZones() {
        return this.deliveryZonesService.findAll();
    }
    createDeliveryZone(dto) {
        return this.deliveryZonesService.create(dto);
    }
    updateDeliveryZone(id, dto) {
        return this.deliveryZonesService.update(id, dto);
    }
    deleteDeliveryZone(id) {
        return this.deliveryZonesService.delete(id);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "findCategories", null);
__decorate([
    (0, common_1.Post)('categories'),
    (0, admin_roles_decorator_1.AdminRoles)(client_1.AdminRole.PRODUCTS_STAFF),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_category_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Patch)('categories/:id'),
    (0, admin_roles_decorator_1.AdminRoles)(client_1.AdminRole.PRODUCTS_STAFF),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_category_dto_1.UpdateCategoryDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.Delete)('categories/:id'),
    (0, admin_roles_decorator_1.AdminRoles)(client_1.AdminRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteCategory", null);
__decorate([
    (0, common_1.Get)('products'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [product_query_dto_1.ProductQueryDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "findProducts", null);
__decorate([
    (0, common_1.Get)('products/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "findProduct", null);
__decorate([
    (0, common_1.Post)('products'),
    (0, admin_roles_decorator_1.AdminRoles)(client_1.AdminRole.PRODUCTS_STAFF),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createProduct", null);
__decorate([
    (0, common_1.Patch)('products/:id'),
    (0, admin_roles_decorator_1.AdminRoles)(client_1.AdminRole.PRODUCTS_STAFF),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_dto_1.UpdateProductDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateProduct", null);
__decorate([
    (0, common_1.Delete)('products/:id'),
    (0, admin_roles_decorator_1.AdminRoles)(client_1.AdminRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteProduct", null);
__decorate([
    (0, common_1.Get)('orders'),
    (0, admin_roles_decorator_1.AdminRoles)(client_1.AdminRole.ORDERS_STAFF),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_order_query_dto_1.AdminOrderQueryDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "findOrders", null);
__decorate([
    (0, common_1.Get)('orders/:id'),
    (0, admin_roles_decorator_1.AdminRoles)(client_1.AdminRole.ORDERS_STAFF),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "findOrder", null);
__decorate([
    (0, common_1.Patch)('orders/:id/status'),
    (0, admin_roles_decorator_1.AdminRoles)(client_1.AdminRole.ORDERS_STAFF),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_order_status_dto_1.UpdateOrderStatusDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateOrderStatus", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDashboardStats", null);
__decorate([
    (0, common_1.Get)('stats/revenue-timeline'),
    __param(0, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getRevenueTimeline", null);
__decorate([
    (0, common_1.Get)('stats/orders-timeline'),
    __param(0, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getOrdersTimeline", null);
__decorate([
    (0, common_1.Get)('offers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "findOffers", null);
__decorate([
    (0, common_1.Post)('offers'),
    (0, admin_roles_decorator_1.AdminRoles)(client_1.AdminRole.PRODUCTS_STAFF),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_offer_dto_1.CreateOfferDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createOffer", null);
__decorate([
    (0, common_1.Patch)('offers/:id'),
    (0, admin_roles_decorator_1.AdminRoles)(client_1.AdminRole.PRODUCTS_STAFF),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_offer_dto_1.UpdateOfferDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateOffer", null);
__decorate([
    (0, common_1.Delete)('offers/:id'),
    (0, admin_roles_decorator_1.AdminRoles)(client_1.AdminRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteOffer", null);
__decorate([
    (0, common_1.Get)('delivery-zones'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "findDeliveryZones", null);
__decorate([
    (0, common_1.Post)('delivery-zones'),
    (0, admin_roles_decorator_1.AdminRoles)(client_1.AdminRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_delivery_zone_dto_1.CreateDeliveryZoneDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createDeliveryZone", null);
__decorate([
    (0, common_1.Patch)('delivery-zones/:id'),
    (0, admin_roles_decorator_1.AdminRoles)(client_1.AdminRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_delivery_zone_dto_1.UpdateDeliveryZoneDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateDeliveryZone", null);
__decorate([
    (0, common_1.Delete)('delivery-zones/:id'),
    (0, admin_roles_decorator_1.AdminRoles)(client_1.AdminRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteDeliveryZone", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, common_1.UseGuards)(admin_token_guard_1.AdminTokenGuard),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService,
        delivery_zones_service_1.DeliveryZonesService,
        products_service_1.ProductsService,
        prisma_service_1.PrismaService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map