import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { paginationSkip, buildPaginationMeta } from '../../common/utils/pagination.util';
import { PrismaService } from '../../prisma/prisma.service';
import { paginatedResponse } from '../../shared/response/response-builder';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findPublic(query: ProductQueryDto) {
    return this.findMany(query, false);
  }

  async findAdmin(query: ProductQueryDto) {
    return this.findMany(query, true);
  }

  private async findMany(query: ProductQueryDto, includeInactive: boolean) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;
    const where = this.buildWhere(query, includeInactive);
    const orderBy = this.buildOrderBy(query);

    const [data, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        include: this.productDetailsInclude(),
        orderBy,
        skip: paginationSkip(page, limit),
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return paginatedResponse(data, buildPaginationMeta(page, limit, total));
  }

  async findPublicById(id: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, isActive: true },
      include: this.productDetailsInclude(),
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async findAdminById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: this.productDetailsInclude(),
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  create(data: CreateProductDto) {
    const { sizes, addons, galleryImages, ...productData } = data;
    return this.prisma.product.create({
      data: {
        ...productData,
        description: data.description ?? "",
        imageUrl: data.imageUrl ?? "",
        oldPrice: data.oldPrice ?? 0,
        galleryImages: galleryImages ?? [],
        sizes: sizes?.length ? { create: sizes } : undefined,
        addons: addons?.length ? { create: addons } : undefined,
      },
      include: this.productDetailsInclude(),
    });
  }

  update(id: string, data: UpdateProductDto) {
    const { sizes, addons, galleryImages, ...productData } = data;
    return this.prisma.product.update({
      where: { id },
      data: {
        ...productData,
        ...(galleryImages !== undefined ? { galleryImages } : {}),
        ...(sizes
          ? {
              sizes: {
                deleteMany: {},
                create: sizes,
              },
            }
          : {}),
        ...(addons
          ? {
              addons: {
                deleteMany: {},
                create: addons,
              },
            }
          : {}),
      },
      include: this.productDetailsInclude(),
    });
  }

  softDelete(id: string) {
    return this.prisma.product.update({
      where: { id },
      data: { isActive: false, isAvailable: false },
    });
  }

  private buildWhere(query: ProductQueryDto, includeInactive = false): Prisma.ProductWhereInput {
    return {
      ...(includeInactive ? {} : { isActive: true }),
      ...(includeInactive && query.isActive !== undefined ? { isActive: query.isActive } : {}),
      ...(query.categoryId ? { categoryId: query.categoryId } : {}),
      ...(query.isAvailable !== undefined ? { isAvailable: query.isAvailable } : {}),
      ...(query.isFeatured !== undefined ? { isFeatured: query.isFeatured } : {}),
      ...(query.isBestSeller !== undefined ? { isBestSeller: query.isBestSeller } : {}),
      ...(query.minPrice !== undefined || query.maxPrice !== undefined
        ? {
            price: {
              ...(query.minPrice !== undefined ? { gte: query.minPrice } : {}),
              ...(query.maxPrice !== undefined ? { lte: query.maxPrice } : {}),
            },
          }
        : {}),
      ...(query.search
        ? {
            OR: [
              { nameAr: { contains: query.search, mode: 'insensitive' } },
              { nameEn: { contains: query.search, mode: 'insensitive' } },
              { description: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };
  }

  private buildOrderBy(query: ProductQueryDto): Prisma.ProductOrderByWithRelationInput[] {
    const sortBy = query.sortBy ?? 'sortOrder';
    const sortOrder = query.sortOrder ?? 'asc';
    return [{ [sortBy]: sortOrder }, { createdAt: 'desc' }];
  }

  private productDetailsInclude() {
    return {
      category: true,
      sizes: { orderBy: { price: 'asc' as const } },
      addons: { where: { isActive: true }, orderBy: { price: 'asc' as const } },
    };
  }
}
