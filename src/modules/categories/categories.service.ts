import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  findPublic() {
    return this.prisma.category.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  }

  findAll() {
    return this.prisma.category.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async findPublicById(id: string) {
    const category = await this.prisma.category.findFirst({
      where: { id, isActive: true },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  create(data: CreateCategoryDto) {
    return this.prisma.category.create({
      data: {
        ...data,
        description: data.description ?? "",
        imageUrl: data.imageUrl ?? "",
      },
    });
  }

  update(id: string, data: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: { id },
      data: {
        ...data,
        description: data.description ?? "",
        imageUrl: data.imageUrl ?? "",
      },
    });
  }

  softDelete(id: string) {
    return this.prisma.category.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
