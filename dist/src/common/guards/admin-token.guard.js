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
var AdminTokenGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminTokenGuard = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const core_1 = require("@nestjs/core");
const client_1 = require("@prisma/client");
const admin_roles_decorator_1 = require("../decorators/admin-roles.decorator");
const prisma_service_1 = require("../../prisma/prisma.service");
let AdminTokenGuard = AdminTokenGuard_1 = class AdminTokenGuard {
    constructor(configService, jwtService, reflector, prisma) {
        this.configService = configService;
        this.jwtService = jwtService;
        this.reflector = reflector;
        this.prisma = prisma;
        this.logger = new common_1.Logger(AdminTokenGuard_1.name);
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const requiredRoles = this.reflector.getAllAndOverride(admin_roles_decorator_1.ADMIN_ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]) ?? [];
        const expectedKey = this.configService.get('app.adminApiKey');
        const adminKey = request.headers['x-admin-key'];
        if (expectedKey && adminKey === expectedKey) {
            request.user = {
                type: 'admin',
                role: client_1.AdminRole.ADMIN,
                authMode: 'apiKey',
            };
            return true;
        }
        const authHeader = request.headers['authorization'];
        if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            try {
                const payload = await this.jwtService.verifyAsync(token);
                if (payload && payload.sub && payload.type === 'admin') {
                    const user = await this.prisma.adminUser.findUnique({
                        where: { id: payload.sub },
                    });
                    if (!user || !user.isActive) {
                        throw new common_1.UnauthorizedException('حساب الإدارة غير نشط');
                    }
                    if (!this.roleAllowed(user.role, requiredRoles)) {
                        throw new common_1.ForbiddenException('لا تملك صلاحية تنفيذ هذه العملية');
                    }
                    request.user = {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                        type: 'admin',
                    };
                    return true;
                }
            }
            catch (error) {
                if (error instanceof common_1.ForbiddenException || error instanceof common_1.UnauthorizedException) {
                    throw error;
                }
            }
        }
        if (!expectedKey) {
            this.logger.error('ADMIN_API_KEY is not configured! Admin endpoints are BLOCKED. Set the ADMIN_API_KEY environment variable.');
        }
        throw new common_1.UnauthorizedException('مفتاح المصادقة غير صالح');
    }
    roleAllowed(role, requiredRoles) {
        if (role === client_1.AdminRole.ADMIN)
            return true;
        if (!requiredRoles.length)
            return true;
        return requiredRoles.includes(role);
    }
};
exports.AdminTokenGuard = AdminTokenGuard;
exports.AdminTokenGuard = AdminTokenGuard = AdminTokenGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        jwt_1.JwtService,
        core_1.Reflector,
        prisma_service_1.PrismaService])
], AdminTokenGuard);
//# sourceMappingURL=admin-token.guard.js.map