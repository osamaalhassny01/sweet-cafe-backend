import { Injectable } from '@nestjs/common';
import { CategoriesService } from '../categories/categories.service';
import { CreateCategoryDto } from '../categories/dto/create-category.dto';
import { UpdateCategoryDto } from '../categories/dto/update-category.dto';
import { CreateOfferDto } from '../offers/dto/create-offer.dto';
import { UpdateOfferDto } from '../offers/dto/update-offer.dto';
import { OffersService } from '../offers/offers.service';
import { OrdersService } from '../orders/orders.service';
import { UpdateOrderStatusDto } from '../orders/dto/update-order-status.dto';
import { CreateProductDto } from '../products/dto/create-product.dto';
import { UpdateProductDto } from '../products/dto/update-product.dto';
import { ProductsService } from '../products/products.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminOrderQueryDto } from '../orders/dto/admin-order-query.dto';
import { Prisma } from '@prisma/client';
import { buildPaginationMeta, paginationSkip } from '../../common/utils/pagination.util';

@Injectable()
export class AdminService {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly productsService: ProductsService,
    private readonly ordersService: OrdersService,
    private readonly offersService: OffersService,
    private readonly prisma: PrismaService,
  ) {}

  createCategory(dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  findAllCategories() {
    return this.categoriesService.findAll();
  }

  updateCategory(id: string, dto: UpdateCategoryDto) {
    return this.categoriesService.update(id, dto);
  }

  deleteCategory(id: string) {
    return this.categoriesService.softDelete(id);
  }

  createProduct(dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  updateProduct(id: string, dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  deleteProduct(id: string) {
    return this.productsService.softDelete(id);
  }

  async findOrders(query: AdminOrderQueryDto) {
    const {
      page = 1,
      limit = 10,
      status,
      type,
      startDate,
      endDate,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const where: Prisma.OrderWhereInput = {};

    if (status) {
      where.status = status;
    }

    if (type) {
      where.orderType = type;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search, mode: 'insensitive' } },
        { customerPhone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip: paginationSkip(page, limit),
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          items: true,
          deliveryZone: true,
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data,
      meta: buildPaginationMeta(page, limit, total),
    };
  }

  findOrder(id: string) {
    return this.ordersService.findOne(id);
  }

  updateOrderStatus(id: string, dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto);
  }

  createOffer(dto: CreateOfferDto) {
    return this.offersService.create(dto);
  }

  findAllOffers() {
    return this.offersService.findAll();
  }

  updateOffer(id: string, dto: UpdateOfferDto) {
    return this.offersService.update(id, dto);
  }

  deleteOffer(id: string) {
    return this.offersService.softDelete(id);
  }
}
