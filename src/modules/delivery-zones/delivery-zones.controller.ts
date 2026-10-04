import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminRole } from '@prisma/client';
import { AdminRoles } from '../../common/decorators/admin-roles.decorator';
import { AdminTokenGuard } from '../../common/guards/admin-token.guard';
import { DeliveryZonesService } from './delivery-zones.service';
import { CreateDeliveryZoneDto } from './dto/create-delivery-zone.dto';
import { UpdateDeliveryZoneDto } from './dto/update-delivery-zone.dto';

@ApiTags('Delivery Zones')
@Controller('delivery-zones')
export class DeliveryZonesController {
  constructor(private readonly deliveryZonesService: DeliveryZonesService) {}

  @Get()
  findAll() {
    return this.deliveryZonesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deliveryZonesService.findOne(id);
  }

  @Post()
  @UseGuards(AdminTokenGuard)
  @AdminRoles(AdminRole.ADMIN)
  create(@Body() dto: CreateDeliveryZoneDto) {
    return this.deliveryZonesService.create(dto);
  }

  @Patch(':id')
  @UseGuards(AdminTokenGuard)
  @AdminRoles(AdminRole.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateDeliveryZoneDto) {
    return this.deliveryZonesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AdminTokenGuard)
  @AdminRoles(AdminRole.ADMIN)
  delete(@Param('id') id: string) {
    return this.deliveryZonesService.delete(id);
  }
}
