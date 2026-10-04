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
exports.PublicSettingsController = exports.AdminSettingsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const admin_roles_decorator_1 = require("../../common/decorators/admin-roles.decorator");
const admin_token_guard_1 = require("../../common/guards/admin-token.guard");
const settings_service_1 = require("./settings.service");
let AdminSettingsController = class AdminSettingsController {
    constructor(settingsService) {
        this.settingsService = settingsService;
    }
    async getAll() {
        return this.settingsService.getAll();
    }
    async updateSettings(dto) {
        for (const [key, value] of Object.entries(dto)) {
            await this.settingsService.set(key, value);
        }
        return this.settingsService.getAll();
    }
};
exports.AdminSettingsController = AdminSettingsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminSettingsController.prototype, "getAll", null);
__decorate([
    (0, common_1.Patch)(),
    (0, admin_roles_decorator_1.AdminRoles)(client_1.AdminRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminSettingsController.prototype, "updateSettings", null);
exports.AdminSettingsController = AdminSettingsController = __decorate([
    (0, swagger_1.ApiTags)('Settings'),
    (0, common_1.Controller)('admin/settings'),
    (0, common_1.UseGuards)(admin_token_guard_1.AdminTokenGuard),
    __metadata("design:paramtypes", [settings_service_1.SettingsService])
], AdminSettingsController);
let PublicSettingsController = class PublicSettingsController {
    constructor(settingsService) {
        this.settingsService = settingsService;
    }
    async getPublic() {
        return this.settingsService.getPublic();
    }
};
exports.PublicSettingsController = PublicSettingsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicSettingsController.prototype, "getPublic", null);
exports.PublicSettingsController = PublicSettingsController = __decorate([
    (0, swagger_1.ApiTags)('Settings'),
    (0, common_1.Controller)('settings'),
    __metadata("design:paramtypes", [settings_service_1.SettingsService])
], PublicSettingsController);
//# sourceMappingURL=settings.controller.js.map