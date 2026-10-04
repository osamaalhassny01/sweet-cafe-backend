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
exports.CustomerAuthController = exports.AdminAuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const client_1 = require("@prisma/client");
const auth_service_1 = require("./auth.service");
const login_dto_1 = require("./dto/login.dto");
const register_dto_1 = require("./dto/register.dto");
const customer_auth_dto_1 = require("./dto/customer-auth.dto");
const update_admin_user_dto_1 = require("./dto/update-admin-user.dto");
const admin_token_guard_1 = require("../../common/guards/admin-token.guard");
const admin_roles_decorator_1 = require("../../common/decorators/admin-roles.decorator");
let AdminAuthController = class AdminAuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(dto) {
        return this.authService.login(dto);
    }
    async register(dto) {
        return this.authService.register(dto);
    }
    async listUsers() {
        return this.authService.listAdminUsers();
    }
    async updateUser(id, dto) {
        return this.authService.updateAdminUser(id, dto);
    }
    async deactivateUser(id) {
        return this.authService.deactivateAdminUser(id);
    }
    async getProfile(req) {
        return this.authService.getProfile(req.user.id);
    }
};
exports.AdminAuthController = AdminAuthController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AdminAuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('register'),
    (0, common_1.UseGuards)(admin_token_guard_1.AdminTokenGuard),
    (0, admin_roles_decorator_1.AdminRoles)(client_1.AdminRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AdminAuthController.prototype, "register", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, common_1.UseGuards)(admin_token_guard_1.AdminTokenGuard),
    (0, admin_roles_decorator_1.AdminRoles)(client_1.AdminRole.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminAuthController.prototype, "listUsers", null);
__decorate([
    (0, common_1.Patch)('users/:id'),
    (0, common_1.UseGuards)(admin_token_guard_1.AdminTokenGuard),
    (0, admin_roles_decorator_1.AdminRoles)(client_1.AdminRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_admin_user_dto_1.UpdateAdminUserDto]),
    __metadata("design:returntype", Promise)
], AdminAuthController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Delete)('users/:id'),
    (0, common_1.UseGuards)(admin_token_guard_1.AdminTokenGuard),
    (0, admin_roles_decorator_1.AdminRoles)(client_1.AdminRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminAuthController.prototype, "deactivateUser", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminAuthController.prototype, "getProfile", null);
exports.AdminAuthController = AdminAuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('admin/auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AdminAuthController);
let CustomerAuthController = class CustomerAuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async register(dto) {
        return this.authService.registerCustomer(dto);
    }
    async login(dto) {
        return this.authService.loginCustomer(dto);
    }
};
exports.CustomerAuthController = CustomerAuthController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [customer_auth_dto_1.CustomerRegisterDto]),
    __metadata("design:returntype", Promise)
], CustomerAuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [customer_auth_dto_1.CustomerLoginDto]),
    __metadata("design:returntype", Promise)
], CustomerAuthController.prototype, "login", null);
exports.CustomerAuthController = CustomerAuthController = __decorate([
    (0, swagger_1.ApiTags)('Customer Auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], CustomerAuthController);
//# sourceMappingURL=auth.controller.js.map