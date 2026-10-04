"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const throttler_1 = require("@nestjs/throttler");
const app_config_1 = require("./config/app.config");
const database_config_1 = require("./config/database.config");
const prisma_module_1 = require("./prisma/prisma.module");
const health_module_1 = require("./modules/health/health.module");
const categories_module_1 = require("./modules/categories/categories.module");
const products_module_1 = require("./modules/products/products.module");
const orders_module_1 = require("./modules/orders/orders.module");
const offers_module_1 = require("./modules/offers/offers.module");
const uploads_module_1 = require("./modules/uploads/uploads.module");
const admin_module_1 = require("./modules/admin/admin.module");
const delivery_zones_module_1 = require("./modules/delivery-zones/delivery-zones.module");
const auth_module_1 = require("./modules/auth/auth.module");
const settings_module_1 = require("./modules/settings/settings.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [app_config_1.default, database_config_1.default],
            }),
            throttler_1.ThrottlerModule.forRoot([{
                    ttl: 60000,
                    limit: 100,
                }]),
            prisma_module_1.PrismaModule,
            health_module_1.HealthModule,
            categories_module_1.CategoriesModule,
            products_module_1.ProductsModule,
            orders_module_1.OrdersModule,
            offers_module_1.OffersModule,
            uploads_module_1.UploadsModule,
            admin_module_1.AdminModule,
            delivery_zones_module_1.DeliveryZonesModule,
            auth_module_1.AuthModule,
            settings_module_1.SettingsModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map