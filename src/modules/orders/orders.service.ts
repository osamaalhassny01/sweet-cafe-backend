import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderStatus, OrderType, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto, CreateOrderItemDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrdersGateway } from './orders.gateway';

interface CalculatedOrderItem {
  productId: string;
  productName: string;
  sizeName?: string;
  quantity: number;
  unitPrice: Prisma.Decimal;
  totalPrice: Prisma.Decimal;
  addons: Array<{ id: string; nameAr: string; nameEn: string; price: string }>;
}

@Injectable()
export class OrdersService {
  private readonly VALID_STATUS_TRANSITIONS: Record<string, Set<string>> = {
    PENDING: new Set(['CONFIRMED', 'CANCELLED']),
    NEW: new Set(['CONFIRMED', 'CANCELLED']),
    CONFIRMED: new Set(['PREPARING', 'CANCELLED']),
    PREPARING: new Set(['READY', 'CANCELLED']),
    READY: new Set(['OUT_FOR_DELIVERY', 'CANCELLED']),
    OUT_FOR_DELIVERY: new Set(['DELIVERED', 'CANCELLED']),
    DELIVERED: new Set(),
    CANCELLED: new Set(),
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly ordersGateway: OrdersGateway,
  ) {}

  async create(
    dto: CreateOrderDto & { offerId?: string },
    authUser?: { sub?: string; type?: string },
  ) {
    if (!dto.items || !dto.items.length) {
      throw new BadRequestException('Order must contain at least one item');
    }

    const calculatedItems = await this.calculateItems(dto.items);
    const subtotal = calculatedItems.reduce(
      (sum, item) => sum.plus(item.totalPrice),
      new Prisma.Decimal(0),
    );

    let zoneId = dto.deliveryZoneId;
    let zone;

    if (zoneId && zoneId !== 'default') {
      zone = await this.prisma.deliveryZone.findUnique({
        where: { id: zoneId },
      });
    }

    // Fallback logic for takeaway or if no zones exist yet
    if (!zone) {
      // Try to find any active zone
      zone = await this.prisma.deliveryZone.findFirst({
        where: { isActive: true },
      });
      
      if (!zone) {
        // If still no zone, check if we can find ANY zone at all (even inactive)
        zone = await this.prisma.deliveryZone.findFirst();
      }

      if (zone) {
        zoneId = zone.id;
      }
    }

    if (!zone) {
      throw new BadRequestException('تعذر إتمام الطلب: لا توجد مناطق توصيل معرفة في النظام');
    }

    if (!zone.isActive && dto.orderType === OrderType.DELIVERY) {
      throw new BadRequestException('منطقة التوصيل المختارة غير متاحة حالياً');
    }

    if (dto.orderType === OrderType.DELIVERY && subtotal.lt(zone.minOrderAmount)) {
      const minAmountYER = Number(zone.minOrderAmount) * 100;
      throw new BadRequestException(
        `الحد الأدنى للطلب لهذه المنطقة هو ${minAmountYER} ر.ي`,
      );
    }

    const deliveryFee = dto.orderType === OrderType.DELIVERY ? zone.deliveryFee : new Prisma.Decimal(0);
    let discount = new Prisma.Decimal(0);

    if (dto.offerId) {
      const offer = await this.prisma.offer.findUnique({
        where: { id: dto.offerId },
      });
      if (
        offer &&
        offer.isActive &&
        offer.startsAt <= new Date() &&
        offer.endsAt >= new Date()
      ) {
        discount = subtotal.mul(offer.discountPercent).div(100);
      }
    }

    const totalAmount = subtotal.plus(deliveryFee).minus(discount);
    const orderNumber = await this.nextOrderNumber();
    let customerId: string | undefined;
    let customerName = dto.customerName;
    let customerPhone = dto.customerPhone;

    if (authUser?.type === 'customer' && authUser.sub) {
      const customer = await this.prisma.customer.findUnique({
        where: { id: authUser.sub },
      });
      if (customer?.isActive) {
        customerId = customer.id;
        customerName = customer.name;
        customerPhone = customer.phone;
      }
    }

    const order = await this.prisma.order.create({
      data: {
        orderNumber,
        customerId,
        customerName,
        customerPhone,
        address: dto.address,
        buildingNumber: dto.buildingNumber || '',
        floor: dto.floor || '',
        landmark: dto.landmark || '',
        latitude: dto.latitude || 0,
        longitude: dto.longitude || 0,
        deliveryZoneId: zoneId,
        orderType: dto.orderType || OrderType.DELIVERY,
        notes: dto.notes || '',
        paymentMethod: dto.paymentMethod || 'CASH',
        subtotal,
        deliveryFee,
        discount,
        totalAmount,
        status: OrderStatus.NEW,
        items: {
          create: calculatedItems.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            sizeName: item.sizeName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            addons: item.addons,
          })),
        },
      },
      include: { items: true, deliveryZone: true },
    });

    this.ordersGateway.broadcastNewOrder(order);

    return order;
  }

  async findAll(status?: string, type?: string) {
    const where: Prisma.OrderWhereInput = {};
    if (status) where.status = status as OrderStatus;
    if (type) where.orderType = type as OrderType;

    return this.prisma.order.findMany({
      where,
      include: {
        items: true,
        deliveryZone: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByPhone(phone: string) {
    return this.prisma.order.findMany({
      where: { customerPhone: phone },
      include: {
        items: true,
        deliveryZone: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        deliveryZone: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async findByOrderNumber(orderNumber: string) {
    const order = await this.prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: true,
        deliveryZone: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`الطلب رقم ${orderNumber} غير موجود`);
    }

    return order;
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    const allowedTransitions = this.VALID_STATUS_TRANSITIONS[order.status];
    if (!allowedTransitions?.has(dto.status)) {
      throw new BadRequestException(
        `لا يمكن تغيير حالة الطلب من "${order.status}" إلى "${dto.status}"`,
      );
    }

    const updateData: any = { status: dto.status };

    if (dto.status === OrderStatus.OUT_FOR_DELIVERY) {
      updateData.pickedUpAt = new Date();
    } else if (dto.status === OrderStatus.DELIVERED) {
      updateData.deliveredAt = new Date();
    }

    const updated = await this.prisma.order.update({
      where: { id },
      data: updateData,
      include: { items: true, deliveryZone: true },
    });

    this.ordersGateway.broadcastOrderStatusUpdate(updated);
    return updated;
  }

  private async calculateItems(
    items: CreateOrderItemDto[],
  ): Promise<CalculatedOrderItem[]> {
    const productIds = [...new Set(items.map((item) => item.productId))];
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
      include: {
        sizes: true,
        addons: { where: { isActive: true } },
      },
    });

    return items.map((item) => {
      const product = products.find(
        (candidate) => candidate.id === item.productId,
      );
      if (!product) {
        throw new BadRequestException(
          `Product ${item.productId} was not found`,
        );
      }
      if (!product.isAvailable) {
        throw new BadRequestException(
          `Product ${product.nameAr} is not available`,
        );
      }

      const selectedSize = item.sizeId
        ? product.sizes.find((size) => size.id === item.sizeId)
        : product.sizes.find((size) => size.isDefault);

      if (item.sizeId && !selectedSize) {
        throw new BadRequestException(
          `Invalid size for product ${product.nameAr}`,
        );
      }

      const unitBasePrice = selectedSize?.price ?? product.price;
      const requestedAddonIds = item.addonIds ?? [];
      const selectedAddons = requestedAddonIds.map((addonId) => {
        const addon = product.addons.find(
          (candidate) => candidate.id === addonId,
        );
        if (!addon) {
          throw new BadRequestException(
            `Invalid addon for product ${product.nameAr}`,
          );
        }
        return addon;
      });

      const addonTotal = selectedAddons.reduce(
        (sum, addon) => sum.plus(addon.price),
        new Prisma.Decimal(0),
      );
      const unitPrice = unitBasePrice.plus(addonTotal);
      const totalPrice = unitPrice.mul(item.quantity);

      return {
        productId: product.id,
        productName: product.nameAr,
        sizeName: selectedSize?.name,
        quantity: item.quantity,
        unitPrice,
        totalPrice,
        addons: selectedAddons.map((addon) => ({
          id: addon.id,
          nameAr: addon.nameAr,
          nameEn: addon.nameEn,
          price: addon.price.toString(),
        })),
      };
    });
  }

  private async nextOrderNumber(): Promise<string> {
    const result = await this.prisma.$queryRaw<Array<{ value: number }>>`
      INSERT INTO "Counter" ("key", "value")
      VALUES ('order_number', 1)
      ON CONFLICT ("key") DO UPDATE SET "value" = "Counter"."value" + 1
      RETURNING "value"
    `;
    const num = result[0].value.toString().padStart(6, '0');
    return `SC-${num}`;
  }
}
