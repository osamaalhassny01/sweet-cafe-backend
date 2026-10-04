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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const orders_gateway_1 = require("./orders.gateway");
let OrdersService = class OrdersService {
    constructor(prisma, ordersGateway) {
        this.prisma = prisma;
        this.ordersGateway = ordersGateway;
        this.VALID_STATUS_TRANSITIONS = {
            PENDING: new Set(['CONFIRMED', 'CANCELLED']),
            NEW: new Set(['CONFIRMED', 'CANCELLED']),
            CONFIRMED: new Set(['PREPARING', 'CANCELLED']),
            PREPARING: new Set(['READY', 'CANCELLED']),
            READY: new Set(['OUT_FOR_DELIVERY', 'CANCELLED']),
            OUT_FOR_DELIVERY: new Set(['DELIVERED', 'CANCELLED']),
            DELIVERED: new Set(),
            CANCELLED: new Set(),
        };
    }
    async create(dto, authUser) {
        if (!dto.items || !dto.items.length) {
            throw new common_1.BadRequestException('Order must contain at least one item');
        }
        const calculatedItems = await this.calculateItems(dto.items);
        const subtotal = calculatedItems.reduce((sum, item) => sum.plus(item.totalPrice), new client_1.Prisma.Decimal(0));
        let zoneId = dto.deliveryZoneId;
        let zone;
        if (zoneId && zoneId !== 'default') {
            zone = await this.prisma.deliveryZone.findUnique({
                where: { id: zoneId },
            });
        }
        if (!zone) {
            zone = await this.prisma.deliveryZone.findFirst({
                where: { isActive: true },
            });
            if (!zone) {
                zone = await this.prisma.deliveryZone.findFirst();
            }
            if (zone) {
                zoneId = zone.id;
            }
        }
        if (!zone) {
            throw new common_1.BadRequestException('تعذر إتمام الطلب: لا توجد مناطق توصيل معرفة في النظام');
        }
        if (!zone.isActive && dto.orderType === client_1.OrderType.DELIVERY) {
            throw new common_1.BadRequestException('منطقة التوصيل المختارة غير متاحة حالياً');
        }
        if (dto.orderType === client_1.OrderType.DELIVERY && subtotal.lt(zone.minOrderAmount)) {
            const minAmountYER = Number(zone.minOrderAmount) * 100;
            throw new common_1.BadRequestException(`الحد الأدنى للطلب لهذه المنطقة هو ${minAmountYER} ر.ي`);
        }
        const deliveryFee = dto.orderType === client_1.OrderType.DELIVERY ? zone.deliveryFee : new client_1.Prisma.Decimal(0);
        let discount = new client_1.Prisma.Decimal(0);
        if (dto.offerId) {
            const offer = await this.prisma.offer.findUnique({
                where: { id: dto.offerId },
            });
            if (offer &&
                offer.isActive &&
                offer.startsAt <= new Date() &&
                offer.endsAt >= new Date()) {
                discount = subtotal.mul(offer.discountPercent).div(100);
            }
        }
        const totalAmount = subtotal.plus(deliveryFee).minus(discount);
        const orderNumber = await this.nextOrderNumber();
        let customerId;
        let customerName = dto.customerName;
        let customerPhone = dto.customerPhone;
        if (authUser?.type === 'customer' && authUser.sub) {
            const customer = await this.prisma.customer.findUnique({
                where: { id: authUser.sub },
            });
            if (customer?.isActive) {
                customerId = customer.id;
                customerName = customer.name;
                customerPhone = customer.phone;
            }
        }
        const order = await this.prisma.order.create({
            data: {
                orderNumber,
                customerId,
                customerName,
                customerPhone,
                address: dto.address,
                buildingNumber: dto.buildingNumber || '',
                floor: dto.floor || '',
                landmark: dto.landmark || '',
                latitude: dto.latitude || 0,
                longitude: dto.longitude || 0,
                deliveryZoneId: zoneId,
                orderType: dto.orderType || client_1.OrderType.DELIVERY,
                notes: dto.notes || '',
                paymentMethod: dto.paymentMethod || 'CASH',
                subtotal,
                deliveryFee,
                discount,
                totalAmount,
                status: client_1.OrderStatus.NEW,
                items: {
                    create: calculatedItems.map((item) => ({
                        productId: item.productId,
                        productName: item.productName,
                        sizeName: item.sizeName,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        totalPrice: item.totalPrice,
                        addons: item.addons,
                    })),
                },
            },
            include: { items: true, deliveryZone: true },
        });
        this.ordersGateway.broadcastNewOrder(order);
        return order;
    }
    async findAll(status, type) {
        const where = {};
        if (status)
            where.status = status;
        if (type)
            where.orderType = type;
        return this.prisma.order.findMany({
            where,
            include: {
                items: true,
                deliveryZone: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findByPhone(phone) {
        return this.prisma.order.findMany({
            where: { customerPhone: phone },
            include: {
                items: true,
                deliveryZone: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                items: true,
                deliveryZone: true,
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        return order;
    }
    async findByOrderNumber(orderNumber) {
        const order = await this.prisma.order.findUnique({
            where: { orderNumber },
            include: {
                items: true,
                deliveryZone: true,
            },
        });
        if (!order) {
            throw new common_1.NotFoundException(`الطلب رقم ${orderNumber} غير موجود`);
        }
        return order;
    }
    async updateStatus(id, dto) {
        const order = await this.prisma.order.findUnique({ where: { id } });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        const allowedTransitions = this.VALID_STATUS_TRANSITIONS[order.status];
        if (!allowedTransitions?.has(dto.status)) {
            throw new common_1.BadRequestException(`لا يمكن تغيير حالة الطلب من "${order.status}" إلى "${dto.status}"`);
        }
        const updateData = { status: dto.status };
        if (dto.status === client_1.OrderStatus.OUT_FOR_DELIVERY) {
            updateData.pickedUpAt = new Date();
        }
        else if (dto.status === client_1.OrderStatus.DELIVERED) {
            updateData.deliveredAt = new Date();
        }
        const updated = await this.prisma.order.update({
            where: { id },
            data: updateData,
            include: { items: true, deliveryZone: true },
        });
        this.ordersGateway.broadcastOrderStatusUpdate(updated);
        return updated;
    }
    async calculateItems(items) {
        const productIds = [...new Set(items.map((item) => item.productId))];
        const products = await this.prisma.product.findMany({
            where: { id: { in: productIds }, isActive: true },
            include: {
                sizes: true,
                addons: { where: { isActive: true } },
            },
        });
        return items.map((item) => {
            const product = products.find((candidate) => candidate.id === item.productId);
            if (!product) {
                throw new common_1.BadRequestException(`Product ${item.productId} was not found`);
            }
            if (!product.isAvailable) {
                throw new common_1.BadRequestException(`Product ${product.nameAr} is not available`);
            }
            const selectedSize = item.sizeId
                ? product.sizes.find((size) => size.id === item.sizeId)
                : product.sizes.find((size) => size.isDefault);
            if (item.sizeId && !selectedSize) {
                throw new common_1.BadRequestException(`Invalid size for product ${product.nameAr}`);
            }
            const unitBasePrice = selectedSize?.price ?? product.price;
            const requestedAddonIds = item.addonIds ?? [];
            const selectedAddons = requestedAddonIds.map((addonId) => {
                const addon = product.addons.find((candidate) => candidate.id === addonId);
                if (!addon) {
                    throw new common_1.BadRequestException(`Invalid addon for product ${product.nameAr}`);
                }
                return addon;
            });
            const addonTotal = selectedAddons.reduce((sum, addon) => sum.plus(addon.price), new client_1.Prisma.Decimal(0));
            const unitPrice = unitBasePrice.plus(addonTotal);
            const totalPrice = unitPrice.mul(item.quantity);
            return {
                productId: product.id,
                productName: product.nameAr,
                sizeName: selectedSize?.name,
                quantity: item.quantity,
                unitPrice,
                totalPrice,
                addons: selectedAddons.map((addon) => ({
                    id: addon.id,
                    nameAr: addon.nameAr,
                    nameEn: addon.nameEn,
                    price: addon.price.toString(),
                })),
            };
        });
    }
    async nextOrderNumber() {
        const result = await this.prisma.$queryRaw `
      INSERT INTO "Counter" ("key", "value")
      VALUES ('order_number', 1)
      ON CONFLICT ("key") DO UPDATE SET "value" = "Counter"."value" + 1
      RETURNING "value"
    `;
        const num = result[0].value.toString().padStart(6, '0');
        return `SC-${num}`;
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        orders_gateway_1.OrdersGateway])
], OrdersService);
//# sourceMappingURL=orders.service.js.map