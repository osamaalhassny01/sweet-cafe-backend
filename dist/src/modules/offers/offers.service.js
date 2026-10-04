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
exports.OffersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let OffersService = class OffersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    findActive() {
        const now = new Date();
        return this.prisma.offer.findMany({
            where: {
                isActive: true,
                startsAt: { lte: now },
                endsAt: { gte: now },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    findAll() {
        return this.prisma.offer.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    create(data) {
        return this.prisma.offer.create({
            data: {
                ...data,
                description: data.description ?? "",
                imageUrl: data.imageUrl ?? "",
            },
        });
    }
    update(id, data) {
        return this.prisma.offer.update({
            where: { id },
            data: {
                ...data,
                description: data.description ?? "",
                imageUrl: data.imageUrl ?? "",
            },
        });
    }
    async softDelete(id) {
        const offer = await this.prisma.offer.findUnique({ where: { id } });
        if (!offer) {
            throw new common_1.NotFoundException('Offer not found');
        }
        return this.prisma.offer.update({
            where: { id },
            data: { isActive: false },
        });
    }
};
exports.OffersService = OffersService;
exports.OffersService = OffersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OffersService);
//# sourceMappingURL=offers.service.js.map