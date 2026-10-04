import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminRole } from '@prisma/client';
import { AdminRoles } from '../../common/decorators/admin-roles.decorator';
import { AdminTokenGuard } from '../../common/guards/admin-token.guard';
import { OptionalJwtGuard } from '../../common/guards/optional-jwt.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrdersService } from './orders.service';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(OptionalJwtGuard)
  create(@Body() dto: CreateOrderDto, @Req() req: any) {
    return this.ordersService.create(dto, req.user);
  }

  @Get()
  @UseGuards(AdminTokenGuard)
  @AdminRoles(AdminRole.ORDERS_STAFF)
  findAll(@Query('status') status: string, @Query('type') type: string) {
    return this.ordersService.findAll(status, type);
  }

  @Get('track/:phone')
  trackByPhone(@Param('phone') phone: string) {
    return this.ordersService.findByPhone(phone);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Get('number/:orderNumber')
  findByOrderNumber(@Param('orderNumber') orderNumber: string) {
    return this.ordersService.findByOrderNumber(orderNumber);
  }

  @Patch(':id/status')
  @UseGuards(AdminTokenGuard)
  @AdminRoles(AdminRole.ORDERS_STAFF)
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto);
  }
}
