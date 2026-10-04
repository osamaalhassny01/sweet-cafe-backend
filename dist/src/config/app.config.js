"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    app: {
        env: process.env.APP_ENV ?? 'development',
        port: Number(process.env.PORT ?? 4000),
        uploadPath: process.env.UPLOAD_PATH ?? 'public/uploads/products',
        adminApiKey: process.env.ADMIN_API_KEY ?? '',
        seedProductsJson: process.env.SEED_PRODUCTS_JSON ??
            'C:/Users/DrCinco/Downloads/sweet_cafe_4000_real_products.json',
    },
});
//# sourceMappingURL=app.config.js.map