import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';

@Injectable()
export class OffersService {
  constructor(private readonly prisma: PrismaService) {}

  findActive() {
    const now = new Date();
    return this.prisma.offer.findMany({
      where: {
        isActive: true,
        startsAt: { lte: now },
        endsAt: { gte: now },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  findAll() {
    return this.prisma.offer.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  create(data: CreateOfferDto) {
    return this.prisma.offer.create({
      data: {
        ...data,
        description: data.description ?? "",
        imageUrl: data.imageUrl ?? "",
      },
    });
  }

  update(id: string, data: UpdateOfferDto) {
    return this.prisma.offer.update({
      where: { id },
      data: {
        ...data,
        description: data.description ?? "",
        imageUrl: data.imageUrl ?? "",
      },
    });
  }

  async softDelete(id: string) {
    const offer = await this.prisma.offer.findUnique({ where: { id } });
    if (!offer) {
      throw new NotFoundException('Offer not found');
    }

    return this.prisma.offer.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
