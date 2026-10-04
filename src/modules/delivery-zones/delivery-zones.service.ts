import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDeliveryZoneDto } from './dto/create-delivery-zone.dto';
import { UpdateDeliveryZoneDto } from './dto/update-delivery-zone.dto';

@Injectable()
export class DeliveryZonesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const zones = await this.prisma.deliveryZone.findMany({
      where: { isActive: true },
      orderBy: { nameAr: 'asc' },
    });

    if (zones.length === 0) {
      return [
        {
          id: 'default',
          nameAr: 'جميع المناطق',
          nameEn: 'All Areas',
          description: 'توصيل لجميع المناطق',
          deliveryFee: 0,
          estimatedMinutes: 30,
          minOrderAmount: 10,
          polygon: {},
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
    }

    return zones;
  }

  async findOne(id: string) {
    const zone = await this.prisma.deliveryZone.findUnique({
      where: { id },
    });

    if (!zone) {
      throw new NotFoundException('Delivery zone not found');
    }

    return zone;
  }

  async create(dto: CreateDeliveryZoneDto) {
    return this.prisma.deliveryZone.create({
      data: {
        nameAr: dto.nameAr,
        nameEn: dto.nameEn,
        description: dto.description || '',
        deliveryFee: dto.deliveryFee,
        estimatedMinutes: dto.estimatedMinutes || 30,
        minOrderAmount: dto.minOrderAmount ?? 10,
        polygon: dto.polygon || {},
        isActive: true,
      },
    });
  }

  async update(id: string, dto: UpdateDeliveryZoneDto) {
    await this.findOne(id);

    return this.prisma.deliveryZone.update({
      where: { id },
      data: {
        nameAr: dto.nameAr,
        nameEn: dto.nameEn,
        description: dto.description,
        deliveryFee: dto.deliveryFee,
        estimatedMinutes: dto.estimatedMinutes,
        minOrderAmount: dto.minOrderAmount,
        polygon: dto.polygon,
      },
    });
  }

  async delete(id: string) {
    await this.findOne(id);

    return this.prisma.deliveryZone.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
