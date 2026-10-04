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
exports.UploadsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const fs_1 = require("fs");
const path_1 = require("path");
const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
let UploadsService = class UploadsService {
    constructor(configService) {
        this.configService = configService;
    }
    async uploadProductImage(file) {
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException('Only jpg, jpeg, png and webp images are allowed');
        }
        await fs_1.promises.mkdir((0, path_1.join)(process.cwd(), 'public'), { recursive: true });
        const uploadPath = this.configService.get('app.uploadPath') ?? 'public/uploads/products';
        await fs_1.promises.mkdir(uploadPath, { recursive: true });
        const extension = (0, path_1.extname)(file.originalname).toLowerCase() || this.extensionFromMime(file.mimetype);
        const fileName = `product-${Date.now()}-${Math.round(Math.random() * 1_000_000)}${extension}`;
        const filePath = (0, path_1.join)(uploadPath, fileName);
        await fs_1.promises.writeFile(filePath, file.buffer);
        return {
            fileName,
            size: file.size,
            mimeType: file.mimetype,
            url: `/uploads/products/${fileName}`,
        };
    }
    extensionFromMime(mimeType) {
        if (mimeType === 'image/png') {
            return '.png';
        }
        if (mimeType === 'image/webp') {
            return '.webp';
        }
        return '.jpg';
    }
};
exports.UploadsService = UploadsService;
exports.UploadsService = UploadsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], UploadsService);
//# sourceMappingURL=uploads.service.js.map