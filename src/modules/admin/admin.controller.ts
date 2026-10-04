import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminRole } from '@prisma/client';
import { AdminRoles } from '../../common/decorators/admin-roles.decorator';
import { AdminTokenGuard } from '../../common/guards/admin-token.guard';
import { CreateCategoryDto } from '../categories/dto/create-category.dto';
import { UpdateCategoryDto } from '../categories/dto/update-category.dto';
import { CreateOfferDto } from '../offers/dto/create-offer.dto';
import { UpdateOfferDto } from '../offers/dto/update-offer.dto';
import { UpdateOrderStatusDto } from '../orders/dto/update-order-status.dto';
import { CreateProductDto } from '../products/dto/create-product.dto';
import { UpdateProductDto } from '../products/dto/update-product.dto';
import { AdminService } from './admin.service';
import { DeliveryZonesService } from '../delivery-zones/delivery-zones.service';
import { CreateDeliveryZoneDto } from '../delivery-zones/dto/create-delivery-zone.dto';
import { UpdateDeliveryZoneDto } from '../delivery-zones/dto/update-delivery-zone.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminOrderQueryDto } from '../orders/dto/admin-order-query.dto';

import { ProductsService } from '../products/products.service';
import { ProductQueryDto } from '../products/dto/product-query.dto';

@ApiTags('Admin')
@UseGuards(AdminTokenGuard)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly deliveryZonesService: DeliveryZonesService,
    private readonly productsService: ProductsService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('categories')
  findCategories() {
    return this.adminService.findAllCategories();
  }

  @Post('categories')
  @AdminRoles(AdminRole.PRODUCTS_STAFF)
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.adminService.createCategory(dto);
  }

  @Patch('categories/:id')
  @AdminRoles(AdminRole.PRODUCTS_STAFF)
  updateCategory(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.adminService.updateCategory(id, dto);
  }

  @Delete('categories/:id')
  @AdminRoles(AdminRole.ADMIN)
  deleteCategory(@Param('id') id: string) {
    return this.adminService.deleteCategory(id);
  }

  @Get('products')
  findProducts(@Query() query: ProductQueryDto) {
    return this.productsService.findAdmin(query);
  }

  @Get('products/:id')
  findProduct(@Param('id') id: string) {
    return this.productsService.findAdminById(id);
  }

  @Post('products')
  @AdminRoles(AdminRole.PRODUCTS_STAFF)
  createProduct(@Body() dto: CreateProductDto) {
    return this.adminService.createProduct(dto);
  }

  @Patch('products/:id')
  @AdminRoles(AdminRole.PRODUCTS_STAFF)
  updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.adminService.updateProduct(id, dto);
  }

  @Delete('products/:id')
  @AdminRoles(AdminRole.ADMIN)
  deleteProduct(@Param('id') id: string) {
    return this.adminService.deleteProduct(id);
  }

  @Get('orders')
  @AdminRoles(AdminRole.ORDERS_STAFF)
  findOrders(@Query() query: AdminOrderQueryDto) {
    return this.adminService.findOrders(query);
  }

  @Get('orders/:id')
  @AdminRoles(AdminRole.ORDERS_STAFF)
  findOrder(@Param('id') id: string) {
    return this.adminService.findOrder(id);
  }

  @Patch('orders/:id/status')
  @AdminRoles(AdminRole.ORDERS_STAFF)
  updateOrderStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.adminService.updateOrderStatus(id, dto);
  }

  @Get('stats')
  async getDashboardStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalOrders,
      todayOrders,
      totalRevenue,
      todayRevenue,
      totalProducts,
      totalCategories,
      pendingOrders,
      ordersByStatus,
      recentOrders,
      topProducts,
    ] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.count({ where: { createdAt: { gte: today } } }),
      this.prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: { notIn: ['CANCELLED'] } },
      }),
      this.prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: { notIn: ['CANCELLED'] }, createdAt: { gte: today } },
      }),
      this.prisma.product.count({ where: { isActive: true } }),
      this.prisma.category.count({ where: { isActive: true } }),
      this.prisma.order.count({ where: { status: { in: ['NEW', 'PENDING'] } } }),
      this.prisma.order.groupBy({
        by: ['status'],
        _count: { _all: true },
      }),
      this.prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { items: true, deliveryZone: true },
      }),
      this.prisma.orderItem.groupBy({
        by: ['productName'],
        _sum: { quantity: true },
        _count: { _all: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5,
      }),
    ]);

    return {
      totalOrders,
      todayOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      todayRevenue: todayRevenue._sum.totalAmount || 0,
      totalProducts,
      totalCategories,
      pendingOrders,
      ordersByStatus: ordersByStatus.map(item => ({
        status: item.status,
        count: item._count._all,
      })),
      recentOrders,
      topProducts: topProducts.map(item => ({
        name: item.productName,
        quantity: item._sum.quantity,
        orderCount: item._count._all,
      })),
    };
  }

  @Get('stats/revenue-timeline')
  async getRevenueTimeline(@Query('days') days: string = '30') {
    const daysNum = parseInt(days, 10) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysNum);
    startDate.setHours(0, 0, 0, 0);

    const data = await this.prisma.$queryRaw<Array<{ date: Date; revenue: any }>>`
      SELECT DATE("createdAt") as date, COALESCE(SUM("totalAmount"), 0) as revenue
      FROM "Order"
      WHERE "createdAt" >= ${startDate} AND "status" != 'CANCELLED'
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `;
    
    return data.map(item => ({
      date: item.date,
      revenue: Number(item.revenue),
    }));
  }

  @Get('stats/orders-timeline')
  async getOrdersTimeline(@Query('days') days: string = '30') {
    const daysNum = parseInt(days, 10) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysNum);
    startDate.setHours(0, 0, 0, 0);

    const data = await this.prisma.$queryRaw<Array<{ date: Date; count: any }>>`
      SELECT DATE("createdAt") as date, COUNT(*) as count
      FROM "Order"
      WHERE "createdAt" >= ${startDate}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `;
    
    return data.map(item => ({
      date: item.date,
      count: Number(item.count),
    }));
  }

  @Get('offers')
  findOffers() {
    return this.adminService.findAllOffers();
  }

  @Post('offers')
  @AdminRoles(AdminRole.PRODUCTS_STAFF)
  createOffer(@Body() dto: CreateOfferDto) {
    return this.adminService.createOffer(dto);
  }

  @Patch('offers/:id')
  @AdminRoles(AdminRole.PRODUCTS_STAFF)
  updateOffer(@Param('id') id: string, @Body() dto: UpdateOfferDto) {
    return this.adminService.updateOffer(id, dto);
  }

  @Delete('offers/:id')
  @AdminRoles(AdminRole.ADMIN)
  deleteOffer(@Param('id') id: string) {
    return this.adminService.deleteOffer(id);
  }

  @Get('delivery-zones')
  findDeliveryZones() {
    return this.deliveryZonesService.findAll();
  }

  @Post('delivery-zones')
  @AdminRoles(AdminRole.ADMIN)
  createDeliveryZone(@Body() dto: CreateDeliveryZoneDto) {
    return this.deliveryZonesService.create(dto);
  }

  @Patch('delivery-zones/:id')
  @AdminRoles(AdminRole.ADMIN)
  updateDeliveryZone(@Param('id') id: string, @Body() dto: UpdateDeliveryZoneDto) {
    return this.deliveryZonesService.update(id, dto);
  }

  @Delete('delivery-zones/:id')
  @AdminRoles(AdminRole.ADMIN)
  deleteDeliveryZone(@Param('id') id: string) {
    return this.deliveryZonesService.delete(id);
  }
}
