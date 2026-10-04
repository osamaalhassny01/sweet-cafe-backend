import { ConfigService } from '@nestjs/config';
export declare class UploadsService {
    private readonly configService;
    constructor(configService: ConfigService);
    uploadProductImage(file: Express.Multer.File): Promise<{
        fileName: string;
        size: number;
        mimeType: string;
        url: string;
    }>;
    private extensionFromMime;
}
