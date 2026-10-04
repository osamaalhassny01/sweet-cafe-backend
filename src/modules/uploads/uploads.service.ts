import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { promises as fs } from 'fs';
import { extname, join } from 'path';

const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

@Injectable()
export class UploadsService {
  constructor(private readonly configService: ConfigService) {}

  async uploadProductImage(file: Express.Multer.File) {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Only jpg, jpeg, png and webp images are allowed');
    }

    await fs.mkdir(join(process.cwd(), 'public'), { recursive: true });
    
    const uploadPath = this.configService.get<string>('app.uploadPath') ?? 'public/uploads/products';
    await fs.mkdir(uploadPath, { recursive: true });

    const extension = extname(file.originalname).toLowerCase() || this.extensionFromMime(file.mimetype);
    const fileName = `product-${Date.now()}-${Math.round(Math.random() * 1_000_000)}${extension}`;
    const filePath = join(uploadPath, fileName);
    await fs.writeFile(filePath, file.buffer);

    return {
      fileName,
      size: file.size,
      mimeType: file.mimetype,
      url: `/uploads/products/${fileName}`,
    };
  }

  private extensionFromMime(mimeType: string) {
    if (mimeType === 'image/png') {
      return '.png';
    }
    if (mimeType === 'image/webp') {
      return '.webp';
    }
    return '.jpg';
  }
}
