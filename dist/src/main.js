"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const express_1 = require("express");
const path_1 = require("path");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const transform_response_interceptor_1 = require("./common/interceptors/transform-response.interceptor");
async function bootstrap() {
    const logger = new common_1.Logger('SweetCafeBootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        bufferLogs: true,
    });
    const configService = app.get(config_1.ConfigService);
    app.enableCors({
        origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',').map(o => o.trim()) : true,
        credentials: true,
    });
    app.use((0, express_1.json)({ limit: '10mb' }));
    app.use((0, express_1.urlencoded)({ extended: true, limit: '10mb' }));
    app.useStaticAssets((0, path_1.join)(process.cwd(), 'public', 'uploads'), {
        prefix: '/uploads',
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalInterceptors(new transform_response_interceptor_1.TransformResponseInterceptor());
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Kafi Bun API')
        .setDescription('واجهة برمجة تطبيقات Kafi Bun')
        .setVersion('1.0')
        .addApiKey({ type: 'apiKey', name: 'x-admin-key', in: 'header' }, 'admin-key')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = configService.get('app.port') ?? 3000;
    await app.listen(port);
    logger.log(`Kafi Bun API is running on http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map