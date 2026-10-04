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
exports.TablesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const crypto_1 = require("crypto");
let TablesService = class TablesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getTables() {
        return this.prisma.table.findMany({
            where: { isActive: true },
            orderBy: { number: 'asc' },
        });
    }
    async getTableByQrCode(qrCode) {
        const table = await this.prisma.table.findUnique({
            where: { qrCode },
        });
        if (!table) {
            throw new common_1.NotFoundException(`Table with QR code ${qrCode} not found`);
        }
        return table;
    }
    async updateTableStatus(id, status) {
        const table = await this.prisma.table.findUnique({ where: { id } });
        if (!table) {
            throw new common_1.NotFoundException(`Table with ID ${id} not found`);
        }
        return this.prisma.table.update({
            where: { id },
            data: { status },
        });
    }
    async createTable(dto) {
        const qrCode = `TABLE-${dto.number}-${(0, crypto_1.randomUUID)().slice(0, 8)}`;
        return this.prisma.table.create({
            data: {
                ...dto,
                qrCode,
                status: 'AVAILABLE',
            },
        });
    }
};
exports.TablesService = TablesService;
exports.TablesService = TablesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TablesService);
//# sourceMappingURL=tables.service.js.map