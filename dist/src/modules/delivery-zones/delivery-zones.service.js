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
exports.DeliveryZonesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let DeliveryZonesService = class DeliveryZonesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        const zones = await this.prisma.deliveryZone.findMany({
            where: { isActive: true },
            orderBy: { nameAr: 'asc' },
        });
        if (zones.length === 0) {
            return [
                {
                    id: 'default',
                    nameAr: 'جميع المناطق',
                    nameEn: 'All Areas',
                    description: 'توصيل لجميع المناطق',
                    deliveryFee: 0,
                    estimatedMinutes: 30,
                    minOrderAmount: 10,
                    polygon: {},
                    isActive: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];
        }
        return zones;
    }
    async findOne(id) {
        const zone = await this.prisma.deliveryZone.findUnique({
            where: { id },
        });
        if (!zone) {
            throw new common_1.NotFoundException('Delivery zone not found');
        }
        return zone;
    }
    async create(dto) {
        return this.prisma.deliveryZone.create({
            data: {
                nameAr: dto.nameAr,
                nameEn: dto.nameEn,
                description: dto.description || '',
                deliveryFee: dto.deliveryFee,
                estimatedMinutes: dto.estimatedMinutes || 30,
                minOrderAmount: dto.minOrderAmount ?? 10,
                polygon: dto.polygon || {},
                isActive: true,
            },
        });
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.deliveryZone.update({
            where: { id },
            data: {
                nameAr: dto.nameAr,
                nameEn: dto.nameEn,
                description: dto.description,
                deliveryFee: dto.deliveryFee,
                estimatedMinutes: dto.estimatedMinutes,
                minOrderAmount: dto.minOrderAmount,
                polygon: dto.polygon,
            },
        });
    }
    async delete(id) {
        await this.findOne(id);
        return this.prisma.deliveryZone.update({
            where: { id },
            data: { isActive: false },
        });
    }
};
exports.DeliveryZonesService = DeliveryZonesService;
exports.DeliveryZonesService = DeliveryZonesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DeliveryZonesService);
//# sourceMappingURL=delivery-zones.service.js.map