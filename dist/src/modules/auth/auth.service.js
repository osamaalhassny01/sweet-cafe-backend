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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../prisma/prisma.service");
const bcrypt = require("bcryptjs");
const client_1 = require("@prisma/client");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async validateUser(email, password) {
        const user = await this.prisma.adminUser.findUnique({ where: { email } });
        if (!user || !user.isActive)
            return null;
        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid)
            return null;
        return user;
    }
    async login(dto) {
        const user = await this.validateUser(dto.email, dto.password);
        if (!user) {
            throw new common_1.UnauthorizedException('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        }
        const payload = {
            sub: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            type: 'admin',
        };
        const accessToken = await this.jwtService.signAsync(payload);
        return {
            accessToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
            },
        };
    }
    async register(dto) {
        const existing = await this.prisma.adminUser.findUnique({ where: { email: dto.email } });
        if (existing) {
            throw new common_1.ConflictException('البريد الإلكتروني مستخدم بالفعل');
        }
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.adminUser.create({
            data: {
                name: dto.name,
                email: dto.email,
                passwordHash,
                role: dto.role ?? client_1.AdminRole.ORDERS_STAFF,
                isActive: true,
            },
        });
        return { id: user.id, name: user.name, email: user.email, role: user.role };
    }
    async getProfile(userId) {
        const user = await this.prisma.adminUser.findUnique({ where: { id: userId } });
        if (!user)
            return null;
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
        };
    }
    async listAdminUsers() {
        return this.prisma.adminUser.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateAdminUser(id, dto) {
        const user = await this.prisma.adminUser.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('المستخدم غير موجود');
        const data = {
            name: dto.name,
            email: dto.email,
            role: dto.role,
            isActive: dto.isActive,
        };
        Object.keys(data).forEach((key) => data[key] === undefined && delete data[key]);
        if (dto.password) {
            data.passwordHash = await bcrypt.hash(dto.password, 10);
        }
        const updated = await this.prisma.adminUser.update({
            where: { id },
            data,
        });
        return {
            id: updated.id,
            name: updated.name,
            email: updated.email,
            role: updated.role,
            isActive: updated.isActive,
        };
    }
    async deactivateAdminUser(id) {
        const updated = await this.prisma.adminUser.update({
            where: { id },
            data: { isActive: false },
        });
        return {
            id: updated.id,
            name: updated.name,
            email: updated.email,
            role: updated.role,
            isActive: updated.isActive,
        };
    }
    async registerCustomer(dto) {
        const existing = await this.prisma.customer.findUnique({
            where: { phone: dto.phone },
        });
        if (existing) {
            throw new common_1.ConflictException('رقم الهاتف مسجل بالفعل، سجّل الدخول بكلمة السر');
        }
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const customer = await this.prisma.customer.create({
            data: {
                name: dto.name.trim(),
                phone: dto.phone,
                passwordHash,
                isActive: true,
            },
        });
        return this.createCustomerSession(customer);
    }
    async loginCustomer(dto) {
        const customer = await this.prisma.customer.findUnique({
            where: { phone: dto.phone },
        });
        if (!customer || !customer.isActive) {
            throw new common_1.UnauthorizedException('رقم الهاتف أو كلمة السر غير صحيحة');
        }
        const isValid = await bcrypt.compare(dto.password, customer.passwordHash);
        if (!isValid) {
            throw new common_1.UnauthorizedException('رقم الهاتف أو كلمة السر غير صحيحة');
        }
        return this.createCustomerSession(customer);
    }
    async createCustomerSession(customer) {
        const payload = {
            sub: customer.id,
            name: customer.name,
            phone: customer.phone,
            type: 'customer',
        };
        const accessToken = await this.jwtService.signAsync(payload);
        return {
            accessToken,
            user: {
                id: customer.id,
                name: customer.name,
                phone: customer.phone,
                isActive: customer.isActive,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map