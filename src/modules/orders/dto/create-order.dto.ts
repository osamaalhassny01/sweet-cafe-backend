import { OrderType, PaymentMethod } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateOrderItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsOptional()
  @IsString()
  sizeId: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  addonIds: string[];

  @IsInt()
  @Type(() => Number)
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsString()
  @IsNotEmpty()
  customerPhone: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  buildingNumber: string;

  @IsOptional()
  @IsString()
  floor: string;

  @IsOptional()
  @IsString()
  landmark: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  latitude: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  longitude: number;

  @IsOptional()
  @IsString()
  deliveryZoneId: string;

  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsOptional()
  @IsEnum(OrderType)
  orderType: OrderType;

  @IsOptional()
  @IsString()
  notes: string;

  @IsOptional()
  @IsString()
  offerId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  @ArrayMinSize(1)
  items: CreateOrderItemDto[];
}