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
exports.DeliveryZonesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const admin_roles_decorator_1 = require("../../common/decorators/admin-roles.decorator");
const admin_token_guard_1 = require("../../common/guards/admin-token.guard");
const delivery_zones_service_1 = require("./delivery-zones.service");
const create_delivery_zone_dto_1 = require("./dto/create-delivery-zone.dto");
const update_delivery_zone_dto_1 = require("./dto/update-delivery-zone.dto");
let DeliveryZonesController = class DeliveryZonesController {
    constructor(deliveryZonesService) {
        this.deliveryZonesService = deliveryZonesService;
    }
    findAll() {
        return this.deliveryZonesService.findAll();
    }
    findOne(id) {
        return this.deliveryZonesService.findOne(id);
    }
    create(dto) {
        return this.deliveryZonesService.create(dto);
    }
    update(id, dto) {
        return this.deliveryZonesService.update(id, dto);
    }
    delete(id) {
        return this.deliveryZonesService.delete(id);
    }
};
exports.DeliveryZonesController = DeliveryZonesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DeliveryZonesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DeliveryZonesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(admin_token_guard_1.AdminTokenGuard),
    (0, admin_roles_decorator_1.AdminRoles)(client_1.AdminRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_delivery_zone_dto_1.CreateDeliveryZoneDto]),
    __metadata("design:returntype", void 0)
], DeliveryZonesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(admin_token_guard_1.AdminTokenGuard),
    (0, admin_roles_decorator_1.AdminRoles)(client_1.AdminRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_delivery_zone_dto_1.UpdateDeliveryZoneDto]),
    __metadata("design:returntype", void 0)
], DeliveryZonesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(admin_token_guard_1.AdminTokenGuard),
    (0, admin_roles_decorator_1.AdminRoles)(client_1.AdminRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DeliveryZonesController.prototype, "delete", null);
exports.DeliveryZonesController = DeliveryZonesController = __decorate([
    (0, swagger_1.ApiTags)('Delivery Zones'),
    (0, common_1.Controller)('delivery-zones'),
    __metadata("design:paramtypes", [delivery_zones_service_1.DeliveryZonesService])
], DeliveryZonesController);
//# sourceMappingURL=delivery-zones.controller.js.map